import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";

export type Level = "hidden" | "view" | "edit" | "approve";
export type Area = "outreach" | "projects" | "social" | "finance" | "team";
const RANK: Record<Level, number> = { hidden: 0, view: 1, edit: 2, approve: 3 };

export type Role = {
  id: string;
  key: string;
  name: string;
  short_name: string;
  description: string;
  is_admin: boolean;
  needs_confirm: boolean;
  emails_need_ok: boolean;
};
export type Member = {
  id: string;
  name: string;
  google_email: string;
  status: "invited" | "pending_confirm" | "active" | "on_leave" | "removed";
  role_id: string | null;
  is_owner: boolean;
  leave_from: string | null;
  leave_to: string | null;
};

/** Who is signed in, their member row, role and permission levels. Cached per request. */
export const getSession = cache(async () => {
  const supabase = await supabaseServer();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { supabase, user: null, member: null, role: null, levels: {} as Record<string, Level> };
  const userId = claims.claims.sub as string;
  const { data: member } = await supabase
    .from("members")
    .select("id,name,google_email,status,role_id,is_owner,leave_from,leave_to")
    .eq("user_id", userId)
    .maybeSingle<Member>();
  let role: Role | null = null;
  const levels: Record<string, Level> = {};
  if (member?.role_id) {
    const { data } = await supabase.from("roles").select("*").eq("id", member.role_id).maybeSingle<Role>();
    role = data;
    const { data: perms } = await supabase.from("role_permissions").select("area,level").eq("role_id", member.role_id);
    perms?.forEach((p) => (levels[p.area] = p.level as Level));
  }
  return { supabase, user: { id: userId, email: (claims.claims.email as string) ?? "" }, member, role, levels };
});

/** Use at the top of every signed-in page. Sends people to the right place if they can't be here yet. */
export async function requireMember() {
  const s = await getSession();
  if (!s.user) redirect("/signin");
  if (!s.member || s.member.status === "removed") redirect("/signin?error=not_on_team");
  if (s.member.status === "invited") redirect("/choose-role");
  if (s.member.status === "pending_confirm") redirect("/waiting");
  const can = (area: Area, level: Level = "view") => RANK[s.levels[area] ?? "hidden"] >= RANK[level];
  return { ...s, user: s.user, member: s.member, role: s.role!, can, isAdmin: Boolean(s.role?.is_admin) };
}

export async function requireAdmin() {
  const s = await requireMember();
  if (!s.isAdmin) redirect("/");
  return s;
}

/** Today's date in Manila as YYYY-MM-DD. */
export function todayManila() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(new Date());
}
