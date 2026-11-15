import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import MissionCalendarGrid from "./MissionCalendar";

export default function CompareDateCalenderCard({ dailyPeaks }) {
  return (
    <Card className="w-full bg-background border-border">
      {/* Header Section */}
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            Ephemeris Mission Calendar — November 2026
          </CardTitle>
          <CardDescription></CardDescription>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2">Nov 2026</span>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Content Area (Empty for now) */}
      <CardContent className="min-h-75 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg m-6 mt-0">
        <MissionCalendarGrid dailyPeaks={dailyPeaks} />
      </CardContent>
    </Card>
  );
}
