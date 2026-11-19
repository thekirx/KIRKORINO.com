"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMember } from "@/lib/session";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const orNull = (v: string) => (v ? v : null);

function refresh(id?: string) {
  revalidatePath("/outreach");
  revalidatePath("/");
  if (id) revalidatePath(`/outreach/${id}`);
}

export async function addProspect(formData: FormData) {
  const s = await requireMember();
  const name = str(formData, "business_name");
  if (!name) redirect("/outreach?error=name#add");
  const { data, error } = await s.supabase.from("prospects").insert({
    business_name: name,
    category: str(formData, "category"),
    city: str(formData, "city"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    address: str(formData, "address"),
    stage: str(formData, "stage") || "prospect",
    owner_id: str(formData, "owner_id") || s.member.id,
    next_step: str(formData, "next_step") || "Research one real detail about the business",
    next_step_due: orNull(str(formData, "next_step_due")),
    created_by: s.member.id,
  }).select("id").single();
  if (error || !data) redirect("/outreach?error=save#add");
  refresh();
  redirect(`/outreach/${data.id}`);
}

export async function updateProspect(formData: FormData) {
  const s = await requireMember();
  const id = str(formData, "id");
  const patch: Record<string, unknown> = {};
  for (const k of ["business_name", "category", "city", "phone", "email", "address", "next_step", "gmail_thread_url"]) {
    if (formData.has(k)) patch[k] = str(formData, k);
  }
  if (formData.has("next_step_due")) patch.next_step_due = orNull(str(formData, "next_step_due"));
  if (formData.has("owner_id")) patch.owner_id = orNull(str(formData, "owner_id"));
  if (formData.has("contact_checked_on")) patch.contact_checked_on = orNull(str(formData, "contact_checked_on"));
  await s.supabase.from("prospects").update(patch).eq("id", id);
  refresh(id);
}

export async function moveStage(formData: FormData) {
  const s = await requireMember();
  const id = str(formData, "id");
  const stage = str(formData, "stage");
  const off = stage === "off_list" ? orNull(str(formData, "off_reason")) ?? "not_interested" : null;
  await s.supabase.from("prospects").update({ stage, off_reason: off }).eq("id", id);
  refresh(id);
}

export async function logContact(formData: FormData) {
  const s = await requireMember();
  const id = str(formData, "prospect_id");
  await s.supabase.from("contact_log").insert({
    prospect_id: id,
    channel: str(formData, "channel") || "call",
    outcome: str(formData, "outcome"),
    note: str(formData, "note"),
    logged_by: s.member.id,
  });
  // Setting the next step in the same form keeps the prospect from going quiet.
  const next = str(formData, "next_step");
  const due = str(formData, "next_step_due");
  if (next || due) {
    await s.supabase.from("prospects").update({
      ...(next ? { next_step: next } : {}),
      ...(due ? { next_step_due: due } : {}),
    }).eq("id", id);
  }
  refresh(id);
}

export async function addFact(formData: FormData) {
  const s = await requireMember();
  const id = str(formData, "prospect_id");
  const fact = str(formData, "fact");
  if (!fact) return;
  await s.supabase.from("research_facts").insert({
    prospect_id: id, fact, source_label: str(formData, "source_label"), source_url: str(formData, "source_url"), checked_by: s.member.id,
  });
  const { data: p } = await s.supabase.from("prospects").select("stage").eq("id", id).single();
  if (p?.stage === "prospect") await s.supabase.from("prospects").update({ stage: "researched" }).eq("id", id);
  refresh(id);
}

export async function saveDraft(formData: FormData) {
  const s = await requireMember();
  const id = str(formData, "prospect_id");
  const draftId = str(formData, "draft_id");
  const row = { prospect_id: id, kind: str(formData, "kind") || "intro", subject: str(formData, "subject"), body: str(formData, "body"), updated_by: s.member.id, updated_at: new Date().toISOString() };
  if (draftId) await s.supabase.from("drafts").update(row).eq("id", draftId);
  else await s.supabase.from("drafts").insert(row);
  refresh(id);
}

export async function markDraftSent(formData: FormData) {
  const s = await requireMember();
  const id = str(formData, "prospect_id");
  const draftId = str(formData, "draft_id");
  const { data: d } = await s.supabase.from("drafts").update({ sent_at: new Date().toISOString() }).eq("id", draftId).select("subject").single();
  await s.supabase.from("contact_log").insert({
    prospect_id: id, channel: "email", outcome: "sent", note: d?.subject ?? "", logged_by: s.member.id,
  });
  const due = str(formData, "next_step_due");
  await s.supabase.from("prospects").update({ next_step: "Follow up if there’s no reply", ...(due ? { next_step_due: due } : {}) }).eq("id", id);
  refresh(id);
}
