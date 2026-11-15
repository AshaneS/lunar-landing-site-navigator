"use client";

import { createContext, useContext, useEffect, useState } from "react";

// 1. Define what a saved site looks like
export type SavedSite = {
  id: string;
  name: string;
  regionCode: string;
  lat: string;
  lon: string;
  alt: string;
  dateSaved: string;
};

type SiteLibraryContextType = {
  savedSites: SavedSite[];
  siteName: string; // <--- The custom name user types (e.g., "Ridge Alpha")
  regionName: string;
  addSite: (site: Omit<SavedSite, "id" | "dateSaved">) => void;
  removeSite: (id: string) => void;
};

const SiteLibraryContext = createContext<SiteLibraryContextType | undefined>(
  undefined,
);

export function SiteLibraryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedSites, setSavedSites] = useState<SavedSite[]>([]);

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("lunar_saved_sites");
    if (stored) {
      try {
        setSavedSites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved sites", e);
      }
    }
  }, []);

  // Save to localStorage whenever the array changes
  const saveToStorage = (sites: SavedSite[]) => {
    setSavedSites(sites);
    localStorage.setItem("lunar_saved_sites", JSON.stringify(sites));
  };

  const addSite = (siteData: Omit<SavedSite, "id" | "dateSaved">) => {
    // Check if it already exists to prevent duplicates
    const exists = savedSites.find(
      (s) => s.lat === siteData.lat && s.lon === siteData.lon,
    );
    if (exists) return; // Ignore if already saved

    const newSite: SavedSite = {
      ...siteData,
      id: crypto.randomUUID(), // Generate a unique ID
      dateSaved: new Date().toISOString(),
    };

    saveToStorage([...savedSites, newSite]);
  };

  const removeSite = (id: string) => {
    saveToStorage(savedSites.filter((s) => s.id !== id));
  };

  return (
    <SiteLibraryContext.Provider value={{ savedSites, addSite, removeSite }}>
      {children}
    </SiteLibraryContext.Provider>
  );
}

// Custom hook to use the context easily
export function useSiteLibrary() {
  const context = useContext(SiteLibraryContext);
  if (!context) {
    throw new Error("useSiteLibrary must be used within a SiteLibraryProvider");
  }
  return context;
}
