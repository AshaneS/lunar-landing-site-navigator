"use client";

import { getTimeChunks } from "@/lib/getTimeChunks";
import { format, parse } from "date-fns";

export default function LunarTimeline({
  sunData,
  earthData,
  currentIndex,
  setCurrentIndex,
}) {
  const totalSteps = sunData.length;

  const sunChunks = getTimeChunks(sunData);
  const earthChunks = getTimeChunks(earthData);

  const currentData = sunData[currentIndex];

  // --- NEW: CALCULATE THE GLOWING OVERLAP WINDOW ---
  const overlapChunks = [];
  let inOverlap = false;
  let overlapStart = 0;

  for (let i = 0; i < totalSteps; i++) {
    const sunUp = sunData[i]?.elevation > 0;
    const earthUp = earthData[i]?.elevation > 0;
    const isOverlap = sunUp && earthUp;

    if (isOverlap && !inOverlap) {
      inOverlap = true;
      overlapStart = i;
    } else if (!isOverlap && inOverlap) {
      inOverlap = false;
      overlapChunks.push({ start: overlapStart, end: i });
    }
  }
  if (inOverlap) overlapChunks.push({ start: overlapStart, end: totalSteps });

  // --- NEW: CALCULATE ACTUAL DATES ---
  // Helper to safely parse and format the date string from NASA
  const getDateLabel = (index: number) => {
    const dataPoint = sunData[index];
    if (!dataPoint) return "";
    // NASA format: "2026-Nov-14" -> Format: "Nov 14"
    return format(parse(dataPoint.date, "yyyy-MMM-dd", new Date()), "MMM d");
  };

  const startLabel = getDateLabel(0);
  const midLabel = getDateLabel(Math.floor(totalSteps / 2));
  const endLabel = getDateLabel(totalSteps - 1);
  // -----------------------------------
  // ------------------------------------------------

  return (
    <div className="w-full p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="pb-10 flex flex-col gap-1">
        <h3 className="text-lg font-semibold tracking-tight">
          Operational Timeline
        </h3>
        <p className="text-sm text-muted-foreground">
          Track Sun and Earth visibility over a 29.5-day lunar cycle. Scrub the
          slider to see how conditions change.
          <span className="text-emerald-500 font-medium ml-1">
            Green highlights indicate optimal windows where both are visible.
          </span>
        </p>
      </div>
      <div className="flex gap-4">
        {/* LEFT COLUMN: Labels */}
        <div className="flex flex-col justify-around h-[72px] pt-1 text-sm font-medium text-muted-foreground">
          <span className="w-12">Sun</span>
          <span className="w-12">Earth</span>
        </div>

        {/* RIGHT COLUMN: Tracks, Playhead, and Slider */}
        <div className="relative flex-1">
          <div className="flex flex-col gap-4">
            {/* SUN TRACK */}
            <div className="relative h-6 rounded-md overflow-hidden border bg-muted">
              {sunChunks.map((chunk, index) => (
                <div
                  key={index}
                  className={`absolute top-0 bottom-0 ${
                    chunk.isUp ? "bg-amber-400" : "bg-muted/50"
                  }`}
                  style={{
                    left: `${(chunk.start / totalSteps) * 100}%`,
                    width: `calc(${((chunk.end - chunk.start) / totalSteps) * 100}% + 1px)`,
                  }}
                ></div>
              ))}
            </div>

            {/* EARTH TRACK */}
            <div className="relative h-6 rounded-md overflow-hidden border bg-muted">
              {earthChunks.map((chunk, index) => (
                <div
                  key={index}
                  className={`absolute top-0 bottom-0 ${
                    chunk.isUp ? "bg-blue-500" : "bg-muted/50"
                  }`}
                  style={{
                    left: `${(chunk.start / totalSteps) * 100}%`,
                    width: `calc(${((chunk.end - chunk.start) / totalSteps) * 100}% + 1px)`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* PLAYHEAD */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-foreground z-20 transition-all duration-75"
            style={{ left: `${(currentIndex / (totalSteps - 1)) * 100}%` }}
          >
            {/* UPDATED LABEL WITH DATE & TIME */}
            <div className="absolute -top-12 -translate-x-1/2 left-1/2 flex flex-col items-center bg-foreground text-background rounded px-2 py-1 cursor-ew-resize whitespace-nowrap shadow-md">
              <span className="text-[9px] uppercase font-bold opacity-75 leading-none mb-0.5">
                Landing
              </span>
              <span className="text-[11px] font-semibold leading-none">
                {currentData
                  ? `${getDateLabel(currentIndex)} • ${currentData.time}`
                  : "--"}
              </span>
            </div>
          </div>

          {/* INVISIBLE SLIDER */}
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="absolute inset-x-0 -top-10 h-[calc(100%+2.5rem)] opacity-0 cursor-ew-resize z-30"
          />
        </div>
      </div>

      {/* X-AXIS LABELS */}
      <div className="flex justify-between mt-4 ml-16 text-xs text-muted-foreground">
        <div className="flex flex-col items-center">
          <span>Day 0</span>
          <span className="font-semibold text-foreground">{startLabel}</span>
        </div>
        <div className="flex flex-col items-center">
          <span>Day 15</span>
          <span className="font-semibold text-foreground">{midLabel}</span>
        </div>
        <div className="flex flex-col items-center">
          <span>Day 29</span>
          <span className="font-semibold text-foreground">{endLabel}</span>
        </div>
      </div>
    </div>
  );
}
