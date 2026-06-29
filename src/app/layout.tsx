import type { Metadata } from "next";
import { Poppins, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krittapas Polmanee — Full-Stack Developer",
  description:
    "Full-stack developer with production backend experience in Laravel & NestJS. Building systems that serve 75,000+ users. Open to remote roles with Europe timezone overlap.",
  openGraph: {
    title: "Krittapas Polmanee — Full-Stack Developer",
    description:
      "Backend-focused full-stack developer. Laravel · NestJS · Next.js · PostgreSQL.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${sourceSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
