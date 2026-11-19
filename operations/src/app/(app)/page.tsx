import type { Metadata } from "next";
import Link from "next/link";
import { Greeting } from "@/components/Greeting";
import { Icon } from "@/components/Icon";
import { requireMember, todayManila } from "@/lib/session";
import { ago, dueLabel, formatTime, initials, longDate, partOfDay, SHARED_INBOX, urgency, type Urgency } from "@/lib/format";
import { addTask, completeTask, decideApproval } from "./actions";

export const metadata: Metadata = { title: "Home" };

type Item = {
  key: string; title: string; detail: string; due: string | null; time: string | null;
  urgent: boolean; link: string; area: string; taskId?: string;
};

const ORDER: Record<Urgency, number> = { late: 0, today: 1, soon: 2, none: 3 };
const ICON = { late: "alert", today: "clock", soon: "clock", none: "hour" } as const;
const CARD_BTN = ["b-white", "b-blue", "b-blue", "b-ink"];

export default async function Home() {
  const s = await requireMember();
  const sb = s.supabase;
  const today = todayManila();

  const [tasksQ, prospectsQ, approvalsQ, feedQ, membersQ, greetingQ, seenQ, countsQ, projectsQ] = await Promise.all([
    sb.from("tasks").select("id,title,detail,due_on,due_time,urgent,link,area").eq("owner_id", s.member.id).eq("done", false),
    sb.from("prospects").select("id,business_name,next_step,next_step_due,stage")
      .eq("owner_id", s.member.id).not("stage", "in", "(won,off_list)").not("next_step_due", "is", null),
    s.isAdmin ? sb.from("approvals").select("id,title,detail,link,area").eq("status", "pending").order("created_at") : Promise.resolve({ data: [] }),
    sb.from("activity").select("id,summary,created_at,actor:members(name)").order("created_at", { ascending: false }).limit(8),
    sb.from("members").select("id,name,status,leave_from,leave_to,role:roles(short_name)").in("status", ["active", "on_leave", "pending_confirm", "invited"]).order("created_at"),
    sb.from("greeting").select("title,message").maybeSingle(),
    sb.from("greeting_seen").select("seen_on").eq("member_id", s.member.id).eq("seen_on", today).maybeSingle(),
    sb.from("prospects").select("next_step_due,stage").not("stage", "in", "(won,off_list)"),
    s.can("projects") ? sb.from("projects").select("id", { count: "exact", head: true }) : Promise.resolve({ count: 0 }),
  ]);

  const items: Item[] = [
    ...(tasksQ.data ?? []).map((t) => ({
      key: `t-${t.id}`, title: t.title, detail: t.detail, due: t.due_on, time: t.due_time,
      urgent: t.urgent, link: t.link || "/", area: t.area, taskId: t.id,
    })),
    ...(prospectsQ.data ?? []).map((p) => ({
      key: `p-${p.id}`, title: p.next_step || `Next step for ${p.business_name}`,
      detail: p.business_name, due: p.next_step_due, time: null, urgent: false,
      link: `/outreach/${p.id}`, area: "outreach",
    })),
  ].sort((a, b) => ORDER[urgency(a.due)] - ORDER[urgency(b.due)] || (a.due ?? "9").localeCompare(b.due ?? "9") || Number(b.urgent) - Number(a.urgent));

  const late = items.filter((i) => urgency(i.due) === "late").length;
  const dueToday = items.filter((i) => urgency(i.due) === "today");
  const approvals = (approvalsQ.data ?? []) as { id: string; title: string; detail: string; link: string | null }[];
  const active = countsQ.data ?? [];
  const outreachLate = active.filter((p) => p.next_step_due && p.next_step_due < today).length;
  const first = s.member.name;
  const showGreeting = !seenQ.data && greetingQ.data;

  return (
    <>
      {showGreeting && (
        <Greeting
          title={greetingQ.data!.title.replaceAll("{name}", first)}
          message={greetingQ.data!.message.replaceAll("{name}", first)}
          date={longDate()} late={late} today={dueToday.length} ok={approvals.length}
        />
      )}

      <div className="hello">
        <div>
          <div className="mono muted">{longDate()}</div>
          <h1 className="cond">{partOfDay()}, {first}</h1>
          <p>{s.role.name} · {late} late, {dueToday.length} due today{approvals.length ? `, ${approvals.length} waiting for your OK` : ""}.</p>
        </div>
        <span className="sp" />
        <Link className="btn b-blue fab" href="/outreach#add"><Icon name="plus" />Add prospect</Link>
      </div>

      <div className="homegrid">
        <div>
          <section className="okbox" aria-labelledby="ok-h">
            <div className="hd"><h2 id="ok-h" className="cond">Needs your OK</h2>
              <span className="muted">{approvals.length ? `${approvals.length} request${approvals.length > 1 ? "s" : ""} from the team` : "Nothing waiting on you"}</span></div>
            {approvals.length ? approvals.map((a) => (
              <div className="okrow" key={a.id}>
                <div><div className="t">{a.title}</div><div className="s">{a.detail}</div></div>
                <form action={decideApproval} className="acts">
                  <input type="hidden" name="id" value={a.id} />
                  {a.link && <Link className="btn btn-sm b-line" href={a.link}>Look first</Link>}
                  <button className="btn btn-sm b-soft" name="decision" value="decline">Not yet</button>
                  <button className="btn btn-sm b-blue" name="decision" value="approve">Approve</button>
                </form>
              </div>
            )) : (
              <div className="okempty"><Icon name="check" />{s.isAdmin ? "You’re all clear." : "You’re all clear. Quotes and money go to Kirk; anything that needs you will show up here."}</div>
            )}
          </section>

          {items.length ? (
            <div className="jobs">
              {items.slice(0, 4).map((it, i) => {
                const u = urgency(it.due);
                return (
                  <article key={it.key} className={`job j${i + 1}`}>
                    <span className="mono"><Icon name={ICON[u]} />{dueLabel(it.due, it.time)}{it.urgent ? " · urgent" : ""}</span>
                    <h3 className="cond">{it.title}</h3>
                    <p>{it.detail || " "}</p>
                    <div className="acts">
                      <Link className={`btn ${CARD_BTN[i]}`} href={it.link}>Open <Icon name="arrow" /></Link>
                      {it.taskId && (
                        <form action={completeTask}><input type="hidden" name="id" value={it.taskId} />
                          <button className={`btn ${i === 0 ? "b-line" : "b-soft"}`}>Mark done</button></form>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty" style={{ marginTop: 22 }}>Nothing on your list. Add a task, or give one of your prospects a next step with a date.</div>
          )}
          {items.length > 4 && <p style={{ margin: "16px 0 0" }} className="muted">{items.length - 4} more after these. <Link className="link" href="/outreach">See outreach →</Link></p>}

          <div className="sec"><h2 className="cond">Team at a glance</h2></div>
          <div className={`tiles${s.can("finance") ? "" : " t3"}`}>
            <Link className="tile" href="/outreach">
              <div className="tp"><div className="code" aria-hidden="true">OUT</div><div className="nm">Outreach</div><div className="mt">{active.length} prospects in play</div><div className="mt">Led by Naomi</div></div>
              <div className={`strip ${outreachLate ? "s-late" : "s-ok"}`}><Icon name={outreachLate ? "alert" : "check"} />{outreachLate ? `${outreachLate} follow-up${outreachLate > 1 ? "s" : ""} late` : "On track"}</div>
            </Link>
            <div className="tile">
              <div className="tp"><div className="code" aria-hidden="true">PRJ</div><div className="nm">Projects</div><div className="mt">{projectsQ.count ?? 0} from won prospects</div><div className="mt">Led by Kirk</div></div>
              <div className="strip s-ok"><Icon name="hour" />Full page in Phase 2</div>
            </div>
            <div className="tile">
              <div className="tp"><div className="code" aria-hidden="true">SOC</div><div className="nm">Social &amp; ops</div><div className="mt">Facebook · Instagram · TikTok</div><div className="mt">Led by Kyrene</div></div>
              <div className="strip s-ok"><Icon name="hour" />Coming in Phase 2</div>
            </div>
            {s.can("finance") && (
              <div className="tile">
                <div className="tp"><div className="code" aria-hidden="true">FIN</div><div className="nm">Finance</div><div className="mt">Kirk and Finance only</div><div className="mt">Led by Pauline</div></div>
                <div className="strip s-ok"><Icon name="lock" />Coming in Phase 2</div>
              </div>
            )}
          </div>

          <div className="sec"><h2 className="cond">What just happened</h2></div>
          {feedQ.data?.length ? (
            <ul className="feed">
              {feedQ.data.map((f) => {
                const who = (f.actor as unknown as { name: string } | null)?.name ?? "System";
                return <li key={f.id}><span className="av sm" aria-hidden="true">{initials(who)}</span><span><b>{who}</b> {f.summary}</span><time dateTime={f.created_at}>{ago(f.created_at)}</time></li>;
              })}
            </ul>
          ) : <div className="empty">Nothing yet. Changes the team makes will show up here.</div>}
        </div>

        <aside className="rail" aria-label="Today and quick actions">
          <div className="rcard rhero r-hero">
            <div className="mono" style={{ color: "#C9D0FF" }}>Your day</div>
            <div className="big">{late + dueToday.length}</div>
            <p>{late} late and {dueToday.length} due today.{items.length ? " Start with the blue card." : ""}</p>
          </div>
          <div className="rcard r-quick">
            <h3 className="cond">Quick actions</h3>
            <div className="quick">
              <Link className="btn btn-sm b-blue" href="/outreach#add"><Icon name="plus" />Add prospect</Link>
              <a className="btn btn-sm b-soft" href="#add-task"><Icon name="check" />Add a task</a>
              <a className="btn btn-sm b-soft" href="https://mail.google.com/" target="_blank" rel="noreferrer"><Icon name="ext" />Open Gmail</a>
            </div>
            <p className="fine" style={{ margin: "10px 0 0" }}>Shared inbox: {SHARED_INBOX}</p>
          </div>
          <div className="rcard">
            <h3 className="cond">Today</h3>
            {dueToday.length ? (
              <ul className="agenda">
                {dueToday.map((i) => (
                  <li key={i.key}><span className="tm">{i.time ? formatTime(i.time) : "Any time"}</span>
                    <span><Link href={i.link} style={{ fontWeight: 700, textDecoration: "none" }}>{i.title}</Link><span className="sub">{i.detail}</span></span></li>
                ))}
              </ul>
            ) : <p className="muted" style={{ margin: 0 }}>Nothing dated for today.</p>}
          </div>
          <div className="rcard" id="add-task">
            <h3 className="cond">Add a task</h3>
            <form action={addTask}>
              <div className="field"><label htmlFor="t-title">What needs doing</label><input id="t-title" name="title" className="input" required /></div>
              <div className="field"><label htmlFor="t-detail">Details</label><input id="t-detail" name="detail" className="input" /></div>
              <div className="row2">
                <div className="field"><label htmlFor="t-due">Due</label><input id="t-due" name="due_on" type="date" className="input" /></div>
                <div className="field"><label htmlFor="t-time">Time</label><input id="t-time" name="due_time" type="time" className="input" /></div>
              </div>
              <div className="field"><label htmlFor="t-area">Area</label>
                <select id="t-area" name="area" className="input">
                  <option value="outreach">Outreach</option><option value="projects">Projects</option><option value="social">Social &amp; ops</option>
                  {s.can("finance", "edit") && <option value="finance">Finance</option>}
                </select></div>
              <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}><input type="checkbox" name="urgent" /> Urgent (can be moved to someone else while you’re away)</label>
              <button className="btn b-blue" style={{ width: "100%" }}>Add task</button>
            </form>
          </div>
          <div className="rcard">
            <h3 className="cond">Who’s in</h3>
            <ul className="people">
              {(membersQ.data ?? []).map((m) => {
                const role = (m.role as unknown as { short_name: string } | null)?.short_name ?? "No role yet";
                const leave = m.status === "on_leave";
                const pill = m.status === "active" ? ["p-ok", "In"] : leave ? ["p-wait", "On leave"] : ["p-n", "Not signed in yet"];
                return <li key={m.id}><span className="av sm" aria-hidden="true">{initials(m.name)}</span><span><b>{m.name}</b> <span className="muted" style={{ fontSize: 13 }}>{role}</span></span><span className={`pill ${pill[0]} st`}>{pill[1]}</span></li>;
              })}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
