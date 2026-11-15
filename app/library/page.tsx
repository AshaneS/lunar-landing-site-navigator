"use client";

import { useSiteLibrary } from "@/lib/site-library-context";
import SavedSiteCard from "@/components/library/SavedSiteCard";
import { Bookmark } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function LibraryPage() {
  const { savedSites } = useSiteLibrary();

  return (
    <div className="flex flex-col w-full max-w-300 mx-auto p-6 gap-6">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Site Library</h1>
        <p className="text-muted-foreground">
          Manage your saved landing sites and custom coordinates.
        </p>
      </div>

      {savedSites.length === 0 ? (
        <div className="flex h-100 items-center justify-center border rounded-xl border-dashed">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bookmark className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>No saved sites yet</EmptyTitle>
              <EmptyDescription>
                Go to the dashboard, select a site on the map, and click "Save to Site Library".
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedSites.map((site) => (
            <SavedSiteCard key={site.id} site={site} />
          ))}
        </div>
      )}

    </div>
  );
}