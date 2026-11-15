"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmptySiteSlot from "./EmptySiteSlot";
import FilledSiteSlot from "./FilledSiteSlot";

export default function CompareSitesLayout({ dataA, dataB, isSynced }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read the current global date (default to dateA or Nov 14)
  const globalDateStr = searchParams.get("dateA") ?? "2026-Nov-14";
  const globalDate = new Date(globalDateStr);

  const handleSyncToggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sync", checked.toString());

    if (checked) {
      // If syncing, force dateB to match dateA
      params.set("dateB", params.get("dateA") ?? "2026-Nov-14");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // When global date changes, update BOTH dateA and dateB
  const handleGlobalDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    const params = new URLSearchParams(searchParams.toString());
    const formatted = format(newDate, "yyyy-MMM-dd");
    params.set("dateA", formatted);
    params.set("dateB", formatted); // Keep them in sync
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* syncing toggle and global calender */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-muted/30 p-4 rounded-lg border gap-4">
        <div className="flex items-center gap-3">
          <Switch
            id="sync-dates"
            checked={isSynced}
            onCheckedChange={handleSyncToggle}
          />
          <Label htmlFor="sync-dates" className="cursor-pointer font-medium">
            Sync Dates
          </Label>
        </div>

        {/* globl claender will be shown only when the user turns on the toggle */}
        {isSynced && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm text-muted-foreground font-medium">
              Global Mission Date:
            </span>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="default"
                    className="w-40 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(globalDate, "MMM dd, yyyy")}
                  </Button>
                }
              ></PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={globalDate}
                  onSelect={handleGlobalDateChange}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* SLOT A */}
        <div className="w-full">
          {dataA ? (
            <FilledSiteSlot
              slot="A"
              siteData={dataA.site}
              dateStr={dataA.date}
              sunData={dataA.sunData}
              earthData={dataA.earthData}
              isSynced={isSynced}
            />
          ) : (
            <EmptySiteSlot slot="A" />
          )}
        </div>

        {/* SLOT B */}
        <div className="w-full">
          {dataB ? (
            <FilledSiteSlot
              slot="B"
              siteData={dataB.site}
              dateStr={dataB.date}
              sunData={dataB.sunData}
              earthData={dataB.earthData}
              isSynced={isSynced}
            />
          ) : (
            <EmptySiteSlot slot="B" />
          )}
        </div>
      </div>
    </div>
  );
}
