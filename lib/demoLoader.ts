import { fromUrl } from "geotiff";

let tiffImageCache: any = null;

export async function loadDemImage(url: string = "https://pub-5572cd1a1d75489bb6598a8c85966ce0.r2.dev") {
  if (tiffImageCache) return tiffImageCache;
  
  try {
    const tiff = await fromUrl(url);
    tiffImageCache = await tiff.getImage();
    return tiffImageCache;
  } catch (err) {
    console.error("Failed to load DEM GeoTIFF:", err);
    return null;
  }
}

export async function getElevationAtPoint(x: number, y: number): Promise<number | null> {
  const image = await loadDemImage();
  if (!image) return null;

  try {
    const bbox = image.getBoundingBox(); // [minX, minY, maxX, maxY]
    const width = image.getWidth();
    const height = image.getHeight();

    const resolutionX = (bbox[2] - bbox[0]) / width;
    const resolutionY = (bbox[3] - bbox[1]) / height;

    const px = Math.floor((x - bbox[0]) / resolutionX);
    const py = Math.floor((bbox[3] - y) / resolutionY); // Y axis inverted in rasters

    if (px >= 0 && px < width && py >= 0 && py < height) {
      const rasterData = await image.readRasters({
        window: [px, py, px + 1, py + 1],
      });
      return rasterData[0][0];
    }
  } catch (err) {
    console.error("Error reading elevation pixel:", err);
  }
  
  return null;
}