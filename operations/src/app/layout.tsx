import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const mono = JetBrains_Mono({ variable: "--font-jbmono", subsets: ["latin"], weight: ["600"] });

export const metadata: Metadata = {
  title: { default: "Operations", template: "%s · Operations" },
  description: "The team's shared workspace for outreach, projects, social and finance.",
  icons: { apple: "/logo.png" },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#1D36FF", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
