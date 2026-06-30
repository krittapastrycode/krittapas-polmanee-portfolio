# Design Rule — Liquid Glass Portfolio Template

The complete design system + reproduction prompt for this portfolio. Hand the **FULL PROMPT** section to any capable AI with a new dataset and you get the same template with different content.

---

## 1. Identity

- **Aesthetic:** Liquid glass-morphism over a full-screen looping video background.
- **Mood:** Dark, minimal, serious. Lets content float; nothing flashy.
- **Stack:** Next.js (App Router) + React + Tailwind CSS v4 + TypeScript. Deployed on Railway.
- **One page**, scroll-driven: two-panel hero → Projects → Stack → Experience → Contact.

---

## 2. Non-negotiable rules

1. **Strict grayscale only.** Every color is HSL `0 0% X%`. No colored accents, ever.
2. **Text hierarchy via white opacity** — `text-white`, `text-white/80`, `/70`, `/60`, `/50`, `/40`. Never a hue.
3. **Borders come only from the glass `::before`** gradient — never `border` utility classes.
4. **Headings `font-weight: 500`.** Serif italic (`<em>`) used *only* inside headings for emphasis.
5. **Animate only `transform` / `opacity` / `scale`.** Interactive elements: `hover:scale-105 active:scale-95 transition-transform`.
6. **Video is `z-0`, all content `z-10`.** Video is `object-cover grayscale` + dark overlay so it reads as abstract texture.

---

## 3. Fonts

| Role | Font | Notes |
|---|---|---|
| Display / Body | **Poppins** (Google) | weights 400, 500, 600; `--font-poppins` |
| Serif accent | **Source Serif 4** (Google) | italic 400 only; `--font-source-serif`; used inside `h1–h3 em/i/.italic` |

Loaded via `next/font/google` as CSS variables, mapped through Tailwind `@theme inline`.

---

## 4. Color / tokens (globals.css)

```css
:root {
  --radius: 1rem;
  --background: 0 0% 0%;   /* black */
  --foreground: 0 0% 100%; /* white */
}
@theme inline {
  --font-display: var(--font-poppins);
  --font-serif: var(--font-source-serif);
}
```

---

## 5. Liquid glass (two tiers) — copy verbatim

```css
@layer components {
  .liquid-glass {
    background: rgba(255,255,255,0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
    position: relative; overflow: hidden;
  }
  .liquid-glass::before {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
      transparent 40%, transparent 60%,
      rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none;
  }
  /* .liquid-glass-strong = same but: backdrop-filter blur(50px);
     box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
     ::before gradient uses 0.5 / 0.2 alpha instead of 0.45 / 0.15 */
}
```

- `.liquid-glass` → light glass for pills, small cards, icon chips.
- `.liquid-glass-strong` → heavy glass for hero overlay, project cards, CTAs, panels.

---

## 6. Layout

### Hero — two-panel split (`min-h-screen`, `flex`)
- **Left panel `w-[52%]`** (full width on mobile). Has a `liquid-glass-strong` overlay at `absolute inset-4 lg:inset-6 rounded-3xl`.
  - Nav row: monogram + inline social pill (left), Resume + Menu buttons (right).
  - Center: round monogram chip, location label, `h1` name with serif-italic surname, one-line subtitle, primary CTA, three glass pills, bottom "production experience" line.
- **Right panel `w-[48%]`, `hidden lg:flex`.**
  - Top row: "Open to opportunities" glass card (left) + "Get in touch" button (right).
  - Bottom (`mt-auto`): `liquid-glass-strong rounded-[2.5rem]` container holding two feature cards + one flagship link card.

### Sections (each `mx-auto max-w-*` + `py-24`)
- **Projects** — `SectionHeading` + responsive 2-col grid. Flagship card spans 2 cols (`md:col-span-2`). Each card: icon chip + name + tagline, optional badge, description, stack pills, live/repo links.
- **Stack** — 3 glass columns grouped by category.
- **Experience** — vertical list of glass cards (role · org · period · detail). Doubles as Education.
- **Contact** — big `liquid-glass-strong rounded-[2.5rem]` panel: heading, email button, social icons, copyright.

---

## 7. Data shape (swap this, keep everything else)

```ts
const LINKS = { github: "", linkedin: "", email: "" };

type Project = {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  live?: { label: string; href: string };
  repo?: string;
  icon: React.ReactNode;     // lucide-react icon
  flagship?: boolean;        // → spans 2 cols (use once, first item)
  badge?: string;            // → pill label e.g. "Flagship" | "Production"
};

const PROJECTS: Project[] = [ /* ... */ ];
const STACK = { Backend: [], Frontend: [], "Data & Infra": [] };
const EXPERIENCE = [{ role, org, period, detail }];
```

Icons: `lucide-react`. Order projects strongest-first; flagship full-width on top.

---

## 8. Deploy notes (Railway)

