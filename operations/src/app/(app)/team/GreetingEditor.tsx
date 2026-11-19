"use client";
import { useState } from "react";

const PRESETS: Record<string, [string, string]> = {
  "Plain good morning": ["Good morning, {name}", "Here’s what’s waiting for you today."],
  "Happy holidays": ["Happy holidays, {name}!", "Thanks for a strong year. Rest well, then let’s finish December strong."],
  "Merry Christmas": ["Merry Christmas, {name}!", "Maligayang Pasko from all of us. Take it easy today."],
  "Happy New Year": ["Happy New Year, {name}!", "New year, new clients. Here’s to a great year ahead."],
  "Happy Halloween": ["Happy Halloween, {name}!", "No scary bugs in production today, please."],
};

export function GreetingEditor({ title, message }: { title: string; message: string }) {
  const [t, setT] = useState(title);
  const [m, setM] = useState(message);
  return (
    <>
      <div className="chips" role="group" aria-label="Seasonal presets">
        {Object.entries(PRESETS).map(([k, [pt, pm]]) => (
          <button key={k} type="button" onClick={() => { setT(pt); setM(pm); }}>{k}</button>
        ))}
      </div>
      <div className="field"><label htmlFor="g-title">Headline</label>
        <input id="g-title" name="title" className="input" value={t} onChange={(e) => setT(e.target.value)} />
        <small>{"{name}"} becomes each person’s first name.</small></div>
      <div className="field"><label htmlFor="g-msg">Message</label>
        <textarea id="g-msg" name="message" className="input" value={m} onChange={(e) => setM(e.target.value)} /></div>
      <div className="note" style={{ marginTop: 0, marginBottom: 14 }}>
        <span><b>Preview:</b> {t.replaceAll("{name}", "Naomi")} — {m.replaceAll("{name}", "Naomi")}</span>
      </div>
    </>
  );
}
