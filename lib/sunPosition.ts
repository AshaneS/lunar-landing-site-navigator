// export default function getSunEphemeris({
//  format,
//  command,
//  ephemType,
//  center,
//  coordType,
//  latitude,
//  longitude,
//  altitude,
//  startTime,
//  stopTime,
//  stepSize,
//  quantities
// }) {
//   return (
//     <div>sunPosition</div>
//   )
// }



// export async function GET() {
//   try {
//     const response = await fetch(
//       "https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='10'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='coord@301'&COORD_TYPE='GEODETIC'&SITE_COORD='0,-89.5,0'&START_TIME='2026-11-09'&STOP_TIME='2026-11-10'&STEP_SIZE='1d'&QUANTITIES='4'",
//     );
//     if (!response.ok) throw new Error("Failed to fetch posts");
//     const data = await response.json();
//     console.log("--- NASA HORIZONS DATA ---", data);
//     return Response.json({ data });
//   } catch (error) {
//     console.error(error);
//     return Response.json(
//       { error: "Failed to fetch sky data" },
//       { status: 500 },
//     );
//   }
// }