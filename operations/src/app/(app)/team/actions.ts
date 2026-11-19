"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const done = (msg: string) => {
  revalidatePath("/team");
  revalidatePath("/");
  redirect(`/team?saved=${encodeURIComponent(msg)}`);
};

export async function addMember(formData: FormData) {
  const s = await requireAdmin();
  const email = str(formData, "google_email").toLowerCase();
  const name = str(formData, "name");
  if (!email || !name) redirect("/team?error=member#members");
  const roleId = str(formData, "role_id");
  const { error } = await s.supabase.from("members").insert({
    google_email: email,
    name,
    // With a role picked here they skip the role picker; otherwise they choose on first sign-in.
    role_id: roleId || null,
    status: roleId ? "active" : "invited",
  });
  if (error) redirect("/team?error=duplicate#members");
  await s.supabase.from("activity").insert({ area: "team", actor_id: s.member.id, summary: `added ${name} to the team` });
  done(`${name} can now sign in with ${email}`);
}

export async function updateMember(formData: FormData) {
  const s = await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  const patch: Record<string, unknown> = {
    role_id: str(formData, "role_id") || null,
    status,
    leave_from: status === "on_leave" ? str(formData, "leave_from") || null : null,
    leave_to: status === "on_leave" ? str(formData, "leave_to") || null : null,
  };
  const { error } = await s.supabase.from("members").update(patch).eq("id", id);
  if (error) redirect("/team?error=owner#members");
  done("Member updated");
}

export async function setPermission(formData: FormData) {
  const s = await requireAdmin();
  const roleId = str(formData, "role_id");
  const { data: role } = await s.supabase.from("roles").select("is_admin").eq("id", roleId).single();
  const rows = ["outreach", "projects", "social", "finance", "team"]
    .filter((area) => !(role?.is_admin && area === "team")) // the admin role can't lose Team & roles
    .map((area) => ({ role_id: roleId, area, level: str(formData, area) || "hidden" }));
  await s.supabase.from("role_permissions").upsert(rows);
  await s.supabase.from("roles").update({ emails_need_ok: formData.get("emails_need_ok") === "on" }).eq("id", roleId);
  done("Role access saved");
}

export async function addRole(formData: FormData) {
  const s = await requireAdmin();
  const name = str(formData, "name");
  if (!name) redirect("/team?error=role#roles");
  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36).slice(-4);
  const { data: role, error } = await s.supabase.from("roles").insert({
    key, name, short_name: str(formData, "short_name") || name,
    description: str(formData, "description"),
    emails_need_ok: true, // new roles (e.g. interns) start careful
    selectable: formData.get("selectable") === "on",
    sort: 50,
  }).select("id").single();
  if (error || !role) redirect("/team?error=role#roles");
  // Everything hidden except view-only outreach, until Kirk opens more.
  await s.supabase.from("role_permissions").insert(
    ["outreach", "projects", "social", "finance", "team"].map((area) => ({ role_id: role.id, area, level: area === "outreach" ? "view" : "hidden" })),
  );
  done(`Role “${name}” added`);
}

export async function saveGreeting(formData: FormData) {
  const s = await requireAdmin();
  await s.supabase.from("greeting").update({
    title: str(formData, "title") || "Good morning, {name}",
    message: str(formData, "message"),
    updated_by: s.member.id,
    updated_at: new Date().toISOString(),
  }).eq("id", 1);
  // Show the new greeting again today, even to people who already saw the old one.
  if (formData.get("show_again") === "on") {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(new Date());
    await s.supabase.rpc("reset_greeting_seen", { p_day: today });
  }
  done("Greeting saved");
}

export async function transferTasks(formData: FormData) {
  const s = await requireAdmin();
  const from = str(formData, "from");
  const to = str(formData, "to");
  if (!from || !to || from === to) redirect("/team?error=transfer#leave");
  const { data: n } = await s.supabase.rpc("transfer_tasks", { p_from: from, p_to: to, p_urgent_only: str(formData, "what") !== "all" });
  done(`Moved ${n ?? 0} task(s)`);
}
