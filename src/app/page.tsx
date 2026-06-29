"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Menu,
  Database,
  Server,
  Smartphone,
  ExternalLink,
} from "lucide-react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4";

const LINKS = {
  github: "https://github.com/krittapastrycode",
  linkedin: "https://www.linkedin.com/in/krittapas-polmanee",
  email: "capton45@gmail.com",
};

type Project = {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  live?: { label: string; href: string };
  repo?: string;
  icon: React.ReactNode;
  flagship?: boolean;
};

const PROJECTS: Project[] = [
  {
    name: "BaanTDee",
    tagline: "Real-estate listing platform · บ้านที่ดี",
    description:
      "Full-stack property marketplace for Thailand. Tiered subscriptions with billing, geo-search over PostGIS, image uploads to R2, and Omise payments — built end to end and deployed on Railway.",
    stack: ["NestJS", "Next.js 16", "PostgreSQL + PostGIS", "Redis", "Omise", "Railway"],
    live: { label: "dev.baantdee.com", href: "https://dev.baantdee.com" },
    repo: "https://github.com/krittapastrycode",
    icon: <Server className="h-5 w-5" />,
    flagship: true,
  },
  {
    name: "Military Task Manager",
    tagline: "Role-aware mission assignment system",
    description:
      "Secure mission-assignment platform with admin-approval onboarding, role-based access (admin / commander / user), Google Calendar sync via service account, and PDF report export.",
    stack: ["Laravel 11", "Next.js 15", "PostgreSQL", "Filament", "Google Calendar API"],
    repo: "https://github.com/krittapastrycode/military-task-manager-backend",
    icon: <Database className="h-5 w-5" />,
  },
  {
    name: "HoroAcademy",
    tagline: "Astrology platform · 75,000+ users",
    description:
      "Production Laravel backend maintained at Quintaura. Built subscription/billing logic and a custom Filament admin dashboard letting internal teams manage plans without developer intervention.",
    stack: ["Laravel", "Filament PHP", "PostgreSQL"],
    icon: <Server className="h-5 w-5" />,
  },
  {
    name: "Baby Reveal",
    tagline: "Interactive gender-reveal microsite",
    description:
      "A playful balloon-pop reveal with shareable QR codes — a small, fun build shipped and live on Vercel.",
    stack: ["JavaScript", "Vercel"],
    live: { label: "Live demo", href: "https://baby-reveal-kappa.vercel.app" },
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    name: "DomEmerge",
    tagline: "Cross-platform mobile app",
    description:
      "React Native / Expo application with file-based routing — exploring mobile delivery of the same product instincts.",
    stack: ["React Native", "Expo", "TypeScript"],
    repo: "https://github.com/krittapastrycode",
    icon: <Smartphone className="h-5 w-5" />,
  },
];

const STACK = {
  Backend: ["PHP / Laravel", "Filament", "NestJS", "Node.js", "REST APIs"],
  Frontend: ["Next.js", "NuxtJS", "React", "React Native", "TypeScript"],
  "Data & Infra": ["PostgreSQL + PostGIS", "Redis", "Docker", "Railway", "Cloudflare R2"],
};

const EXPERIENCE = [
  {
    role: "Backend Developer",
    org: "Quintaura Co., Ltd. — Thailand",
    period: "Aug 2025 — Present",
    detail:
      "Maintain and extend a Laravel platform serving 75,000+ users. Built subscription billing and Filament admin tooling; developing a CRM + doctor-scheduling prototype for a large healthcare client.",
  },
  {
    role: "Research Intern",
    org: "Yeungnam University — South Korea",
    period: "Jul 2024 — Sep 2024",
    detail:
      "International research internship on ROS and YOLO under Asst. Prof. Park Ji-hyuk — system performance analysis and computer-vision solutions.",
  },
  {
    role: "B.Eng. Computer Engineering",
    org: "Rajamangala University of Technology Thanyaburi",
    period: "2021 — 2025",
    detail: "Thai (native) · English upper-intermediate (TOEIC 810 · DET 110).",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* Video background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover grayscale"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        {/* darkening overlay so it reads as abstract texture */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      <div className="relative z-10">
        <HeroSplit />
        <Projects />
        <Stack />
        <Experience />
        <Contact />
      </div>
    </main>
  );
}