- `package.json` → `"engines": { "node": ">=20.9.0" }` and `.nvmrc` = `20` (Next 16 needs Node ≥20.9).
- `"start": "next start"` — Next respects Railway's `$PORT` automatically; do **not** hardcode `-p ${PORT}` (npm won't expand it).
- `railway init -n <name>` → `railway up --detach --service <name>` → `railway domain`.
- Commit with GitHub noreply email (`<id>+<user>@users.noreply.github.com`) to avoid email-privacy push rejection.
- Resume PDF: drop in `public/`, link with `download` attribute.

---

## 9. FULL PROMPT (paste this to reproduce with new data)

> Build a single-page personal portfolio in **Next.js (App Router) + React + Tailwind CSS v4 + TypeScript**, using a **liquid glass-morphism aesthetic over a full-screen looping muted video background**. Deploy-ready for Railway.
>
> **Global rules:** Strict grayscale only — every color is HSL `0 0% X%`, no hues anywhere. Text hierarchy comes purely from white opacity (`text-white`, `/80`, `/70`, `/60`, `/50`, `/40`). All borders come from a glass `::before` gradient, never `border` classes. Headings use `font-weight: 500`. A serif italic font is used *only* for `<em>` emphasis inside headings. Animate only `transform`/`opacity`; interactive elements get `hover:scale-105 active:scale-95 transition-transform`.
>
> **Fonts:** Poppins (display/body, weights 400/500/600) and Source Serif 4 (italic 400, heading emphasis only), loaded via `next/font/google` as CSS variables.
>
> **Video background:** full-viewport `<video autoplay loop muted playsinline class="object-cover grayscale">` at `z-0`, with a `bg-black/55` overlay + top/bottom gradient so it reads as abstract texture. All content sits at `z-10`. Use this clip unless told otherwise: `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4`
>
> **Liquid glass — define under `@layer components`:** `.liquid-glass` = `rgba(255,255,255,0.01)` bg, `background-blend-mode: luminosity`, `backdrop-filter: blur(4px)`, `box-shadow: inset 0 1px 1px rgba(255,255,255,0.1)`, no border, `position:relative; overflow:hidden`, plus a `::before` gradient border (`linear-gradient(180deg, rgba(255,255,255,0.45) 0%, .15 20%, transparent 40-60%, .15 80%, .45 100%)`, `padding:1.4px`, masked with `-webkit-mask-composite: xor; mask-composite: exclude`). `.liquid-glass-strong` = same but `blur(50px)`, `box-shadow: 4px 4px 4px rgba(0,0,0,.05), inset 0 1px 1px rgba(255,255,255,.15)`, and `::before` alphas of `.5/.2`. Use `--radius: 1rem`.
>
> **Layout:** A two-panel split hero (`min-h-screen flex`). Left panel `w-[52%]` (full width on mobile) with a `liquid-glass-strong` overlay at `absolute inset-4 lg:inset-6 rounded-3xl`: a nav row (monogram + inline social pill on the left; Resume download + Menu buttons on the right), then a centered hero (round monogram chip, location label, `h1` with the surname in serif italic, a one-line subtitle with two serif-italic keywords, a primary glass CTA that scrolls to projects, three glass keyword pills, and a bottom production-experience line). Right panel `w-[48%]` `hidden lg:flex`: a top row with an "Open to opportunities" glass card beside a "Get in touch" button that scrolls to `#contact`, and a bottom `mt-auto` `liquid-glass-strong rounded-[2.5rem]` container with two feature cards and one flagship link card.
>
> Then these scroll sections, each centered with `py-24` and a `SectionHeading` (kicker + title with one serif-italic word): **Projects** (responsive 2-col grid; the flagship project spans both columns and shows a badge pill; each card has an icon chip, name, tagline, optional badge, description, stack pills, and optional live/repo links); **Stack** (3 glass columns grouped by category); **Experience** (vertical glass cards: role · org · period · detail; also holds education); **Contact** (a large `liquid-glass-strong rounded-[2.5rem]` panel with heading, email button, social icons, and copyright).
>
> **Data:** Drive everything from typed constants — `LINKS {github, linkedin, email}`, `PROJECTS[]` (`name, tagline, description, stack[], live?, repo?, icon (lucide-react), flagship?, badge?`), `STACK {Backend, Frontend, "Data & Infra"}`, `EXPERIENCE[] {role, org, period, detail}`. Icons from `lucide-react`. Order projects strongest-first.
>
> **Deploy:** add `"engines": {"node": ">=20.9.0"}` + `.nvmrc` `20`, keep `"start": "next start"` (reads `$PORT`), add a `railway.json` with NIXPACKS builder. Provide a favicon via `src/app/icon.svg` (black rounded square, white monogram initials).
>
> Then insert THIS data: **[paste name, title, bio, links, projects, stack, experience here]**.

---

## 10. Reference build

Live: https://krittapas-polmanee-portfolio-production.up.railway.app
Repo: https://github.com/krittapastrycode/krittapas-polmanee-portfolio
Files that matter: `src/app/globals.css` (tokens + glass), `src/app/layout.tsx` (fonts + metadata), `src/app/page.tsx` (all sections + data).
