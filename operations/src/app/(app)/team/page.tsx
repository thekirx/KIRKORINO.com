import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { requireAdmin } from "@/lib/session";
import { initials } from "@/lib/format";
import { addMember, addRole, saveGreeting, setPermission, transferTasks, updateMember } from "./actions";
import { GreetingEditor } from "./GreetingEditor";

export const metadata: Metadata = { title: "Team & roles" };

const AREAS = [
  { key: "outreach", label: "Outreach" },
  { key: "projects", label: "Projects" },
  { key: "social", label: "Social & ops" },
  { key: "finance", label: "Finance" },
  { key: "team", label: "Team & roles" },
];
const LEVELS = [["hidden", "Hidden"], ["view", "View"], ["edit", "Edit"], ["approve", "Approve"]];
const STATUS: Record<string, [string, string]> = {
  invited: ["p-n", "Hasn’t signed in"],
  pending_confirm: ["p-wait", "Waiting for you"],
  active: ["p-ok", "Active"],
  on_leave: ["p-wait", "On leave"],
  removed: ["p-late", "Removed"],
};
const ERRORS: Record<string, string> = {
  member: "Add both a name and a Google email.",
  duplicate: "That Google email is already on the team.",
  owner: "Kirk always stays an active General Manager, so that change wasn’t saved.",
  role: "Give the new role a name.",
  transfer: "Pick two different people to move work between.",
};