function Monogram({ size = "text-base" }: { size?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="liquid-glass flex h-8 w-8 items-center justify-center rounded-full">
        <span className="text-xs font-semibold tracking-tighter text-white">KP</span>
      </div>
      <span className={`font-semibold tracking-tighter text-white ${size}`}>
        krittapas
      </span>
    </div>
  );
}

function HeroSplit() {
  return (
    <section className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left panel */}
      <div className="relative flex w-full flex-col p-4 lg:w-[52%] lg:p-6">
        <div className="liquid-glass-strong pointer-events-none absolute inset-4 rounded-3xl lg:inset-6" />

        <div className="relative flex items-center justify-between px-2 py-2 lg:px-4">
          <div className="flex items-center gap-3">
            <Monogram size="text-2xl" />
            <div className="liquid-glass hidden items-center gap-3 rounded-full px-4 py-2 sm:flex">
              <Social href={LINKS.github} label="GitHub">
                <Github className="h-4 w-4" />
              </Social>
              <Social href={LINKS.linkedin} label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Social>
              <Social href={`mailto:${LINKS.email}`} label="Email">
                <Mail className="h-4 w-4" />
              </Social>
            </div>
          </div>
          <a
            href="#projects"
            className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white transition-transform hover:scale-105"
          >
            <Menu className="h-4 w-4" />
            Menu
          </a>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 text-center lg:px-10">
          <div className="liquid-glass mb-8 flex h-20 w-20 items-center justify-center rounded-full">
            <span className="text-2xl font-semibold tracking-tighter text-white">KP</span>
          </div>

          <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <MapPin className="h-3.5 w-3.5" /> Bangkok · Remote · EU overlap
          </p>

          <h1 className="text-5xl tracking-[-0.05em] text-white lg:text-7xl">
            Krittapas <em className="text-white/80">Polmanee</em>
          </h1>
          <p className="mt-5 max-w-md text-base text-white/70 lg:text-lg">
            Full-stack developer with a backend core — shipping production systems
            in <em className="font-serif italic text-white/90">Laravel</em> and{" "}
            <em className="font-serif italic text-white/90">NestJS</em>.
          </p>

          <a
            href="#projects"
            className="liquid-glass-strong group mt-8 flex items-center gap-3 rounded-full px-6 py-3 text-white transition-transform hover:scale-105 active:scale-95"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
              <ArrowRight className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium">Explore my work</span>
          </a>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {["Backend Systems", "Subscriptions & Billing", "Full-Stack Delivery"].map(
              (t) => (
                <span
                  key={t}
                  className="liquid-glass rounded-full px-4 py-1.5 text-xs text-white/80"
                >
                  {t}
                </span>
              )
            )}
          </div>
        </div>

        <div className="relative px-4 pb-4 text-center lg:px-10">
          <p className="text-xs uppercase tracking-widest text-white/50">
            Production experience
          </p>
          <p className="mt-2 text-sm text-white/70">
            Maintaining systems that serve{" "}
            <em className="font-serif italic text-white/90">75,000+ users</em>.
          </p>
        </div>
      </div>

      {/* Right panel — desktop only */}
      <div className="hidden w-[48%] flex-col p-6 lg:flex">
        <div className="flex items-center justify-end">
          <a
            href="#contact"
            className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white transition-transform hover:scale-105"
          >
            <Sparkles className="h-4 w-4" />
            Get in touch
          </a>
        </div>

        <div className="liquid-glass mt-6 w-64 rounded-3xl p-5">
          <p className="text-sm font-medium text-white">Open to opportunities</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            Looking for remote backend or full-stack roles with Europe timezone
            overlap. Available for new projects.
          </p>
        </div>

        <div className="liquid-glass-strong mt-auto rounded-[2.5rem] p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="liquid-glass rounded-3xl p-5">
              <Server className="h-5 w-5 text-white" />
              <p className="mt-3 text-sm font-medium text-white">Backend</p>
              <p className="mt-1 text-xs text-white/60">
                Laravel · NestJS · billing & subscription logic
              </p>
            </div>
            <div className="liquid-glass rounded-3xl p-5">
              <Database className="h-5 w-5 text-white" />
              <p className="mt-3 text-sm font-medium text-white">Data & Infra</p>
              <p className="mt-1 text-xs text-white/60">
                PostgreSQL · PostGIS · Redis · Docker
              </p>
            </div>
          </div>

          <a
            href="https://dev.baantdee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass mt-3 flex items-center gap-4 rounded-3xl p-4 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Server className="h-6 w-6 text-white/80" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">BaanTDee — live</p>
              <p className="text-xs text-white/60">
                Full-stack property platform on Railway
              </p>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white transition-colors hover:text-white/60"
    >
      {children}
    </a>
  );
}

