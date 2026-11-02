export type BookingType =
  | "HOURLY"
  | "DAILY"
  | "MONTHLY";


export const BOOKING_RATES = {
  HOURLY: 300,
  DAILY: 700,
  MONTHLY: 4500,
};


export function getBookingRate(
  type: BookingType
) {
  return BOOKING_RATES[type];
}


export function calculateTotal(
  type: BookingType,
  duration: number
) {
  const rate =
    getBookingRate(type);

  return (
    rate *
    Math.max(duration, 1)
  );
}


export function getUnit(
  type: BookingType
) {
  if (type === "HOURLY") {
    return "hour";
  }

  if (type === "DAILY") {
    return "day";
  }

  return "month";
}


export function getDurationText(
  type: BookingType
) {
  if (type === "HOURLY") {
    return "How many hours?";
  }

  if (type === "DAILY") {
    return "How many days?";
  }

  return "How many months?";
}


export function formatBDT(
  amount: number
) {
  return `৳${amount.toLocaleString(
    "en-BD"
  )}`;
}