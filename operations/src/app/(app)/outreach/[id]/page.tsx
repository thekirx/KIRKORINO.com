import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { requireMember } from "@/lib/session";
import { ago, daysFromToday, dueLabel, initials, OFF_REASONS, SHARED_INBOX, STAGES, stageLabel, urgency } from "@/lib/format";
import { addFact, logContact, markDraftSent, moveStage, saveDraft, updateProspect } from "../actions";

export const metadata: Metadata = { title: "Prospect" };

const CHANNEL = { call: "Call", email: "Email", visit: "Visit", message: "Message" } as const;

export default async function Prospect({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ template?: string }>;
}) {
  const { id } = await params;
  const { template } = await searchParams;
  const s = await requireMember();
  const sb = s.supabase;
  const [{ data: p }, { data: log }, { data: facts }, { data: drafts }, { data: templates }, { data: members }] = await Promise.all([
    sb.from("prospects").select("*, owner:members!prospects_owner_id_fkey(id,name)").eq("id", id).maybeSingle(),
    sb.from("contact_log").select("id,channel,outcome,note,happened_at,by:members(name)").eq("prospect_id", id).order("happened_at", { ascending: false }),
    sb.from("research_facts").select("id,fact,source_label,source_url,checked_on,by:members(name)").eq("prospect_id", id).order("checked_on", { ascending: false }),
    sb.from("drafts").select("*").eq("prospect_id", id).order("updated_at", { ascending: false }),
    sb.from("templates").select("id,name,kind,subject,body").order("name"),
    sb.from("members").select("id,name").in("status", ["active", "on_leave"]).order("created_at"),
  ]);
  if (!p) notFound();
  const owner = p.owner as { id: string; name: string } | null;
  const u = urgency(p.next_step_due);
  const stageIndex = STAGES.findIndex((st) => st.key === p.stage);
  const tries = (log ?? []).length;

  // Start a new draft from a template, filling in what we know.
  const hook = facts?.[0]?.fact ?? "{hook}";
  const fill = (t: string) => t.replaceAll("{business_name}", p.business_name).replaceAll("{hook}", hook).replaceAll("{sender}", s.member.name);
  const tpl = templates?.find((t) => t.id === template);
  const current = drafts?.find((d) => !d.sent_at);
  const draft = tpl ? { id: "", kind: tpl.kind, subject: fill(tpl.subject), body: fill(tpl.body) } : current;
  const sent = drafts?.filter((d) => d.sent_at) ?? [];
  const tomorrowPlus3 = daysFromToday(3);

  return (
    <>
      <Link className="back" href="/outreach"><Icon name="left" />Back to Outreach</Link>
      <div className="mono muted" style={{ marginTop: 8 }}>{[p.category, p.city].filter(Boolean).join(" · ") || "Prospect"}</div>
      <h1 className="cond" style={{ fontSize: "clamp(34px,6vw,60px)", lineHeight: 1, margin: "6px 0 12px" }}>{p.business_name}</h1>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span className="pill p-n">{p.stage === "off_list" ? `Off the list · ${OFF_REASONS.find((r) => r.key === p.off_reason)?.label}` : `Stage ${stageIndex + 1} of 7: ${stageLabel(p.stage)}`}</span>
        <span className="pill p-n">Owner: {owner?.name ?? "nobody yet"}</span>
        <span className="pill p-n">{tries} contact{tries === 1 ? "" : "s"} logged</span>
        {u === "late" && <span className="pill p-late"><Icon name="alert" />Next step {dueLabel(p.next_step_due)}</span>}
      </div>

      <div className="pgrid">
        <div>
          <section className={`job ${u === "late" ? "j1" : "j3"}`} style={{ minHeight: 0 }}>
            <span className="mono"><Icon name={u === "late" ? "alert" : "clock"} />Next step · {dueLabel(p.next_step_due)}</span>
            <h3 className="cond">{p.next_step || "Decide the next step"}</h3>
            <form action={updateProspect} className="row2" style={{ alignItems: "end" }}>
              <input type="hidden" name="id" value={p.id} />
              <div className="field" style={{ margin: 0 }}><label htmlFor="ns">Change next step</label><input id="ns" name="next_step" className="input" defaultValue={p.next_step} style={{ color: "var(--ink)" }} /></div>
              <div className="field" style={{ margin: 0 }}><label htmlFor="nd">Date</label><input id="nd" name="next_step_due" type="date" className="input" defaultValue={p.next_step_due ?? ""} style={{ color: "var(--ink)" }} /></div>
              <button className={`btn ${u === "late" ? "b-white" : "b-blue"}`} style={{ justifySelf: "start" }}>Save next step</button>
            </form>
          </section>

          <section className="card" style={{ marginTop: 16 }}>
            <div className="box-h"><h2 className="cond">Log a call or email</h2></div>
            <form action={logContact} className="box-b">
              <input type="hidden" name="prospect_id" value={p.id} />
              <div className="row2">
                <div className="field"><label htmlFor="lc-ch">How</label>
                  <select id="lc-ch" name="channel" className="input">{Object.entries(CHANNEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                <div className="field"><label htmlFor="lc-out">What happened</label>
                  <input id="lc-out" name="outcome" className="input" list="outcomes" placeholder="e.g. No answer" />
                  <datalist id="outcomes"><option value="No answer" /><option value="Left a message" /><option value="Sent" /><option value="Replied, interested" /><option value="Replied, not now" /><option value="Booked a meeting" /></datalist></div>
              </div>
              <div className="field"><label htmlFor="lc-note">Notes</label><textarea id="lc-note" name="note" className="input" style={{ minHeight: 70 }} /></div>
              <div className="row2">
                <div className="field"><label htmlFor="lc-next">New next step (optional)</label><input id="lc-next" name="next_step" className="input" placeholder="e.g. Try again after 2 PM" /></div>
                <div className="field"><label htmlFor="lc-due">Date</label><input id="lc-due" name="next_step_due" type="date" className="input" /></div>
              </div>
              <button className="btn b-blue"><Icon name="phone" />Save to history</button>
              {tries >= 3 && p.stage === "contacted" && <p className="fine">That’s {tries} tries with no reply. Consider moving it off the list as “No reply after 3 tries”.</p>}
            </form>
          </section>

          <section className="card" style={{ marginTop: 16 }}>
            <div className="box-h"><h2 className="cond">Email</h2><span style={{ flex: 1 }} />
              <form method="get" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <label className="sr" htmlFor="tpl">Template</label>
                <select id="tpl" name="template" className="input" style={{ width: "auto" }} defaultValue={template ?? ""}>
                  <option value="" disabled>Start from a template…</option>
                  {(templates ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <button className="btn btn-sm b-soft">Use</button>
              </form>
            </div>
            <form action={saveDraft} className="box-b">
              <input type="hidden" name="prospect_id" value={p.id} />
              <input type="hidden" name="draft_id" value={draft?.id ?? ""} />
              <input type="hidden" name="kind" value={draft?.kind ?? "intro"} />
              <p className="fine" style={{ marginTop: 0 }}>Write it here, copy it into <b>{SHARED_INBOX}</b>, send, then press <b>Mark as sent</b>. {facts?.length ? "Your newest research fact fills {hook}." : "Add a research fact first so the email opens with something real."}</p>
              <div className="field"><label htmlFor="d-subj">Subject</label><input id="d-subj" name="subject" className="input" defaultValue={draft?.subject ?? ""} /></div>
              <div className="field"><label htmlFor="d-body">Message</label><textarea id="d-body" name="body" className="input" style={{ minHeight: 220 }} defaultValue={draft?.body ?? ""} /></div>
              <button className="btn b-soft">Save draft</button>
            </form>
            {current && !tpl && (
              <form action={markDraftSent} className="box-b" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "end", borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                <input type="hidden" name="prospect_id" value={p.id} />
                <input type="hidden" name="draft_id" value={current.id} />
                <div className="field" style={{ margin: 0 }}><label htmlFor="d-fu">Follow up on</label><input id="d-fu" name="next_step_due" type="date" className="input" defaultValue={tomorrowPlus3} /></div>
                <button className="btn b-blue"><Icon name="mail" />Mark as sent</button>
              </form>
            )}
            {sent.length > 0 && (
              <details className="more"><summary><Icon name="mail" />{sent.length} sent email{sent.length > 1 ? "s" : ""}</summary>
                <div className="box-b">{sent.map((d) => (
                  <div key={d.id} style={{ borderTop: "1px solid var(--line)", padding: "12px 0" }}>
                    <div className="mono muted">Sent {new Date(d.sent_at).toLocaleDateString("en-PH", { day: "numeric", month: "short" })}</div>
                    <b>{d.subject}</b><p style={{ whiteSpace: "pre-wrap", margin: "6px 0 0" }}>{d.body}</p></div>
                ))}</div>
              </details>
            )}
          </section>

          <section className="card" style={{ marginTop: 16 }}>
            <div className="box-h"><h2 className="cond">Research</h2><span className="muted">{facts?.length ?? 0} fact{facts?.length === 1 ? "" : "s"}</span></div>
            <div className="box-b">
              {(facts ?? []).map((f) => (
                <p key={f.id} style={{ margin: "0 0 12px" }}><mark>{f.fact}</mark><br />
                  <span className="muted" style={{ fontSize: 14 }}>{f.source_url ? <a href={f.source_url} target="_blank" rel="noreferrer">{f.source_label || "Source"}</a> : f.source_label || "No source"} · checked {f.checked_on} by {(f.by as unknown as { name: string } | null)?.name ?? "—"}</span></p>
              ))}
              <form action={addFact}>
                <input type="hidden" name="prospect_id" value={p.id} />
                <div className="field"><label htmlFor="f-fact">Something specific about this business</label><input id="f-fact" name="fact" className="input" placeholder="e.g. Posts a new single-origin board every Monday" required /></div>
                <div className="row2">
                  <div className="field"><label htmlFor="f-src">Where you saw it</label><input id="f-src" name="source_label" className="input" placeholder="e.g. Instagram post, 3 Nov" /></div>
                  <div className="field"><label htmlFor="f-url">Link</label><input id="f-url" name="source_url" type="url" className="input" /></div>
                </div>
                <button className="btn b-soft"><Icon name="plus" />Add fact</button>
              </form>
            </div>
          </section>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <section className="card">
            <div className="box-h"><h2 className="cond">Stage</h2></div>
            <form action={moveStage} className="box-b">
              <input type="hidden" name="id" value={p.id} />
              <div className="field"><label htmlFor="st">Move to</label>
                <select id="st" name="stage" className="input" defaultValue={p.stage}>
                  {STAGES.map((st, i) => <option key={st.key} value={st.key}>{i + 1}. {st.label}</option>)}
                  <option value="off_list">Off the list</option>
                </select></div>
              <div className="field"><label htmlFor="off">If off the list, why</label>
                <select id="off" name="off_reason" className="input" defaultValue={p.off_reason ?? "not_interested"}>{OFF_REASONS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}</select></div>
              <button className="btn b-blue">Move</button>
              <p className="fine">Moving to <b>Won</b> creates a project automatically. Quotes need Kirk’s OK before <b>Proposal</b>.</p>
            </form>
          </section>

          <section className="card">
            <div className="box-h"><h2 className="cond">Contact</h2></div>
            <form action={updateProspect} className="box-b">
              <input type="hidden" name="id" value={p.id} />
              <div className="field"><label htmlFor="c-phone">Phone</label><input id="c-phone" name="phone" type="tel" className="input" defaultValue={p.phone} /></div>
              <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" className="input" defaultValue={p.email} /></div>
              <div className="field"><label htmlFor="c-addr">Address</label><input id="c-addr" name="address" className="input" defaultValue={p.address} /></div>
              <div className="field"><label htmlFor="c-owner">Owner</label>
                <select id="c-owner" name="owner_id" className="input" defaultValue={owner?.id ?? ""}><option value="">Nobody yet</option>{(members ?? []).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
              <div className="field"><label htmlFor="c-gmail">Gmail thread link</label><input id="c-gmail" name="gmail_thread_url" type="url" className="input" defaultValue={p.gmail_thread_url} placeholder="Paste the thread link from the shared inbox" /></div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn b-blue">Save contact</button>
                {p.gmail_thread_url && <a className="btn b-soft" href={p.gmail_thread_url} target="_blank" rel="noreferrer"><Icon name="ext" />Open in Gmail</a>}
              </div>
            </form>
          </section>

          <section className="card">
            <div className="box-h"><h2 className="cond">History</h2></div>
            {log?.length ? (
              <ul className="feed" style={{ border: 0, borderRadius: 0 }}>
                {log.map((l) => {
                  const who = (l.by as unknown as { name: string } | null)?.name ?? "—";
                  return <li key={l.id}><span className="av sm" aria-hidden="true">{initials(who)}</span>
                    <span><b>{who}</b> · {CHANNEL[l.channel as keyof typeof CHANNEL]}{l.outcome ? ` · ${l.outcome}` : ""}{l.note && <span className="muted" style={{ display: "block", fontSize: 14 }}>{l.note}</span>}</span>
                    <time dateTime={l.happened_at}>{ago(l.happened_at)}</time></li>;
                })}
              </ul>
            ) : <p className="box-b muted" style={{ margin: 0 }}>No calls or emails logged yet.</p>}
          </section>
        </div>
      </div>
    </>
  );
}
