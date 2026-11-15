"use client";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

export default function SiteCoordinates() {
  const searchParams = useSearchParams();


  // Read from URL (fallback to defaults if not set yet)
  const lon = searchParams.get("lon") ?? "0";
  const lat = searchParams.get("lat") ?? "-89.5";
  const alt = searchParams.get("alt") ?? "0";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1 min-w-20 max-w-30">
        <p className="font-bold">lon</p>
        <Input
          id="input-field-username"
          type="text"
          placeholder="lat"
          value={lon}
        />
      </div>
      <div className="flex items-center gap-1 min-w-20 max-w-30">
        <p className="font-bold">lat</p>
        <Input
          id="input-field-username"
          type="text"
          placeholder="lon"
          value={lat}
        />
      </div>
      <div className="flex items-center gap-1 min-w-20 max-w-30">
        <p className="font-bold">Alt</p>
        <Input
          id="input-field-username"
          type="text"
          placeholder="lon"
          value={alt}
        />
        <p>km</p>
      </div>
    </div>
  );
}