function SectionHeading({
  kicker,
  title,
  emphasis,
}: {
  kicker: string;
  title: string;
  emphasis: string;
}) {
  return (
    <div className="mb-12 text-center">
      <p className="text-xs uppercase tracking-widest text-white/50">{kicker}</p>
      <h2 className="mt-3 text-4xl tracking-[-0.04em] text-white lg:text-5xl">
        {title} <em className="text-white/70">{emphasis}</em>
      </h2>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-24 lg:px-8">
      <SectionHeading kicker="Selected work" title="Things I've" emphasis="built" />

      <div className="grid gap-4 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <article
            key={p.name}
            className={`liquid-glass-strong flex flex-col rounded-3xl p-6 ${
              p.flagship ? "md:col-span-2" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-white">
                  {p.icon}
                </span>
                <div>
                  <h3 className="text-xl text-white">{p.name}</h3>
                  <p className="text-xs text-white/50">{p.tagline}</p>
                </div>
              </div>
              {p.flagship && (
                <span className="liquid-glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-white/70">
                  Flagship
                </span>
              )}
            </div>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">
              {p.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/70"
                >
                  {s}
                </span>
              ))}
            </div>

            {(p.live || p.repo) && (
              <div className="mt-5 flex flex-wrap gap-3">
                {p.live && (
                  <a
                    href={p.live.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white transition-transform hover:scale-105"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {p.live.label}
                  </a>
                )}
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-xs text-white/60 transition-colors hover:text-white"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Source
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 lg:px-8">
      <SectionHeading kicker="Toolbox" title="My" emphasis="stack" />
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(STACK).map(([group, items]) => (
          <div key={group} className="liquid-glass-strong rounded-3xl p-6">
            <h3 className="text-sm uppercase tracking-widest text-white/50">
              {group}
            </h3>
            <ul className="mt-4 space-y-2">
              {items.map((i) => (
                <li key={i} className="text-sm text-white/80">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 lg:px-8">
      <SectionHeading kicker="Background" title="Where I've" emphasis="been" />
      <div className="space-y-4">
        {EXPERIENCE.map((e) => (
          <div key={e.role} className="liquid-glass-strong rounded-3xl p-6">
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
              <h3 className="text-lg text-white">{e.role}</h3>
              <span className="text-xs uppercase tracking-widest text-white/50">
                {e.period}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/70">{e.org}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{e.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center lg:px-8">
      <div className="liquid-glass-strong rounded-[2.5rem] p-10 lg:p-16">
        <p className="text-xs uppercase tracking-widest text-white/50">Contact</p>
        <h2 className="mt-3 text-4xl tracking-[-0.04em] text-white lg:text-5xl">
          Let&apos;s <em className="text-white/70">work together</em>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
          Open to remote backend or full-stack roles with Europe timezone overlap.
        </p>

        <a
          href={`mailto:${LINKS.email}`}
          className="liquid-glass-strong mx-auto mt-8 flex w-fit items-center gap-3 rounded-full px-6 py-3 text-white transition-transform hover:scale-105 active:scale-95"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <Mail className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium">{LINKS.email}</span>
        </a>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Social href={LINKS.github} label="GitHub">
            <Github className="h-5 w-5" />
          </Social>
          <Social href={LINKS.linkedin} label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </Social>
        </div>
      </div>

      <p className="mt-10 text-xs text-white/40">
        © {new Date().getFullYear()} Krittapas Polmanee · Built with Next.js
      </p>
    </section>
  );
}
