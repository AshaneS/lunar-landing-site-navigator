import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { format } from "date-fns";
import { parseSunHorizonsText } from "@/lib/parseSunHorizonsText";
import { parseEarthHorizonsText } from "@/lib/parseEarthHorizonsText";
import landing_regions from "@/data/A3_9regions.json";
import { Suspense } from "react";
import { connection } from "next/server";
import Panel from "@/components/dashboard/Panel";

type SearchParams = Promise<{
  lat?: string;
  lon?: string;
  alt?: string;
  date?: string;
  time?: string;
  region?: string;
}>;

export async function DashboardContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;

  // Check if we have custom coordinates in the URL
  const hasCustomCoords = Boolean(resolvedParams.lat && resolvedParams.lon);

  await connection();
  // Get the date from the URL
  const today = new Date();
  const targetDate = resolvedParams.date ?? format(today, "yyyy-MMM-dd");
  // To calculate the next day, parse it, add a day, and format it back
  const dateObj = new Date(targetDate);
  dateObj.setDate(dateObj.getDate() + 30);
  // Format to match Horizons requirement (yyyy-MMM-dd)
  const nextDate = format(dateObj, "yyyy-MMM-dd");

  // Add 00:00 to be explicit about UT time
  // const startTime = `${targetDate} 00:00`;
  // const stopTime = `${nextDate} 00:00`;

  // If we have custom coords, don't default to Malapert!
  // If we don't, default to Malapert Massif.

  //............Time fetching...................//
  const targetTime = resolvedParams.time ?? "00:00";
  const startTime = `${targetDate} ${targetTime}`;
  const stopTime = `${nextDate} 00:00`;

  const regionName =
    resolvedParams.region ?? (!hasCustomCoords ? "Malapert Massif" : undefined);

  const selectedRegion = landing_regions.features.find(
    (f) => String(f.properties.Region) === regionName,
  );

  // If we have custom coords, use them. If not, use Malapert's center.
  const defaultLon = "-4.7636";
  const defaultLat = "-85.6339";

  console.log(
    selectedRegion?.properties.Region,
    selectedRegion?.geometry.coordinates,
  );
  console.log("start time", startTime, "stopTime", stopTime);

  // Extract lat & lon from URL, or use your South Pole defaults
  const lon = resolvedParams.lon ?? (!hasCustomCoords ? defaultLon : "0");
  const lat = resolvedParams.lat ?? (!hasCustomCoords ? defaultLat : "-89.5");
  const alt = resolvedParams.alt ?? "0";
  // Build the API URL using those coordinates
  const siteCoord = `${lon},${lat},${alt}`; // Included alt!

  const headers = {
    "User-Agent": "LunarDashboard/1.0 (ashanecool@gmail.com)",
  };

  //Build the API URL with dynamic SITE_COORD (format: 'lon,lat,alt')
  const fetchSunURL = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='10'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='coord@301'&COORD_TYPE='GEODETIC'&SITE_COORD='${siteCoord}'&START_TIME='${startTime}'&STOP_TIME='${stopTime}'&STEP_SIZE='1h'&QUANTITIES='4'`;
  const fetchEarthURL = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='399'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='coord@301'&COORD_TYPE='GEODETIC'&SITE_COORD='${siteCoord}'&START_TIME='${startTime}'&STOP_TIME='${stopTime}'&STEP_SIZE='1h'&QUANTITIES='4'`;

  // Fetch the data from NASA
  const sunRes = await fetch(fetchSunURL, {
    headers,
    next: { revalidate: 86400 },
  });
  const earthRes = await fetch(fetchEarthURL, {
    headers,
    next: { revalidate: 86400 },
  });

  const sunData = await sunRes.json();
  const earthData = await earthRes.json();

  // Parse the data using the parsers we fixed earlier
  const parsedSun = parseSunHorizonsText(sunData.result);
  const parsedEarth = parseEarthHorizonsText(earthData.result);

  console.log("sun", parsedSun);

  return (
    <div className="flex flex-col items-center w-full justify-between gap-8 min-h-screen mx-auto max-w-[1600px] px-4 py-4">
      <div className="sticky top-0 z-50 flex bg-background py-4 px-4 w-full">
        <Panel />
      </div>
      {/* content */}
      <DashboardGrid
        selectedRegion={selectedRegion}
        sunData={parsedSun}
        earthData={parsedEarth}
      />
    </div>
  );
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="p-8">Loading mission data</div>}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
