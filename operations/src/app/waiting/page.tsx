import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthArt } from "@/components/AuthArt";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Waiting for Kirk" };

export default async function Waiting() {
  const s = await getSession();
  if (!s.user) redirect("/signin");
  if (s.member?.status !== "pending_confirm") redirect("/");
  return (
    <div className="signin">
      <AuthArt title={<>Almost<br />there.</>} text="Kirk confirms this role before it unlocks, because it can see money and settings." foot="Waiting for confirmation" />
      <div className="form"><div className="box">
        <div className="mono muted">{s.member.name} · {s.role?.short_name}</div>
        <h2 className="cond">Waiting for Kirk</h2>
        <p className="muted">Kirk has a request on his home page. Once he confirms, reload this page and you’re in.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
          <Link className="btn b-blue" href="/">Check again</Link>
          <form action="/auth/signout" method="post"><button className="btn b-soft">Sign out</button></form>
        </div>
      </div></div>
    </div>
  );
}
