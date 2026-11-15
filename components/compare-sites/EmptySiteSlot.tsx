"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import landing_regions from "@/data/A3_9regions.json";

export default function EmptySiteSlot({ slot }: { slot: "A" | "B" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (regionName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(`site${slot}`, regionName);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className="w-full h-125 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 bg-muted/20">
      <div className="p-4 bg-muted rounded-full">
        <MapPin className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-1">Slot {slot} is Empty</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a landing site to start comparing.
        </p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Add Site to Slot {slot}
            </Button>
          }
        ></DialogTrigger>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Select Site for Slot {slot}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            {landing_regions.features.map((f) => (
              <Button
                key={f.properties.RegionCode}
                variant="ghost"
                className="justify-start"
                onClick={() => handleSelect(f.properties.Region)}
              >
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {f.properties.Region}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
