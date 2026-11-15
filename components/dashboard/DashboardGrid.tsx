"use client";
import { useState } from "react";
import SouthPoleMap from "../shared/SouthPoleMap";
import SolarPowerCard from "../shared/SolarPowerCard";
import EarthCommunicationCard from "../shared/EarthCommunicationCard";
import LunarTimeline from "../shared/LunarTimeLine";
import SelectedSiteBar from "./SelectedSiteBar";
import { LocalHorizonProfile } from "../shared/LocalHorizonProfile";

export default function DashboardGrid({ selectedRegion, sunData, earthData }) {
  const [horizonData, setHorizonData] = useState<HorizonData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  //loading state for the localhoriaon data
  const [isLoadingHorizon, setIsLoadingHorizon] = useState(false);

  //sunData[0] sunData[1] sunData[2] are different data points got for 1 lunar day - 30 days
  //we are getting data for each index
  // and passing to the chart, timeLine and to cards. so moving the slider will sync the animation.

  const currentSun = sunData[currentIndex];
  const currentEarth = earthData[currentIndex];

  console.log("sun data", sunData);

  return (
    <div className="grid lg:grid-cols-8 w-full gap-2">
      <div className="lg:col-span-6 w-full flex flex-col gap-2">
        <div className="w-full h-100 bg-gray-900">
          <SouthPoleMap
            region={selectedRegion}
            onHorizonCalculated={setHorizonData}
            onHorizonLoading={setIsLoadingHorizon}
          />
        </div>
        {/* site selection and saving to library */}
        <SelectedSiteBar selectedRegion={selectedRegion} />
        {/* Horizon Profile */}
        <div className="w-full ">
          <LocalHorizonProfile
            data={horizonData}
            isLoading={isLoadingHorizon} 
            sunPos={
              currentSun
                ? {
                    azimuth: currentSun.azimuth,
                    elevation: currentSun.elevation,
                  }
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
        </div>
        <div>
          <LunarTimeline
            sunData={sunData}
            earthData={earthData}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
        {/* skyline clearence */}
        <div className="w-full ">{/* <SkyLineClearenceChart /> */}</div>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-2 flex flex-col gap-2 w-full">
        <SolarPowerCard sunData={sunData} currentIndex={currentIndex} />
        <EarthCommunicationCard
          earthData={earthData}
          currentIndex={currentIndex}
        />
      </div>
    </div>
  );
}
