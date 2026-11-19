"use server";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function chooseRole(formData: FormData) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.rpc("choose_role", { p_role_key: String(formData.get("role")) });
  if (error) redirect("/choose-role?error=1");
  redirect(data === "pending_confirm" ? "/waiting" : "/?welcome=1");
}
