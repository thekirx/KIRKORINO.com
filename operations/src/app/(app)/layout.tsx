import { TopBar } from "@/components/TopBar";
import { requireMember } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await requireMember();
  const tabs = [
    { href: "/", label: "Home", icon: "home" as const },
    { href: "/outreach", label: "Outreach", icon: "send" as const },
    ...(s.isAdmin ? [{ href: "/team", label: "Team", icon: "users" as const }] : []),
  ];
  const initials = s.member.name.slice(0, 2).toUpperCase();
  return (
    <>
      <TopBar tabs={tabs} name={s.member.name} roleShort={s.role.short_name} initials={initials} />
      <main id="main">{children}</main>
    </>
  );
}
