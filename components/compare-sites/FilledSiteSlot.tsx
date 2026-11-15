"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format } from "date-fns";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SouthPoleMap from "../shared/SouthPoleMap";
import LunarTimeline from "../shared/LunarTimeLine";
import { LocalHorizonProfile } from "../shared/LocalHorizonProfile";

export default function FilledSiteSlot({
  slot,
  siteData,
  dateStr,
  sunData,
  earthData,
  isSynced,
}: {
  slot: "A" | "B";
  siteData: any;
  dateStr: string;
  sunData: any[];
  earthData: any[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [horizonData, setHorizonData] = useState<HorizonData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSun = sunData[currentIndex];
  const currentEarth = earthData[currentIndex];

  // Handle Date Change
  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set(`date${slot}`, format(newDate, "yyyy-MMM-dd"));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleRemove = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(`site${slot}`);
    params.delete(`date${slot}`);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header with Site Name and Date Picker */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between bg-primary/5 border border-primary/20 p-4 rounded-t-xl gap-4">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            Slot {slot}
          </p>
          <h2 className="text-xl font-bold">{siteData.properties.Region}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* DATE PICKER */}
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  disabled={isSynced}
                  className={`w-35 justify-start text-left font-normal ${isSynced ? "opacity-50 cursor-not-allowed bg-muted" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(dateStr), "MMM dd, yyyy")}
                </Button>
              }
            ></PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={new Date(dateStr)}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="hidden">
        <SouthPoleMap region={siteData} onHorizonCalculated={setHorizonData} />
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
        sunData={sunData}
        earthData={earthData}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
