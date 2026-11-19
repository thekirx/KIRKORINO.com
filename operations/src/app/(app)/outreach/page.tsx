import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { requireMember } from "@/lib/session";
import { dueLabel, initials, OFF_REASONS, SHARED_INBOX, STAGES, stageLabel, urgency } from "@/lib/format";
import { addProspect } from "./actions";

export const metadata: Metadata = { title: "Outreach" };

const PILL = { late: "p-late", today: "p-today", soon: "p-n", none: "p-wait" } as const;

export default async function Outreach({ searchParams }: { searchParams: Promise<{ stage?: string; mine?: string; error?: string }> }) {
  const s = await requireMember();
  const sp = await searchParams;
  const [{ data: all }, { data: members }] = await Promise.all([
    s.supabase.from("prospects")
      .select("id,business_name,city,stage,off_reason,next_step,next_step_due,owner:members!prospects_owner_id_fkey(id,name)")
      .order("next_step_due", { ascending: true, nullsFirst: false }),
    s.supabase.from("members").select("id,name").in("status", ["active", "on_leave"]).order("created_at"),
  ]);
  const prospects = all ?? [];
  const live = prospects.filter((p) => p.stage !== "off_list");
  const counts = Object.fromEntries(STAGES.map((st) => [st.key, live.filter((p) => p.stage === st.key).length]));
  const lateBy = (key: string) => live.filter((p) => p.stage === key && urgency(p.next_step_due) === "late").length;
  const offCount = prospects.length - live.length;

  let rows = sp.stage === "off_list" ? prospects.filter((p) => p.stage === "off_list") : live;
  if (sp.stage && sp.stage !== "off_list") rows = rows.filter((p) => p.stage === sp.stage);
  if (sp.mine) rows = rows.filter((p) => (p.owner as unknown as { id: string } | null)?.id === s.member.id);
  const filterLabel = sp.stage ? (sp.stage === "off_list" ? "Off the list" : stageLabel(sp.stage)) : "All in play";

  return (
    <>
      <div className="hello">
        <div><div className="mono muted">Led by Naomi · open to the whole team</div><h1 className="cond">Outreach</h1>
          <p>Every business we’re talking to, how far along it is, and who owns it.</p></div>
        <span className="sp" />
        <a className="btn b-blue fab" href="#add"><Icon name="plus" />Add prospect</a>
      </div>

      <nav className="flow" aria-label="Stages">
        {STAGES.map((st, i) => {
          const late = lateBy(st.key);
          return (
            <Link key={st.key} href={sp.stage === st.key ? "/outreach" : `/outreach?stage=${st.key}`}
              className={`stage${late ? " hot" : ""}${st.key === "won" ? " won" : ""}`} aria-current={sp.stage === st.key ? "true" : undefined}>
              <div className="mono" style={{ opacity: 0.75 }}>{i + 1}</div>
              <div className="l">{st.label}</div>
              <div className="n">{counts[st.key]}</div>
              <div className="d">{late ? `${late} late · ` : ""}{st.help}</div>
            </Link>
          );
        })}
      </nav>
      <div className="exits"><b>Off the list:</b>{OFF_REASONS.map((r) => <span key={r.key} className="pill p-n">{r.label}</span>)}
        <Link className="link" href="/outreach?stage=off_list">See {offCount} off the list</Link></div>
      <div className="note"><Icon name="info" /><span>All emails go out from <b>{SHARED_INBOX}</b>. After you email or call, log it on the prospect so everyone sees it. When a prospect reaches <b>Won</b>, it becomes a project automatically.</span></div>

      <div className="sec">
        <h2 className="cond">{filterLabel}</h2><span className="muted">{rows.length}</span><span className="sp" />
        <Link className="btn btn-sm b-soft" href={sp.mine ? `/outreach${sp.stage ? `?stage=${sp.stage}` : ""}` : `/outreach?mine=1${sp.stage ? `&stage=${sp.stage}` : ""}`}>{sp.mine ? "Show everyone’s" : "Show only mine"}</Link>
      </div>
      {rows.length ? (
        <div className="card scroll">
          <table className="table">
            <thead><tr><th>Business</th><th className="hide">Stage</th><th className="hide">Owner</th><th>Next step</th></tr></thead>
            <tbody>
              {rows.map((p) => {
                const owner = p.owner as unknown as { name: string } | null;
                const u = urgency(p.next_step_due);
                return (
                  <tr key={p.id}>
                    <td><Link href={`/outreach/${p.id}`}><b>{p.business_name}</b><div className="muted" style={{ fontSize: 14 }}>{p.city || "—"}</div></Link></td>
                    <td className="hide">{p.stage === "off_list" ? OFF_REASONS.find((r) => r.key === p.off_reason)?.label : stageLabel(p.stage)}</td>
                    <td className="hide"><span className="who">{owner ? <><span className="av sm" aria-hidden="true">{initials(owner.name)}</span>{owner.name}</> : <span className="muted">No owner</span>}</span></td>
                    <td><Link href={`/outreach/${p.id}`}><span className={`pill ${PILL[u]}`}><Icon name={u === "late" ? "alert" : "clock"} />{dueLabel(p.next_step_due)}</span>
                      <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>{p.next_step || "No next step yet"}</div></Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : <div className="empty">No prospects here yet. Add the first one below.</div>}

      <section id="add" className="card" style={{ marginTop: 32, scrollMarginTop: 90 }}>
        <div className="box-h"><h2 className="cond">Add a prospect</h2></div>
        <form action={addProspect} className="box-b">
          {sp.error && <div className="err" role="alert" style={{ marginTop: 0, marginBottom: 14 }}><Icon name="alert" /><span>{sp.error === "name" ? "Add the business name, then save again." : "That didn’t save. Check your connection and try again."}</span></div>}
          <div className="row2">
            <div className="field"><label htmlFor="p-name">Business name *</label><input id="p-name" name="business_name" className="input" required /></div>
            <div className="field"><label htmlFor="p-cat">Type of business</label><input id="p-cat" name="category" className="input" placeholder="e.g. Specialty café" /></div>
          </div>
          <div className="row3">
            <div className="field"><label htmlFor="p-phone">Phone</label><input id="p-phone" name="phone" type="tel" className="input" /></div>
            <div className="field"><label htmlFor="p-email">Email</label><input id="p-email" name="email" type="email" className="input" /></div>
            <div className="field"><label htmlFor="p-city">City</label><input id="p-city" name="city" className="input" placeholder="e.g. Makati" /></div>
          </div>
          <div className="field"><label htmlFor="p-address">Business address</label><input id="p-address" name="address" className="input" /></div>
          <div className="row3">
            <div className="field"><label htmlFor="p-stage">Stage</label>
              <select id="p-stage" name="stage" className="input">{STAGES.slice(0, 3).map((st) => <option key={st.key} value={st.key}>{st.label}</option>)}</select></div>
            <div className="field"><label htmlFor="p-owner">Owner</label>
              <select id="p-owner" name="owner_id" className="input" defaultValue={s.member.id}>{(members ?? []).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <div className="field"><label htmlFor="p-due">Next step date</label><input id="p-due" name="next_step_due" type="date" className="input" /></div>
          </div>
          <div className="field"><label htmlFor="p-next">Next step</label><input id="p-next" name="next_step" className="input" placeholder="Research one real detail about the business" /></div>
          <button className="btn b-blue">Save prospect</button>
        </form>
      </section>
    </>
  );
}
