"use server";
import { revalidatePath } from "next/cache";
import { requireMember, requireAdmin, todayManila } from "@/lib/session";

export async function addTask(formData: FormData) {
  const s = await requireMember();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await s.supabase.from("tasks").insert({
    area: String(formData.get("area") || "outreach"),
    owner_id: s.member.id,
    created_by: s.member.id,
    title,
    detail: String(formData.get("detail") ?? "").trim(),
    due_on: String(formData.get("due_on") || "") || null,
    due_time: String(formData.get("due_time") || "") || null,
    urgent: formData.get("urgent") === "on",
  });
  revalidatePath("/");
}

export async function completeTask(formData: FormData) {
  const s = await requireMember();
  await s.supabase.from("tasks").update({ done: true }).eq("id", String(formData.get("id")));
  revalidatePath("/");
}

export async function decideApproval(formData: FormData) {
  const s = await requireAdmin();
  const id = String(formData.get("id"));
  const decision = formData.get("decision") === "approve" ? "approved" : "declined";
  const { data: a } = await s.supabase
    .from("approvals")
    .update({ status: decision, decided_by: s.member.id, decided_at: new Date().toISOString() })
    .eq("id", id)
    .select("area,title,requested_by")
    .single();
  // A first-sign-in role confirmation unlocks the person when approved.
  if (a && a.area === "team" && a.requested_by && decision === "approved") {
    await s.supabase.from("members").update({ status: "active" }).eq("id", a.requested_by).eq("status", "pending_confirm");
  }
  // Declined: they pick a role again on their next sign-in.
  if (a && a.area === "team" && a.requested_by && decision === "declined") {
    await s.supabase.from("members").update({ status: "invited", role_id: null }).eq("id", a.requested_by).eq("status", "pending_confirm");
  }
  if (a) {
    await s.supabase.from("activity").insert({
      area: a.area, actor_id: s.member.id, summary: `${decision} “${a.title}”`,
    });
  }
  revalidatePath("/");
  revalidatePath("/team");
}

export async function markGreetingSeen() {
  const s = await requireMember();
  await s.supabase.from("greeting_seen").upsert({ member_id: s.member.id, seen_on: todayManila() });
}
