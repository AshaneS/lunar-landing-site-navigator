import { getElevationAtPoint } from "./demoLoader";

export async function ruler(x, y, dx, dy, maxDistance, step) {
  const pointsArray = [];
  const siteHeight = await getElevationAtPoint(x, y);
  if (siteHeight === null) return pointsArray;
  for (let d = step; d <= maxDistance; d += step) {
    const h = await getElevationAtPoint(x + dx * d, y + dy * d);
    if (h === null) continue;
    // console.log("height is", h);
    pointsArray.push({ distance: d, heightDiff: h - siteHeight });
  }

  console.log("points array", pointsArray);
  return pointsArray;
}
