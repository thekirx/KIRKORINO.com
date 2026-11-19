import { todayManila } from "./session";

export type Urgency = "late" | "today" | "soon" | "none";

export function urgency(due: string | null | undefined): Urgency {
  if (!due) return "none";
  const today = todayManila();
  if (due < today) return "late";
  if (due === today) return "today";
  return "soon";
}

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

/** "3 days late", "Today", "Mon 24 Nov", "No date". */
export function dueLabel(due: string | null | undefined, time?: string | null) {
  if (!due) return "No date";
  const today = todayManila();
  const t = time ? `, ${formatTime(time)}` : "";
  if (due < today) {
    const n = daysBetween(due, today);
    return `${n} day${n > 1 ? "s" : ""} late`;
  }
  if (due === today) return `Today${t}`;
  const d = new Date(`${due}T00:00:00+08:00`);
  return d.toLocaleDateString("en-PH", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Manila" }) + t;
}

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}${m ? `:${String(m).padStart(2, "0")}` : ""} ${ampm}`;
}

export function ago(iso: string) {
  const mins = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "Yesterday" : `${d} days ago`;
}

export function longDate() {
  return new Date().toLocaleDateString("en-PH", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Manila" });
}

export function partOfDay() {
  const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Manila" }).format(new Date()));
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export const STAGES = [
  { key: "prospect", label: "Prospect", help: "Spotted; could be a client" },
  { key: "researched", label: "Researched", help: "Has a contact + one real detail" },
  { key: "contacted", label: "Contacted", help: "Emailed or called" },
  { key: "interested", label: "Interested", help: "Replied or picked up" },
  { key: "meeting", label: "Meeting", help: "Call or visit booked" },
  { key: "proposal", label: "Proposal", help: "Quote sent (Kirk approved)" },
  { key: "won", label: "Won", help: "Becomes a project" },
] as const;
export const OFF_REASONS = [
  { key: "not_interested", label: "Not interested" },
  { key: "no_reply", label: "No reply after 3 tries" },
  { key: "do_not_contact", label: "Asked not to be contacted" },
  { key: "not_now", label: "Not now · revisit in 3 months" },
] as const;
export function stageLabel(key: string) {
  return STAGES.find((s) => s.key === key)?.label ?? "Off the list";
}

export function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}
export const SHARED_INBOX = "optrizomarketing@gmail.com";

/** A Manila date N days from today, as YYYY-MM-DD. */
export function daysFromToday(n: number) {
  const d = new Date(`${todayManila()}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
