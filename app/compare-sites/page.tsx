import { Suspense } from "react";
import { format, addDays } from "date-fns";
import { fetchHorizonsData } from "@/lib/fetchHorizonsData";
import { parseSunHorizonsText } from "@/lib/parseSunHorizonsText";
import { parseEarthHorizonsText } from "@/lib/parseEarthHorizonsText";
import landing_regions from "@/data/A3_9regions.json";
import CompareSitesLayout from "@/components/compare-sites/CompareSitesLayout";

// 1. Move the fetching logic into its own async component
async function CompareSitesContent({ searchParams }) {
  const resolvedParams = await searchParams;

  const isSynced = resolvedParams.sync !== "false";
  const dateA = resolvedParams.dateA ?? "2026-Nov-14";
  const dateB = isSynced ? dateA : (resolvedParams.dateB ?? "2026-Nov-14");

  const getSiteData = async (regionName?: string, targetDate?: string) => {
    if (!regionName || !targetDate) return null;
    const site = landing_regions.features.find(
      (f) => f.properties.Region === regionName,
    );
    if (!site) return null;

    const nextDate = format(addDays(new Date(targetDate), 30), "yyyy-MMM-dd");
    const startTime = `${targetDate} 00:00`;
    const stopTime = `${nextDate} 00:00`;

    const coords = site.geometry.coordinates[0];
    const points = coords.slice(0, -1);
    const sumLon = points.reduce((sum, p) => sum + p[0], 0);
    const sumLat = points.reduce((sum, p) => sum + p[1], 0);
    const lon = (sumLon / points.length).toFixed(4);
    const lat = (sumLat / points.length).toFixed(4);
    const siteCoord = `${lon},${lat},0`;

    const rawSun = await fetchHorizonsData(
      siteCoord,
      startTime,
      stopTime,
      "10",
      "2h",
    );
    const rawEarth = await fetchHorizonsData(
      siteCoord,
      startTime,
      stopTime,
      "399",
      "2h",
    );

    return {
      site,
      date: targetDate,
      sunData: parseSunHorizonsText(rawSun),
      earthData: parseEarthHorizonsText(rawEarth),
    };
  };

  const dataA = await getSiteData(resolvedParams.siteA, dateA);
  const dataB = await getSiteData(resolvedParams.siteB, dateB);

  return (
    <div className="flex flex-col w-full max-w-[1600px] mx-auto p-6 gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Compare Sites
        </h1>
        <p className="text-muted-foreground">
          Evaluate trade-offs between two landing locations.
        </p>
      </div>

      <CompareSitesLayout dataA={dataA} dataB={dataB} isSynced={isSynced} />
    </div>
  );
}

// 2. The default export just wraps it in Suspense
export default function CompareSitesPage({ searchParams }) {
  return (
    <Suspense fallback={<div className="p-8">Loading comparison data...</div>}>
      <CompareSitesContent searchParams={searchParams} />
    </Suspense>
  );
}
