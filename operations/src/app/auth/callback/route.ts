import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// Google sends people back here. Swap the one-time code for a session, then go home.
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  if (url.searchParams.get("error")) {
    return NextResponse.redirect(new URL("/signin?error=not_on_team", url.origin));
  }
  if (code) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/", url.origin));
  }
  return NextResponse.redirect(new URL("/signin?error=auth", url.origin));
}
