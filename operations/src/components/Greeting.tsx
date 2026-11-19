"use client";
import { useEffect, useRef } from "react";
import { markGreetingSeen } from "@/app/(app)/actions";

export function Greeting({ title, message, date, late, today, ok }: {
  title: string; message: string; date: string; late: number; today: number; ok: number;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} className="greet" aria-labelledby="greet-title" onClose={() => { void markGreetingSeen(); }}>
      <div className="hero">
        <div className="mono" style={{ color: "#C9D0FF" }}>{date}</div>
        <h2 id="greet-title" className="cond">{title}</h2>
      </div>
      <div className="body">
        <p>{message}</p>
        <div className="sum">
          <div><b>{late}</b><span>late</span></div>
          <div><b>{today}</b><span>due today</span></div>
          <div><b>{ok}</b><span>need your OK</span></div>
        </div>
        <form method="dialog"><button className="btn b-blue" style={{ width: "100%" }}>Let’s go</button></form>
      </div>
    </dialog>
  );
}
