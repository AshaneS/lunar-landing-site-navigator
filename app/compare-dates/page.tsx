import { addDays, format } from "date-fns";
import landing_regions from "@/data/A3_9regions.json";
import { fetchHorizonsData } from "@/lib/fetchHorizonsData";
import { parseSunHorizonsText } from "@/lib/parseSunHorizonsText";
import { parseEarthHorizonsText } from "@/lib/parseEarthHorizonsText";
import CompareDatesGrid from "@/components/compare-dates/CompareDatesGrid";
import { Suspense } from "react";
import { getDailyPeaks } from "@/lib/getDailySunPeaks";

export async function CompareDatesContent({ searchParams }) {
  const resolvedParams = await searchParams;

  // 1. Get Selected Site (from LandingSiteMenu URL)
  const selectedRegion = landing_regions.features.find(
    (f) => String(f.properties.Region) === resolvedParams.region,
  );

  // Extract lat & lon from URL, or use your South Pole defaults
  const lon = resolvedParams.lon ?? "0";
  const lat = resolvedParams.lat ?? "-89.5";
  const alt = resolvedParams.alt ?? "0";

  // 1. Read selected date AND time
  const selectedDate = resolvedParams.date ?? "2026-Nov-14";
  const selectedTime = resolvedParams.time ?? "00:00";

  // 2. Build the exact start time
  const startTime = `${selectedDate} ${selectedTime}`;
  const chartStopDate = format(
    addDays(new Date(selectedDate), 30),
    "yyyy-MMM-dd",
  );
  const stopTime = `${chartStopDate} 00:00`;

  // Build the API URL using those coordinates
  const siteCoord = `${lon},${lat},0`; // Included alt!

  // FETCH DAILY DATA (1 row per day)
  // Fetch HOURLY data for the whole month (for the calendar peaks)
  const rawMonthlySun = await fetchHorizonsData(
    siteCoord,
    "2026-Nov-01 00:00",
    "2026-Nov-30 23:59", //
    "10",
    "1h",
  );

  const monthlySun = parseSunHorizonsText(rawMonthlySun);

  // Calculate the peaks!
  const dailyPeaks = getDailyPeaks(monthlySun);

  // FETCH 2: Detailed Data for Side Chart
  // 3. Use `startTime` for the Chart fetches!
  const rawChartSun = await fetchHorizonsData(
    siteCoord,
    startTime,
    stopTime,
    "10",
    "2h",
  );
  const rawChartEarth = await fetchHorizonsData(
    siteCoord,
    startTime,
    stopTime,
    "399",
    "2h",
  );

  const chartSun = parseSunHorizonsText(rawChartSun);
  const chartEarth = parseEarthHorizonsText(rawChartEarth);

  console.log("daily peaks", dailyPeaks);

  return (
    <div className="flex flex-col items-center w-full justify-between gap-8 min-h-screen mx-auto max-w-[1600px] px-4 py-4">
      <CompareDatesGrid
        selectedRegion={selectedRegion}
        dailyPeaks={dailyPeaks}
        // Pass empty arrays for the others for now
        chartSunData={chartSun}
        chartEarthData={chartEarth}
      />
    </div>
  );
}

export default function CompareDates({ searchParams }) {
  return (
    <Suspense fallback={<div className="p-8">Loading mission data...</div>}>
      <CompareDatesContent searchParams={searchParams} />
    </Suspense>
  );
}
