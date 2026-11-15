"use client";

import { useSearchParams } from "next/navigation";
import { BookmarkPlus, Pin, ArrowRightLeft, MapPin } from "lucide-react";
import proj4 from "proj4";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useSiteLibrary } from "@/lib/site-library-context";
import { cn } from "@/lib/utils";

proj4.defs(
  "MOON_SP",
  "+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=1737400 +b=1737400 +units=m +no_defs",
);
proj4.defs("MOON_LL", "+proj=longlat +a=1737400 +b=1737400 +no_defs");

export default function SelectedSiteBar({
  selectedRegion,
}: {
  selectedRegion?: any;
}) {
  const searchParams = useSearchParams();
  const { addSite, savedSites } = useSiteLibrary();
  const [isPinned, setIsPinned] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const latStr = searchParams.get("lat") ?? "-89.5";
  const lonStr = searchParams.get("lon") ?? "0";
  const altStr = searchParams.get("alt") ?? "0";

  const [x, y] = proj4("MOON_LL", "MOON_SP", [
    parseFloat(lonStr),
    parseFloat(latStr),
  ]);

  // Get the region data
  const regionName = selectedRegion?.properties?.Region ?? "Custom Coordinates";
  const regionCode = selectedRegion?.properties?.RegionCode ?? "CUSTOM";

  // State ONLY for the custom site name (starts empty)
  const [siteNameInput, setSiteNameInput] = useState("");

  const isAlreadySaved = savedSites.some(
    (s) => s.lat === latStr && s.lon === lonStr,
  );

  const handleSave = () => {
    // If they don't type a name, default to the region name + " Site"
    const finalSiteName = siteNameInput.trim() || `${regionName} Site`;

    addSite({
      siteName: finalSiteName,
      regionName: regionName,
      regionCode: regionCode,
      lat: latStr,
      lon: lonStr,
      alt: altStr,
    });

    setIsDialogOpen(false);
    setSiteNameInput(""); 
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-3 border rounded-lg bg-card text-card-foreground shadow-sm">
      {/* LEFT: Title, Badge, and Coordinates */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-bold tracking-tight">{regionName}</h2>
        <Badge variant="secondary" className="font-normal">
          {regionCode} Peak
        </Badge>
        <span className="text-xs font-mono text-muted-foreground">
          X: {x.toLocaleString(undefined, { maximumFractionDigits: 0 })}m · Y:{" "}
          {y.toLocaleString(undefined, { maximumFractionDigits: 0 })}m
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 md:mt-0">
        {/* THE SAVE DIALOG */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button
                size="sm"
                className="h-8"
                disabled={isAlreadySaved}
                variant={isAlreadySaved ? "secondary" : "default"}
              >
                <BookmarkPlus className="w-4 h-4 mr-1.5" />
                {isAlreadySaved ? "Saved to Library" : "+ Save to Site Library"}
              </Button>
            }
          ></DialogTrigger>

          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Save Landing Site</DialogTitle>
              <DialogDescription>
                Name this specific coordinate within the region.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* NEW: REGION INPUT (Auto-filled, Disabled) */}
              <div className="grid gap-2">
                <Label htmlFor="region" className="text-muted-foreground">
                  Region
                </Label>
                <Input
                  id="region"
                  value={regionName === "Custom Coordinates" ? "" : regionName}
                  disabled
                  placeholder="No region (Custom Site)"
                  className="bg-muted cursor-not-allowed"
                />
              </div>

              {/* SITE NAME INPUT (User types here) */}
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={siteNameInput}
                  onChange={(e) => setSiteNameInput(e.target.value)}
                  placeholder={`e.g., ${regionName} Ridge Alpha`}
                  autoFocus
                />
              </div>

              <div className="bg-muted p-3 rounded-md flex flex-col gap-1 text-sm mt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Coordinates</span>
                </div>
                <span className="font-mono text-foreground">
                  Lat: {latStr}, Lon: {lonStr}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Site</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pin Button */}
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8", isPinned && "bg-muted")}
          onClick={() => setIsPinned(!isPinned)}
        >
          <Pin
            className={cn(
              "w-4 h-4 mr-1.5",
              isPinned && "fill-current text-primary",
            )}
          />
          {isPinned ? "Pinned" : "Pin"}
        </Button>

        {/* Compare Button */}
        <Button variant="outline" size="sm" className="h-8">
          <ArrowRightLeft className="w-4 h-4 mr-1.5" />
          Compare
        </Button>
      </div>
    </div>
  );
}
