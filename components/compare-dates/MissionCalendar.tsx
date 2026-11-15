"use client";

import { Sun, Moon } from "lucide-react";
import { format, parse } from "date-fns"; // Add parse
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function MissionCalendarGrid({ dailyPeaks }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Safely parse the date for the calendar UI
  const dateParam = searchParams.get("date") || "2026-Nov-14";
  const selectedDate = parse(dateParam, "yyyy-MMM-dd", new Date());

  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", format(newDate, "yyyy-MMM-dd"));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      month={new Date(2026, 10, 1)} 
      showOutsideDays={true}
      className="w-full [--cell-size:--spacing(24)] md:[--cell-size:--spacing(28)]"
      components={{
        MonthCaption: () => null,
        Nav: () => null,
        DayButton: ({ children, modifiers, day, ...props }) => {
          
          if (modifiers.outside) {
            return (
              <CalendarDayButton day={day} modifiers={modifiers} {...props} className="opacity-20 h-full w-full">
                {children}
              </CalendarDayButton>
            );
          }

          // 2. Get the string for this specific day (e.g., "2026-Nov-14")
          const dateString = format(day.date, "yyyy-MMM-dd");
          const isSelected = modifiers.selected;

          // 3. Look up the peak using the string
          const peak = dailyPeaks?.[dateString] ?? 0;
          const isNight = peak <= 0;

          return (
            <CalendarDayButton
              day={day}
              modifiers={modifiers}
              {...props}
              className={cn(
                "relative flex flex-col justify-between p-2 h-full w-full rounded-md border text-left",
                isSelected
                  ? "border-blue-500 ring-1 ring-blue-500 bg-blue-500/5"
                  : "border-border bg-background hover:bg-muted/50",
              )}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start w-full">
                <span className={cn("text-sm font-bold", isSelected && "text-blue-500")}>
                  {children}
                </span>
                <div className="flex gap-1 text-muted-foreground">
                  {isNight ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                </div>
              </div>

              {/* Middle Row */}
              <div className="mt-2 w-full">
                <div className="text-lg font-bold tracking-tight">
                  {peak > 0 ? "+" : ""}{peak.toFixed(1)}°
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase mt-0.5">
                  {isNight ? "Night" : "Peak Sun"}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between mt-3 w-full">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-4 rounded-sm font-medium",
                    isSelected ? "bg-blue-500/10 text-blue-500" : isNight ? "bg-muted text-muted-foreground" : "bg-green-500/10 text-green-500",
                  )}
                >
                  {isNight ? "Night" : "Day"}
                </Badge>
              </div>
            </CalendarDayButton>
          );
        },
      }}
    />
  );
}