export default async function Team({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const s = await requireAdmin();
  const sp = await searchParams;
  const sb = s.supabase;
  const [{ data: members }, { data: roles }, { data: perms }, { data: greeting }, { data: openTasks }] = await Promise.all([
    sb.from("members").select("id,name,google_email,status,role_id,is_owner,leave_from,leave_to").neq("status", "removed").order("created_at"),
    sb.from("roles").select("*").order("sort"),
    sb.from("role_permissions").select("role_id,area,level"),
    sb.from("greeting").select("title,message").maybeSingle(),
    sb.from("tasks").select("owner_id,urgent").eq("done", false),
  ]);
  const level = (roleId: string, area: string) => perms?.find((p) => p.role_id === roleId && p.area === area)?.level ?? "hidden";
  const taskCount = (id: string, urgentOnly = false) => (openTasks ?? []).filter((t) => t.owner_id === id && (!urgentOnly || t.urgent)).length;

  return (
    <>
      <div className="hello">
        <div><div className="mono muted"><Icon name="lock" /> Only Kirk can open this page</div><h1 className="cond">Team &amp; roles</h1>
          <p>Add people, set roles, pause someone on leave, move their work, and set the daily greeting.</p></div>
      </div>
      {sp.saved && <div className="note" role="status"><Icon name="check" /><span>{sp.saved}</span></div>}
      {sp.error && <div className="err" role="alert"><Icon name="alert" /><span>{ERRORS[sp.error] ?? "That didn’t save. Try again."}</span></div>}

      <div className="sec" id="members"><h2 className="cond">Members</h2><span className="muted">{members?.length ?? 0}</span></div>
      <div className="tiles">
        {(members ?? []).map((m) => {
          const st = STATUS[m.status];
          return (
            <form key={m.id} action={updateMember} className="tile">
              <input type="hidden" name="id" value={m.id} />
              <div className="tp">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span className="av" aria-hidden="true">{initials(m.name)}</span><div className="nm" style={{ margin: 0 }}>{m.name}</div></div>
                <div className="mt" style={{ margin: "8px 0 12px", overflowWrap: "anywhere" }}>Google · {m.google_email}</div>
                <div className="field"><label htmlFor={`r-${m.id}`}>Role</label>
                  <select id={`r-${m.id}`} name="role_id" className="input" defaultValue={m.role_id ?? ""} disabled={m.is_owner}>
                    <option value="">Lets them choose</option>
                    {(roles ?? []).map((r) => <option key={r.id} value={r.id}>{r.short_name}</option>)}
                  </select>
                  {m.is_owner && <input type="hidden" name="role_id" value={m.role_id ?? ""} />}</div>
                <div className="field"><label htmlFor={`s-${m.id}`}>Status</label>
                  <select id={`s-${m.id}`} name="status" className="input" defaultValue={m.status} disabled={m.is_owner}>
                    <option value="invited">Hasn’t signed in</option>
                    <option value="pending_confirm">Waiting for you</option>
                    <option value="active">Active</option>
                    <option value="on_leave">On leave</option>
                    <option value="removed">Remove from team</option>
                  </select>
                  {m.is_owner && <input type="hidden" name="status" value={m.status} />}</div>
                <div className="row2">
                  <div className="field"><label htmlFor={`lf-${m.id}`}>Leave from</label><input id={`lf-${m.id}`} name="leave_from" type="date" className="input" defaultValue={m.leave_from ?? ""} /></div>
                  <div className="field"><label htmlFor={`lt-${m.id}`}>Until</label><input id={`lt-${m.id}`} name="leave_to" type="date" className="input" defaultValue={m.leave_to ?? ""} /></div>
                </div>
                {!m.is_owner && <button className="btn btn-sm b-blue">Save</button>}
              </div>
              <div className={`strip ${m.status === "pending_confirm" ? "s-wait" : m.is_owner ? "s-late" : "s-ok"}`}>
                {m.is_owner ? <><Icon name="lock" />Owner · always admin</> : <><span className={`pill ${st[0]}`}>{st[1]}</span>{taskCount(m.id)} open task(s)</>}
              </div>
            </form>
          );
        })}
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="box-h"><h2 className="cond">Add someone</h2></div>
        <form action={addMember} className="box-b">
          <div className="row3">
            <div className="field"><label htmlFor="am-name">First name</label><input id="am-name" name="name" className="input" required /></div>
            <div className="field"><label htmlFor="am-email">Google email</label><input id="am-email" name="google_email" type="email" className="input" placeholder="name@gmail.com" required /></div>
            <div className="field"><label htmlFor="am-role">Role</label>
              <select id="am-role" name="role_id" className="input" defaultValue=""><option value="">They choose on first sign-in</option>{(roles ?? []).map((r) => <option key={r.id} value={r.id}>{r.short_name}</option>)}</select></div>
          </div>
          <button className="btn b-blue"><Icon name="plus" />Add to team</button>
          <p className="fine">Only Google accounts on this list can sign in. Personal Gmail works.</p>
        </form>
      </section>

      <div className="sec" id="roles"><h2 className="cond">Roles &amp; what they can do</h2></div>
      <p className="muted" style={{ marginTop: -6 }}><b>Hidden</b> can’t see it · <b>View</b> read only · <b>Edit</b> add and change · <b>Approve</b> edit and sign off. Finance stays hidden for everyone except General Manager and Finance.</p>
      <div className="card scroll">
        <table className="table matrix">
          <thead><tr><th>Role</th>{AREAS.map((a) => <th key={a.key}>{a.label}</th>)}<th>Emails need OK</th><th><span className="sr">Save</span></th></tr></thead>
          <tbody>
            {(roles ?? []).map((r) => {
              const formId = `perm-${r.id}`;
              return (
                <tr key={r.id}>
                  <td><b>{r.short_name}</b><div className="muted" style={{ fontSize: 13 }}>{r.name}</div>
                    <form id={formId} action={setPermission}><input type="hidden" name="role_id" value={r.id} /></form></td>
                  {AREAS.map((a) => (
                    <td key={a.key}>
                      <select form={formId} name={a.key} aria-label={`${r.short_name}: ${a.label}`} defaultValue={level(r.id, a.key)} disabled={r.is_admin && a.key === "team"}>
                        {LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                  ))}
                  <td><input form={formId} type="checkbox" name="emails_need_ok" defaultChecked={r.emails_need_ok} aria-label={`${r.short_name}: outreach emails need Kirk's OK`} /></td>
                  <td><button form={formId} className="btn btn-sm b-soft">Save</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <section className="card" style={{ marginTop: 16 }}>
        <div className="box-h"><h2 className="cond">New role</h2><span className="muted">For example, interns</span></div>
        <form action={addRole} className="box-b">
          <div className="row3">
            <div className="field"><label htmlFor="nr-name">Full name</label><input id="nr-name" name="name" className="input" placeholder="Marketing Intern" required /></div>
            <div className="field"><label htmlFor="nr-short">Short name</label><input id="nr-short" name="short_name" className="input" placeholder="Intern" /></div>
            <div className="field"><label htmlFor="nr-desc">What they do</label><input id="nr-desc" name="description" className="input" placeholder="Helps with research" /></div>
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}><input type="checkbox" name="selectable" /> Show it on the first-sign-in role picker</label>
          <button className="btn b-blue"><Icon name="plus" />Add role</button>
          <p className="fine">New roles start with Outreach on View and everything else Hidden, and their emails need your OK. Change it in the table above.</p>
        </form>
      </section>

      <div className="two" style={{ marginTop: 48 }}>
        <section className="card" id="greeting">
          <div className="box-h"><h2 className="cond">Daily greeting</h2></div>
          <form action={saveGreeting} className="box-b">
            <p className="fine" style={{ marginTop: 0 }}>Pops up the first time each person opens the app each day.</p>
            <GreetingEditor title={greeting?.title ?? "Good morning, {name}"} message={greeting?.message ?? ""} />
            <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}><input type="checkbox" name="show_again" /> Show it again today to people who already saw today’s</label>
            <button className="btn b-blue">Save greeting</button>
          </form>
        </section>

        <section className="card" id="leave">
          <div className="box-h"><h2 className="cond">Leave &amp; handovers</h2></div>
          <form action={transferTasks} className="box-b">
            <p className="fine" style={{ marginTop: 0 }}>While someone is on leave their work pauses. Only urgent items move, and only you can move them.</p>
            <div className="field"><label htmlFor="tf-from">From</label>
              <select id="tf-from" name="from" className="input">{(members ?? []).map((m) => <option key={m.id} value={m.id}>{m.name}{m.status === "on_leave" ? " · on leave" : ""} ({taskCount(m.id, true)} urgent, {taskCount(m.id)} total)</option>)}</select></div>
            <div className="field"><label htmlFor="tf-what">What</label>
              <select id="tf-what" name="what" className="input"><option value="urgent">Only urgent tasks</option><option value="all">All open tasks</option></select></div>
            <div className="field"><label htmlFor="tf-to">To</label>
              <select id="tf-to" name="to" className="input">{(members ?? []).filter((m) => m.status === "active").map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <button className="btn b-blue"><Icon name="swap" />Move work</button>
            <p className="fine">The move is recorded in “What just happened”.</p>
          </form>
        </section>
      </div>
    </>
  );
}
