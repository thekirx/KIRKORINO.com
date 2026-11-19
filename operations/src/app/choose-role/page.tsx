import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthArt } from "@/components/AuthArt";
import { Icon, type IconName } from "@/components/Icon";
import { getSession, type Role } from "@/lib/session";
import { chooseRole } from "./actions";

export const metadata: Metadata = { title: "Choose your role" };
const ICONS: Record<string, IconName> = { gm: "code", ops: "mega", mkt: "send", fin: "wallet" };

export default async function ChooseRole({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const s = await getSession();
  if (!s.user) redirect("/signin");
  if (!s.member) redirect("/signin?error=not_on_team");
  if (s.member.status !== "invited") redirect("/");
  const { error } = await searchParams;
  const { data: roles } = await s.supabase.from("roles").select("*").eq("selectable", true).order("sort");
  return (
    <div className="signin">
      <AuthArt title={<>What do you<br />do here?</>} text="Your role decides your home page and what you can open. Kirk approves it, and can change it later." foot="Signed in with Google" />
      <div className="form"><div className="box">
        <div className="mono muted">First sign-in · {s.member.name}</div>
        <h2 className="cond">Choose your role</h2>
        <form action={chooseRole} className="roles">
          {(roles as Role[] | null)?.map((r) => (
            <button key={r.id} className="rolecard" name="role" value={r.key}>
              <span className="ic"><Icon name={ICONS[r.key] ?? "users"} /></span>
              <span><b>{r.name}</b><span>{r.description}</span></span>
              <Icon name="arrow" />
            </button>
          ))}
        </form>
        {error && <div className="err" role="alert"><Icon name="alert" /><span>That role couldn’t be saved. Refresh the page and pick again.</span></div>}
        <p className="fine"><Icon name="lock" /> Kirk approves every new teammate before they can see anything. You’ll wait on the next screen until he does.</p>
      </div></div>
    </div>
  );
}
