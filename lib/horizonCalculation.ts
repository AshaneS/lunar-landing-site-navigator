const moonRadius = 1737400; //meters

export function curveDrop(distance) {
  return (distance * distance) / (2 * moonRadius);
}

export function angleTo(heightDifference, distance) {
  const drop = curveDrop(distance);
  // console.log("drop is", drop);
  const rise = heightDifference - drop;
  const radians = Math.atan(rise / distance);
  return (radians * 180) / Math.PI;
}

export function skyline(points) {
  let biggestAngle = -90;
  for (let i = 0; i < points.length; i++) {
    const a = angleTo(points[i].heightDiff, points[i].distance);
    // console.log("angle", a);
    if (a > biggestAngle) {
      biggestAngle = a;
    }
  }
  return biggestAngle;
}
