export const applicationStatusStyles: Record<string, string> = {
  pending: "bg-[#324d67] text-[#92adc9]",
  approved: "bg-emerald-500/20 text-emerald-300",
  rejected: "bg-rose-500/20 text-rose-300",
  default: "bg-[#324d67] text-white",
};

export function formatApplicationStatus(value: string) {
  if (!value) {
    return "Unknown";
  }
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function getApplicationTimestamp(value?: string) {
  if (!value) {
    return 0;
  }
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function formatApplicationDate(value?: string) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString();
}

