export function AuthArt({ title, text, foot }: { title: React.ReactNode; text: string; foot: string }) {
  return (
    <div className="art">
      <div className="brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span className="mk"><img src="/logo.png" alt="KO" width={38} height={38} /></span>
        <b>OPERATIONS</b>
      </div>
      <div><h1 className="cond">{title}</h1><p>{text}</p></div>
      <div className="mono" style={{ color: "#C9D0FF" }}>{foot}</div>
    </div>
  );
}
