"use client";

import { Sun, Moon, Activity, Compass, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getEventStatus } from "@/lib/calculateSetTime";
import { cn } from "@/lib/utils";

export default function SolarPowerCard({
  sunData,
  currentIndex,
}: {
  sunData: any[];
  currentIndex: number;
}) {
  const status = getEventStatus(sunData, currentIndex);
  const currentSun = sunData?.[currentIndex];

  if (!currentSun || !status) return null;

  const isUp = status.isUp;

  return (
    <Card
      className={cn(
        "w-full gap-0 shadow-sm overflow-hidden transition-all",
        isUp ? "ring-1 ring-emerald-500/20" : "ring-1 ring-destructive/20",
      )}
    >
      {/* HEADER */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
            {isUp ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
            Solar Power
          </CardTitle>

          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-3 py-1",
              isUp
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                : "border-destructive/30 bg-destructive/10 text-destructive",
            )}
          >
            <span
              className={cn(
                "mr-1.5 h-1.5 w-1.5 rounded-full",
                isUp ? "bg-emerald-500" : "bg-destructive",
              )}
            />
            {isUp ? "Generating" : "Offline"}
          </Badge>
        </div>

        <CardDescription className="flex items-center gap-2 mt-2 font-mono text-xs">
          <Clock className="h-3 w-3" />
          {currentSun.date} • {currentSun.time} UTC
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* HERO METRIC */}
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border",
            isUp
              ? "bg-amber-500/5 border-red-500/20"
              : "bg-muted/50 border-border",
          )}
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Elevation
            </span>
            <span className="text-[10px] text-muted-foreground">
              Higher angle = more power
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-4xl font-extrabold tracking-tighter",
                isUp ? "text-amber-600" : "text-foreground",
              )}
            >
              {currentSun.elevation > 0 ? "+" : ""}
              {currentSun.elevation.toFixed(1)}
            </span>
            <span className="text-lg font-semibold text-muted-foreground">
              °
            </span>
          </div>
        </div>

        {/* MINI METRICS GRID */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Compass className="h-3.5 w-3.5" /> Azimuth
            </span>
            <span className="font-mono text-sm font-semibold">
              {currentSun.azimuth.toFixed(1)}°
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Activity className="h-3.5 w-3.5" /> Status
            </span>
            <span className="text-sm font-semibold">
              {isUp ? "Above perfect Horizon" : "Below perfect Horizon"}
            </span>
          </div>
        </div>

        <Separator />

        {/* COUNTDOWN FOOTER */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {isUp ? "Loses power in" : "Power returns in"}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {status.countdownText}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
              Event Time
            </p>
            <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
              {status.eventDateText}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
