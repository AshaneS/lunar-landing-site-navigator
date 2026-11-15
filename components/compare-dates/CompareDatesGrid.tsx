"use client";
import { useState } from "react";
import CompareDateCalenderCard from "./CompareDateCalenderCard";
import EarthCommunicationCard from "../shared/EarthCommunicationCard";
import LunarTimeline from "../shared/LunarTimeLine";
import SolarPowerCard from "../shared/SolarPowerCard";
import SouthPoleMap from "../shared/SouthPoleMap";
import { MapPin } from "lucide-react";
import { TimePickerReUI } from "../dashboard/TimePickerReUI";
import LandingSiteMenu from "../dashboard/LandingSiteMenu";
import { LocalHorizonProfile } from "../shared/LocalHorizonProfile";

export default function CompareDatesGrid({
  selectedRegion,
  chartSunData,
  chartEarthData,
  dailyPeaks,
}) {
  const [horizonData, setHorizonData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSun = chartSunData[currentIndex];
  const currentEarth = chartEarthData[currentIndex];

  return (
    <div className="grid grid-cols-5 gap-6 w-full">
      {/* LEFT: Calendar */}

      <div className="flex flex-col gap-4 col-span-3">
        <div className="flex items-center p-5 gap-4 rounded-xl border bg-card shadow-sm">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex flex-col flex-1">
            <p className="text-sm text-muted-foreground mb-3">
              Select a primary landing region to analyze.
            </p>
          </div>
          <LandingSiteMenu />
        </div>

        <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
          <h2 className="font-semibold text-lg">Select Time</h2>
          <TimePickerReUI />
        </div>

        <CompareDateCalenderCard dailyPeaks={dailyPeaks} />
      </div>

      {/* RIGHT: Local Horizon, Timeline, & Cards */}
      <div className="flex flex-col gap-4 col-span-2">
        {/* INVISIBLE MAP: Just here to calculate the terrain horizon! */}
        <div className="hidden">
          <SouthPoleMap
            region={selectedRegion}
            onHorizonCalculated={setHorizonData}
          />
        </div>

        <LocalHorizonProfile

          data={horizonData}
          sunPos={
            currentSun
              ? { azimuth: currentSun.azimuth, elevation: currentSun.elevation }
              : undefined
          }
          earthPos={
            currentEarth
              ? {
                  azimuth: currentEarth.azimuth,
                  elevation: currentEarth.elevation,
                }
              : undefined
          }
        />

        <LunarTimeline
          sunData={chartSunData}
          earthData={chartEarthData}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />

        <div className="grid grid-cols-2 gap-4">
          <SolarPowerCard sunData={chartSunData} currentIndex={currentIndex} />
          <EarthCommunicationCard
            earthData={chartEarthData}
            currentIndex={currentIndex}
          />
        </div>
      </div>
    </div>
  );
}
