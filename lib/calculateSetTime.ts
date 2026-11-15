// lib/calculateSetTime.ts
import { parse, format, differenceInHours } from "date-fns";

export type EventStatus = {
  isUp: boolean;
  countdownText: string;
  eventDateText: string;
};

export function getEventStatus(data, currentIndex): EventStatus {
  // Default fallback if no data
  const defaultStatus = {
    isUp: false,
    countdownText: "> 30 days",
    eventDateText: "Unknown",
  };

  if (!data || data.length === 0) return defaultStatus;

  const currentPoint = data[currentIndex];
  const isUp = currentPoint.elevation > 0;

  let crossingPoint = null;

  // 1. Find the exact data row where the crossing happens
  for (let i = 1; i < data.length; i++) {
    const point = data[i];
    if (isUp && point.elevation <= 0) {
      crossingPoint = point;
      break;
    }
    if (!isUp && point.elevation > 0) {
      crossingPoint = point;
      break;
    }
  }

  if (!crossingPoint) {
    return { ...defaultStatus, isUp };
  }

  // 2. Convert the strings to actual JavaScript Date objects
  const startDateObj = parse(
    `${currentPoint.date} ${currentPoint.time}`,
    "yyyy-MMM-dd HH:mm",
    new Date()
  );

  const eventDateObj = parse(
    `${crossingPoint.date} ${crossingPoint.time}`,
    "yyyy-MMM-dd HH:mm",
    new Date()
  );

  // 3. Subtract them to get the exact hours remaining!
  const hoursLeft = differenceInHours(eventDateObj, startDateObj);

  const days = Math.floor(hoursLeft / 24);
  const hours = hoursLeft % 24;

  return {
    isUp,
    countdownText: `${days}D ${hours}H`,
    eventDateText: format(eventDateObj, "dd MMM yyyy · HH:mm 'UTC'"),
  };
}