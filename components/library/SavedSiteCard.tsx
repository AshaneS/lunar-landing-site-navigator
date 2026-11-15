"use client";

import { useRouter } from "next/navigation";
import { MapPin, Trash2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SavedSite, useSiteLibrary } from "@/lib/site-library-context";

export default function SavedSiteCard({ site }: { site: SavedSite }) {
  const router = useRouter();
  const { removeSite } = useSiteLibrary();

  const handleLoad = () => {
    router.push(`/?lat=${site.lat}&lon=${site.lon}&alt=${site.alt}`);
  };

  return (
    <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            {/* CUSTOM SITE NAME */}
            <CardTitle className="text-lg">{site.siteName}</CardTitle>
            
            {/* REGION NAME BADGE */}
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 h-4">
                {site.regionCode}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {site.regionName}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={() => removeSite(site.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 mt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-md">
          <MapPin className="h-4 w-4" />
          <span className="font-mono">
            {site.lat}, {site.lon}
          </span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleLoad} className="w-full gap-2" variant="outline">
          Load Site <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}