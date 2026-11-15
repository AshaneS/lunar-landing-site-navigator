import { skyline } from "./horizonCalculation";
import { ruler } from "./ruler";

export async function horizonProfiler(x, y, maxDistance, step) {
  const terrainProfile = [];
  for (let i = 0; i <= 360; i+=60) {
    const mapAngle = i;
    const rad = (mapAngle * Math.PI) / 180;

    const dx = Math.sin(rad);
    const dy = Math.cos(rad);

    const landMarks = await ruler(x, y, dx, dy, maxDistance, step);
    terrainProfile.push({ mapAngle, skyline: skyline(landMarks) });
  }
  return terrainProfile;
}
