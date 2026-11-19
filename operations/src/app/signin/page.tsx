import type { Metadata } from "next";
import { AuthArt } from "@/components/AuthArt";
import { Icon } from "@/components/Icon";
import { GoogleButton } from "./GoogleButton";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  not_on_team: "This Google account isn’t on the team. Ask Kirk to add you, then try again.",
  auth: "Sign-in didn’t finish. Try again, and pick the Google account Kirk added.",
};

export default async function SignIn({ searchParams }: { searchParams: Promise<{ error?: string; error_description?: string }> }) {
  const sp = await searchParams;
  const message = sp.error ? ERRORS[sp.error] ?? ERRORS.not_on_team : "";
  return (
    <div className="signin">
      <AuthArt title={<>Our day,<br />in one place.</>} text="Outreach, projects, social and finance for the whole team." foot="Team workspace" />
      <div className="form"><div className="box">
        <div className="mono muted">Team sign-in</div>
        <h2 className="cond">Welcome back</h2>
        <p className="muted" style={{ margin: 0 }}>Use your own Google account. Personal Gmail is fine.</p>
        <GoogleButton />
        {message && <div className="err" role="alert"><Icon name="alert" /><span>{message}</span></div>}
        <ol className="steps">
          <li><b className="n">1</b><span>Sign in with Google. We never see your password.</span></li>
          <li><b className="n">2</b><span>First time only: choose your role.</span></li>
          <li><b className="n">3</b><span>You land on your own home page.</span></li>
        </ol>
        <p className="fine">Invite only. There’s no sign-up form.</p>
      </div></div>
    </div>
  );
}
