// lib/fetchHorizons.ts
export async function fetchHorizonsData(
  siteCoord: string,
  startDate: string,
  stopDate: string,
  command: "10" | "399",
  stepSize: string = "1h"
) {
  const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='${command}'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='coord@301'&COORD_TYPE='GEODETIC'&SITE_COORD='${siteCoord}'&START_TIME='${startDate}'&STOP_TIME='${stopDate}'&STEP_SIZE='${stepSize}'&QUANTITIES='4'`;

  const res = await fetch(url, {
    headers: { "User-Agent": "LunarDashboard/1.0" },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  const data = await res.json();
  return data.result;
}
