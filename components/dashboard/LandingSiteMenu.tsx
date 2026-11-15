"use client";
import landing_regions from "@/data/A3_9regions.json";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

const landingSitesA3 = landing_regions.features.map((feature) => ({
  regionCode: feature.properties.RegionCode,
  region: feature.properties.Region,
  regionArea: feature.properties.Area_km2,
}));

function getCentroid(coords: number[][]) {
  const points = coords.slice(0, -1);
  const sumLon = points.reduce((sum, p) => sum + p[0], 0);
  const sumLat = points.reduce((sum, p) => sum + p[1], 0);
  return { lon: sumLon / points.length, lat: sumLat / points.length };
}

// console.log(landingSitesA3);

export default function LandingSiteMenu() {
  // Read from URL, but default to "Malapert Massif"
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const currentRegion = searchParams.get("region") || "Malapert Massif";

  function handleChange(region: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("region", region);

    const site = landing_regions.features.find(
      (f) => f.properties.Region === region,
    );

    console.log("site is", site);

    // Calculate the center and add it to the URL
    if (site) {
      const center = getCentroid(site.geometry.coordinates[0]);
      params.set("lat", center.lat.toFixed(4));
      params.set("lon", center.lon.toFixed(4));
    }

    //Push to URL
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col items-center">
      <Select onValueChange={handleChange} value={currentRegion}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a Landing Site" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Landing Sites</SelectLabel>
            {landingSitesA3.map((item) => (
              <SelectItem key={item.regionCode} value={item.region}>
                {item.region}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
