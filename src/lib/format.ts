import type { AvailabilitySlot, DocumentType, Weekday } from "@/lib/types";

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

// "3 days ago", "yesterday", "just now"
export function timeAgo(iso: string): string {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);

  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

const dateTime = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Lagos",
});

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

export function formatTime(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

const DAYS: { value: Weekday; short: string }[] = [
  { value: "monday", short: "Mon" },
  { value: "tuesday", short: "Tue" },
  { value: "wednesday", short: "Wed" },
  { value: "thursday", short: "Thu" },
  { value: "friday", short: "Fri" },
  { value: "saturday", short: "Sat" },
  { value: "sunday", short: "Sun" },
];

function summarizeDays(days: Weekday[]): string {
  const sorted = DAYS.filter((d) => days.includes(d.value));
  if (sorted.length === 7) return "Every day";

  const weekdays = DAYS.slice(0, 5).map((d) => d.value);
  if (sorted.length === 5 && weekdays.every((d) => days.includes(d))) return "Monday to Friday";

  return sorted.map((d) => d.short).join(", ");
}

// One line per distinct set of hours, for example "Monday to Friday, 8:00 AM to 5:00 PM"
export function summarizeAvailability(slots: AvailabilitySlot[]): string[] {
  const groups = new Map<string, Weekday[]>();

  for (const slot of slots) {
    const key = `${slot.startTime}-${slot.endTime}`;
    groups.set(key, [...(groups.get(key) ?? []), slot.day]);
  }

  return [...groups.entries()].map(([key, days]) => {
    const [start, end] = key.split("-");
    return `${summarizeDays(days)}, ${formatTime(start)} to ${formatTime(end)}`;
  });
}

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  id_card: "Government ID",
  certificate: "Trade certificate",
  license: "Licence",
  other: "Other document",
};