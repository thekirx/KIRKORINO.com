"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

type Tab = { href: string; label: string; icon: IconName };

export function TopBar({ tabs, name, roleShort, initials }: { tabs: Tab[]; name: string; roleShort: string; initials: string }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const current = tabs.find((t) => active(t.href));
  return (
    <header className="top">
      <div className="in">
        <Link className="brand" href="/" aria-label="Operations home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="mk"><img src="/logo.png" alt="KO" width={38} height={38} /></span>
          <b>OPERATIONS</b>
        </Link>
        <span className="mtitle" aria-hidden="true">{current?.label ?? ""}</span>
        <nav className="tabs" aria-label="Main">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} className="tab" aria-current={active(t.href) ? "page" : undefined}>
              <span className="ti"><Icon name={t.icon} /></span>
              {t.label}
            </Link>
          ))}
        </nav>
        <span className="sp" />
        <form action="/auth/signout" method="post">
          <button className="me" title="Sign out" aria-label={`${name}, ${roleShort}. Sign out`}>
            <span className="av">{initials}</span>
            <span>{name} · {roleShort}</span>
          </button>
        </form>
      </div>
    </header>
  );
}
