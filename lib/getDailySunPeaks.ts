
export function getDailyPeaks(monthlyData: any[]) {
  const peakPerDay: Record<string, number> = {};

  for (const point of monthlyData) {
    const date = point.date;
    const elevation = point.elevation;

    // If we haven't seen this date yet, set it as the initial peak
    if (peakPerDay[date] === undefined) {
      peakPerDay[date] = elevation;
    } 
    // If we have seen it, check if this new point is higher
    else if (elevation > peakPerDay[date]) {
      peakPerDay[date] = elevation;
    }
  }

  return peakPerDay;
}