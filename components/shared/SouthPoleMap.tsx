"use client";

import { useEffect, useRef, useState } from "react";
import "ol/ol.css";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { Projection } from "ol/proj";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { WMTS } from "ol/source";
import { getCenter } from "ol/extent";
import proj4 from "proj4";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import Point from "ol/geom/Point";
import {
  Fill,
  Stroke,
  Style,
  Text as TextStyle,
  Circle as CircleStyle,
} from "ol/style";
import { getElevationAtPoint } from "@/lib/demoLoader";
import { horizonProfiler } from "@/lib/horizonProfiler";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

proj4.defs(
  "MOON_SP",
  "+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=1737400 +b=1737400 +units=m +no_defs",
);
proj4.defs("MOON_LL", "+proj=longlat +a=1737400 +b=1737400 +no_defs");

type HorizonPoint = { azimuth: number; elevation: number };

export default function SouthPoleMap({
  region,
  onHorizonCalculated,
  onHorizonLoading,
}: {
  region: any;
  onHorizonCalculated: (data: HorizonPoint[]) => void;
  onHorizonLoading?: (isLoading: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [pos, setPos] = useState<[number?, number?, number?]>([
    undefined,
    undefined,
    undefined,
  ]);

  const box = useRef<HTMLDivElement>(null);
  const vectorSourceRef = useRef(new VectorSource());
  const markerSourceRef = useRef(new VectorSource()); // this is for custom markers points
  const mapRef = useRef<Map | null>(null);
  const runId = useRef(0);

  // Always holds the latest props/hooks, so the map's one-time click handler
  // never uses stale values.
  const latest = useRef({
    onHorizonCalculated,
    onHorizonLoading,
    router,
    pathname,
    searchParams,
    region,
  });

  // NEW: Update the ref safely inside a useEffect
  useEffect(() => {
    latest.current = {
      onHorizonCalculated,
      onHorizonLoading,
      router,
      pathname,
      searchParams,
      region,
    };
  });

  const regionCode = region?.properties?.RegionCode;

  const runProfiler = async (x: number, y: number) => {
    const id = ++runId.current;
    const isCurrent = () => id === runId.current;

    latest.current.onHorizonLoading?.(true);
    try {
      // Let React paint the spinner before the heavy work blocks the thread.
      await new Promise<void>((r) =>
        requestAnimationFrame(() => setTimeout(r, 0)),
      );

      const profile = await horizonProfiler(x, y, 5000, 400);
      if (!isCurrent()) return; // a newer run replaced this one

      const chartData = profile.map((p: any) => ({
        azimuth: p.mapAngle,
        elevation: p.skyline,
      }));
      latest.current.onHorizonCalculated(chartData);
    } catch (err) {
      console.error("Horizon profiler failed:", err);
      if (isCurrent()) latest.current.onHorizonCalculated([]);
    } finally {
      if (isCurrent()) latest.current.onHorizonLoading?.(false);
    }
  };

  // 1st useEffect to Initialize the map (runs once)
  useEffect(() => {
    const projection = new Projection({
      code: "southpole",
      units: "m",
      extent: [-1095930, -1095930, 1095930, 1095930],
    });

    const tileGrid = new WMTSTileGrid({
      origin: [-1095930, 1095930],
      tileSize: 256,
      matrixIds: ["0", "1", "2", "3", "4", "5"],
      resolutions: [
        8561.953125, 4280.9765625, 2140.48828125, 1070.244140625,
        535.1220703125, 267.56103515625,
      ],
    });

    const source = new WMTS({
      url: "https://trek.nasa.gov/tiles/Moon/SP/LRO_WAC_Mosaic_SPole60_100m_v02/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png",
      requestEncoding: "REST",
      layer: "LRO_WAC_Mosaic_SPole60_100m_v02",
      style: "default",
      matrixSet: "default028mm",
      format: "image/png",
      projection,
      tileGrid,
    });

    const regionLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: new Style({
        stroke: new Stroke({ color: "#00ffae", width: 2 }),
        fill: new Fill({ color: "rgba(255, 85, 0, 0.15)" }),
      }),
    });

    //This is to add custom points on the map.
    const markerLayer = new VectorLayer({
      source: markerSourceRef.current,
      style: new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: "#3b82f6" }), // Blue dot
          stroke: new Stroke({ color: "#ffffff", width: 2 }), // White border
        }),
      }),
    });

    const map = new Map({
      target: box.current!,
      layers: [
        new TileLayer({
          source,
          extent: [-1095930, -1095930, 1095930, 1095930],
        }),
        regionLayer, //shows the regions
        markerLayer, // shows the markers
      ],
      view: new View({ projection, center: [0, 0], zoom: 1 }),
    });

    mapRef.current = map;

    // HANDLE MAP CLICKS
    map.on("click", (e) => {
      const [x, y] = e.coordinate;
      const [clickedLon, clickedLat] = proj4(
        "MOON_SP",
        "MOON_LL",
        e.coordinate,
      );

      // 1. Get the latest region and router from the ref!
      const {
        region: currentRegion,
        router,
        pathname,
        searchParams,
      } = latest.current;

      const isInsideRegion = !!map.forEachFeatureAtPixel(e.pixel, () => true, {
        layerFilter: (layer) => layer === regionLayer,
      });

      markerSourceRef.current.clear();

      console.log(
        "inside:",
        isInsideRegion,
        "region:",
        currentRegion?.properties?.RegionCode,
      );

      markerSourceRef.current.clear();
      const markerFeature = new Feature(new Point([x, y]));
      markerSourceRef.current.addFeature(markerFeature);

      // Start the horizon calculation and spinner immediately.
      runProfiler(x, y);

      // Elevation readout is independent; don't block the profiler on it.
      getElevationAtPoint(x, y)
        .then((elevation) => setPos([clickedLon, clickedLat, elevation]))
        .catch(() => setPos([clickedLon, clickedLat, undefined]));

      const newParams = new URLSearchParams(searchParams.toString());

      // --- NEW: IF OUTSIDE, DROP THE REGION ---
      if (!isInsideRegion) {
        newParams.delete("region");
      }
      // -----------------------------------------

      // 2. Overwrite only the coordinates
      newParams.set("lat", clickedLat.toFixed(4));
      newParams.set("lon", clickedLon.toFixed(4));
      newParams.set("alt", "0");

      // 3. Push it
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    });

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  // 2nd useEffect to handle the region selection and this runs when the drop down changes.
  useEffect(() => {
    vectorSourceRef.current.clear();
    if (!region) return;

    const ring = region.geometry.coordinates[0];
    const projectedRing = ring.map(([lon, lat]: [number, number]) =>
      proj4("MOON_LL", "MOON_SP", [lon, lat]),
    );

    const polygon = new Polygon([projectedRing]);
    const feature = new Feature(polygon);

    feature.setStyle((_feature, resolution) => {
      const showText = resolution < 1500;
      return new Style({
        stroke: new Stroke({ color: "#ff5500", width: 3 }),
        fill: new Fill({ color: "rgba(255, 85, 0, 0.15)" }),
        text: showText
          ? new TextStyle({
              text: `${region.properties.Region}`,
              font: "10px sans-serif",
              fill: new Fill({ color: "#ffffff" }),
              stroke: new Stroke({ color: "#000000", width: 3 }),
              textAlign: "center",
              overflow: true,
            })
          : undefined,
      });
    });

    vectorSourceRef.current.addFeature(feature);

    const map = mapRef.current;
    if (!map) return;

    map.getView().fit(polygon.getExtent(), {
      padding: [80, 80, 80, 80],
      maxZoom: 5,
      duration: 800,
    });

    const center = getCenter(polygon.getExtent());
    const [centerLon, centerLat] = proj4("MOON_SP", "MOON_LL", center);

    const { router, pathname, searchParams } = latest.current;
    const params = new URLSearchParams(searchParams.toString());
    params.set("lat", centerLat.toFixed(4));
    params.set("lon", centerLon.toFixed(4));
    params.set("alt", "0");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    runProfiler(center[0], center[1]);
  }, [regionCode]);

  return (
    <div className="relative h-full w-full">
      <div ref={box} className="h-full w-full" />
      {pos[1] !== undefined && (
        <div className="absolute bottom-3 left-3 z-50 rounded bg-black/70 px-3 py-1.5 text-sm text-white">
          <p>Lon: {pos[0]?.toFixed(4)}</p>
          <p>Lat: {pos[1]?.toFixed(4)}</p>
          <p>Height: {pos[2]?.toFixed(2)}m</p>
        </div>
      )}
    </div>
  );
}
