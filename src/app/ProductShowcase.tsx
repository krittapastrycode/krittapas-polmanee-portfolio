"use client";

// Interactive "how they work" carousel — 3 cherry-picked projects (BaanTDee,
// TSEC, HoroAcademy) with real assets/data from the local codebases:
//   - BaanTDee: real Thailand map + region polygons + 77 province polygons,
//     drill: region → province map → opens dev.baantdee.com/search?province=
//   - TSEC: 6-step bilingual application wizard (visual)
//   - HoroAcademy: zodiac wheel + user stats (visual)
// Autoplays every 15s with a glass loading bar; any interaction resets it.

import { useState, useEffect, type ReactNode } from "react";
import { Home, Building2, Landmark, TreePine, Store, Warehouse, Castle } from "lucide-react";
import regionData from "./baantdee-provinces.json";

const AUTOPLAY_MS = 20000;

type RegionId = "northern" | "northeastern" | "central" | "eastern" | "southern";

/* ── BaanTDee real map data ── */

const REGION_AREAS: { id: RegionId; name: string; labelX: number; labelY: number; points: string }[] = [
  {
    id: "northern", name: "North", labelX: 29.94, labelY: 36.37,
    points:
      "33.75,4.93 31.6,5.0 31.25,5.9 28.96,5.9 29.31,7.92 28.4,9.03 24.17,9.17 23.26,12.01 22.29,13.06 20.42,12.78 " +
      "20.21,13.4 18.75,13.82 17.57,13.4 15.9,13.75 12.57,12.5 12.5,14.31 11.94,14.93 10.69,15.14 11.11,16.6 9.86,18.26 " +
      "10.83,20.14 9.44,21.25 9.17,26.6 7.99,26.74 6.88,27.71 5.07,27.29 5.49,29.65 6.88,29.24 7.36,30.63 8.33,31.46 " +
      "8.4,34.93 9.51,37.15 12.22,38.61 12.78,41.6 17.08,45.35 19.31,52.29 20.49,51.6 21.46,52.15 21.04,54.58 18.19,56.18 " +
      "18.26,60.14 21.94,64.65 22.99,67.08 25.42,67.36 25.62,66.6 26.39,66.39 27.57,67.57 28.82,67.85 30.97,66.88 " +
      "30.21,64.93 30.56,64.03 34.24,64.03 34.72,62.71 36.39,63.61 37.92,66.32 39.17,65.69 40.83,62.57 41.88,62.08 " +
      "43.61,62.01 45.49,63.54 47.71,63.26 47.85,61.18 48.89,60.14 48.12,58.47 48.75,57.15 48.19,55.97 48.68,52.29 " +
      "50.9,47.5 53.12,47.99 52.29,47.15 52.08,44.86 50.9,44.86 50.14,43.82 47.15,43.68 46.04,45.9 45.07,45.63 " +
      "44.93,44.38 45.62,41.6 43.82,40.76 43.47,39.51 42.64,39.24 43.06,37.78 43.96,37.5 44.24,36.74 44.03,34.72 " +
      "46.25,31.25 44.79,28.06 47.01,25.83 46.6,23.61 47.92,21.6 47.01,17.22 47.57,15.42 44.1,14.86 42.22,15.97 " +
      "41.25,15.63 39.24,15.83 38.06,12.92 39.51,10.56 39.79,8.33 38.54,7.64 37.5,5.63 36.81,5.83 36.11,7.64 35.28,7.92 34.93,5.76",
  },
  {
    id: "northeastern", name: "Northeast", labelX: 69.86, labelY: 55.14,
    points:
      "43.4,38.13 43.26,39.1 43.96,39.17 43.96,40.28 44.86,40.42 46.11,41.46 45.42,45.14 45.83,45.14 46.94,42.92 " +
      "48.47,43.4 50.21,43.26 50.97,44.31 52.29,44.17 52.78,46.94 53.68,47.22 53.19,48.54 51.46,48.33 51.39,48.75 " +
      "50.69,48.75 50.69,50.0 50.21,50.21 49.03,52.64 48.68,55.83 49.31,56.94 48.61,57.85 48.61,58.54 49.38,59.38 " +
      "49.38,60.14 48.33,61.81 49.31,62.22 49.44,66.74 50.07,69.24 48.96,69.93 48.61,70.9 47.22,71.04 47.43,73.47 " +
      "48.26,73.47 48.96,74.17 49.72,73.75 51.81,74.17 52.85,75.0 54.72,74.44 55.76,74.86 55.76,76.39 57.29,77.36 " +
      "58.54,76.94 59.1,77.57 60.28,77.15 61.39,77.5 66.18,77.22 68.82,75.56 73.96,74.17 78.06,75.28 79.58,74.44 " +
      "82.36,74.24 83.75,74.72 85.28,74.44 86.25,73.68 89.1,73.75 89.58,76.11 90.9,75.9 91.32,74.79 94.86,74.24 " +
      "96.11,69.44 95.97,67.78 95.21,66.81 95.62,64.24 94.79,63.96 94.79,63.33 95.76,62.36 96.32,59.72 95.35,59.1 " +
      "93.96,59.1 93.06,57.15 93.26,55.76 90.56,55.21 89.31,52.57 86.04,50.21 85.69,44.72 86.94,42.64 86.25,39.58 " +
      "82.5,36.6 78.12,30.0 75.76,29.86 73.19,28.82 71.94,28.89 71.39,28.33 69.72,28.54 69.86,29.86 67.99,31.46 " +
      "67.64,33.26 65.14,33.61 63.61,35.49 62.78,35.21 62.29,33.19 61.25,33.54 59.1,33.26 56.46,31.18 55.83,31.11 " +
      "54.44,33.06 52.92,33.19 51.88,35.28 47.01,37.64 46.25,39.1 45.21,39.31 44.44,38.33",
  },
  {
    id: "central", name: "Central", labelX: 36.62, labelY: 78.84,
    points:
      "48.82,62.5 45.9,64.03 41.39,62.71 38.54,67.08 35.35,63.33 34.38,64.65 30.9,64.38 31.6,66.81 28.75,68.33 26.32,66.88 " +
      "22.71,67.43 17.78,60.56 18.12,63.54 13.47,65.42 14.58,70.49 22.36,78.2 25.49,84.65 23.68,89.86 25.28,94.31 27.57,95.77 " +
      "29.51,105.35 24.24,112.99 25.0,113.89 27.78,113.47 27.36,111.6 33.33,100.28 33.61,86.18 40.14,84.31 44.17,85.35 47.15,83.68 " +
      "53.06,88.33 55.83,86.53 59.03,87.36 65.9,78.06 57.43,77.92 54.58,74.93 47.22,73.89 46.67,70.7 49.58,69.17",
  },
  {
    id: "eastern", name: "East", labelX: 53.47, labelY: 91.97,
    points:
      "44.58,85.63 44.31,86.25 44.31,87.15 43.96,87.57 43.96,88.82 43.33,89.24 43.33,89.79 43.96,90.63 43.96,91.11 " +
      "43.47,91.67 43.61,93.61 42.92,94.31 42.92,94.72 43.06,94.86 43.61,95.0 43.89,95.28 44.38,95.28 44.79,95.0 " +
      "45.83,94.72 46.94,94.65 49.17,95.21 49.72,95.21 50.0,94.93 51.25,94.93 51.53,94.65 52.36,94.65 52.99,93.96 " +
      "53.54,93.96 53.96,94.17 55.62,96.04 56.53,95.9 57.08,95.97 57.43,96.32 57.43,96.94 57.78,97.15 58.26,97.78 " +
      "58.68,97.78 58.75,97.36 59.17,97.36 59.44,97.85 60.56,97.78 60.76,97.99 60.76,98.47 59.65,99.17 59.72,99.65 " +
      "60.42,99.65 60.83,100.07 61.67,100.07 62.08,100.63 62.5,100.63 62.57,99.65 63.12,99.65 63.68,100.0 63.96,100.76 " +
      "64.38,100.97 64.79,100.97 64.58,100.07 64.51,96.67 64.1,96.04 63.61,95.83 62.78,95.07 62.36,93.89 61.67,93.26 " +
      "61.32,92.29 61.39,91.04 60.62,89.17 60.42,87.5 59.65,87.43 59.17,87.92 58.75,87.92 58.06,87.57 57.57,87.57 " +
      "57.57,87.78 57.22,88.13 56.6,88.13 56.18,87.78 56.04,87.43 55.62,87.43 55.21,87.71 54.93,88.19 54.31,88.26 " +
      "53.47,88.82 53.06,88.82 52.36,88.33 52.22,87.71 51.04,87.15 50.76,86.67 50.69,86.18 49.93,86.18 49.31,85.49 " +
      "48.68,85.49 48.06,84.65 47.08,84.17 46.53,84.17 45.76,84.51 45.56,85.07 45.28,85.35 44.86,85.35",
  },
  {
    id: "southern", name: "South", labelX: 30.77, labelY: 147.4,
    points:
      "23.61,113.68 19.65,117.57 16.88,130.7 15.0,132.36 15.21,137.57 13.75,137.64 13.54,145.07 15.28,145.97 15.42,144.31 17.64,143.4 " +
      "19.03,147.36 22.92,148.47 22.15,150.9 24.79,151.74 26.11,154.79 28.61,156.04 28.19,157.57 30.63,158.2 29.24,161.39 34.86,165.49 " +
      "35.83,163.27 38.19,165.63 42.71,166.18 43.12,168.47 46.6,168.47 46.39,172.85 44.93,174.03 47.01,175.77 51.11,172.36 52.92,174.1 " +
      "55.28,173.27 57.43,168.96 50.83,161.74 44.17,161.81 35.56,155.35 34.72,150.97 37.57,153.2 35.76,143.4 32.64,142.22 31.6,133.61 " +
      "27.92,133.47 26.6,134.86 24.17,133.96 23.12,124.03 24.44,122.57 23.19,121.04 27.64,114.72",
  },
];

type RegionData = { imageFile: string; provinces: { id: string; name: string; en: string; points: string; labelX: number; labelY: number }[] };
const REGION_DATA = regionData as Record<RegionId, RegionData>;

const REGION_NAMES: Record<RegionId, string> = {
  northern: "North",
  northeastern: "Northeast",
  central: "Central",
  eastern: "East",
  southern: "South",
};

const SEARCH_BASE = "https://dev.baantdee.com/search";

/* ── real BaanTDee category icons (category-icons.tsx) ── */
const PROPERTY_TYPES = [
  { key: "house", label: "House", icon: Home },
  { key: "condo", label: "Condo", icon: Building2 },
  { key: "townhouse", label: "Townhouse", icon: Landmark },
  { key: "land", label: "Land", icon: TreePine },
  { key: "commercial", label: "Commercial", icon: Store },
  { key: "warehouse", label: "Warehouse", icon: Warehouse },
  { key: "resort", label: "Resort / Hotel", icon: Castle },
] as const;

const MAP_FILTER = { filter: "grayscale(1) invert(1) brightness(1.2) contrast(1.05) opacity(0.85)" };
const REGION_MAP_FILTER = { filter: "grayscale(1) invert(1) brightness(1.7) contrast(1.1)" };

function openSearch(params: string) {
  window.open(`${SEARCH_BASE}?${params}`, "_blank", "noopener,noreferrer");
}

/* ── BaanTDee: real map drill (region → province map → real search) ── */

function MapDrill() {
  const [region, setRegion] = useState<RegionId | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const data = region ? REGION_DATA[region] : null;

  return (
    <div className="flex h-full w-full gap-2">
      <div className="relative h-full min-h-0 flex-1 select-none overflow-hidden rounded-xl bg-black/20">
        {!region ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/baantdee-assets/thailand-map.png"
              alt="Thailand regions"
              className="pointer-events-none h-full w-full object-contain"
              style={MAP_FILTER}
              draggable={false}
            />
            <svg viewBox="0 0 100 177.778" className="absolute inset-0 h-full w-full">
              {REGION_AREAS.map((r) => {
                const hot = hovered === r.id;
                return (
                  <polygon
                    key={r.id}
                    points={r.points}
                    fill={hot ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.03)"}
                    stroke={hot ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)"}
                    strokeWidth={0.3}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHovered(r.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setRegion(r.id)}
                  />
                );
              })}
              {REGION_AREAS.map((r) => (
                <text
                  key={`l-${r.id}`}
                  x={r.labelX}
                  y={r.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={hovered === r.id ? 4.5 : 3.8}
                  fontWeight={700}
                  fill={hovered === r.id ? "#ffffff" : "rgba(255,255,255,0.6)"}
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth={hovered === r.id ? 0.5 : 0.35}
                  paintOrder="stroke"
                  style={{ pointerEvents: "none" }}
                >
                  {r.name}
                </text>
              ))}
            </svg>
          </>
        ) : data ? (
          <>
            <button
              onClick={() => setRegion(null)}
              className="absolute left-1.5 top-1.5 z-10 rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white backdrop-blur transition-colors hover:bg-white/30"
            >
              ← regions
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/baantdee-assets/${data.imageFile.replace(/^\//, "")}`}
              alt={REGION_NAMES[region]}
              className="pointer-events-none h-full w-full object-contain"
              style={REGION_MAP_FILTER}
              draggable={false}
            />
            <svg viewBox="0 0 100 177.778" className="absolute inset-0 h-full w-full">
              {data.provinces.map((p) => (
                <polygon
                  key={p.id}
                  points={p.points}
                  fill={hovered === p.id ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.05)"}
                  stroke={hovered === p.id ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)"}
                  strokeWidth={0.3}
                  className="cursor-pointer transition-all duration-100"
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => openSearch(`province=${encodeURIComponent(p.name)}`)}
                />
              ))}
              {data.provinces.map((p) => (
                <text
                  key={`l-${p.id}`}
                  x={p.labelX}
                  y={p.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={hovered === p.id ? 5 : 3.8}
                  fontWeight={700}
                  fill={hovered === p.id ? "#ffffff" : "rgba(255,255,255,0.75)"}
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth={hovered === p.id ? 0.6 : 0.4}
                  paintOrder="stroke"
                  style={{ pointerEvents: "none" }}
                >
                  {p.en}
                </text>
              ))}
            </svg>
          </>
        ) : null}
      </div>

      <div className="flex w-28 flex-col overflow-hidden rounded-xl bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-2 py-1">
          <span className="text-[9px] uppercase tracking-wider text-white/50">
            {region ? REGION_NAMES[region] : "Regions"}
          </span>
          {region && (
            <button onClick={() => setRegion(null)} className="text-[10px] text-white/60 hover:text-white" aria-label="back to regions">
              ←
            </button>
          )}
        </div>
        <div className="flex-1 space-y-0.5 overflow-y-auto p-1.5">
          {data
            ? data.provinces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openSearch(`province=${encodeURIComponent(p.name)}`)}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`block w-full truncate rounded px-1.5 py-0.5 text-left text-[10px] transition-colors ${
                    hovered === p.id ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/15 hover:text-white"
                  }`}
                  title={`open ${p.en} on dev.baantdee.com`}
                >
                  {p.en}
                </button>
              ))
            : REGION_AREAS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRegion(r.id)}
                  onMouseEnter={() => setHovered(r.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`block w-full rounded px-1.5 py-0.5 text-left text-[10px] transition-colors ${
                    hovered === r.id ? "bg-white/90 text-black" : "text-white/70 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {r.name}
                </button>
              ))}
        </div>
        <p className="border-t border-white/10 px-2 py-1 text-[8px] text-white/35">
          {region ? "click province → opens search" : "click region → province map"}
        </p>
      </div>
    </div>
  );
}

/* ── BaanTDee: real category icons, click = glow ── */

function PropertyTypes({ selected, onSelect, size = "lg" }: { selected: number; onSelect: (i: number) => void; size?: "sm" | "lg" }) {
  const iconCls = size === "lg" ? "h-16 w-16 max-w-full" : "h-6 w-6 max-w-full";
  const labelCls = size === "lg" ? "text-[10px]" : "text-[9px]";
  return (
    <div className="flex h-full w-full items-center justify-between gap-1">
      {PROPERTY_TYPES.map((t, i) => {
        const Icon = t.icon;
        const hot = i === selected;
        return (
          <button key={t.key} onClick={() => onSelect(i)} className="group flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <Icon
              className={`${iconCls} transition-all ${
                hot ? "text-white" : "text-white/40 group-hover:text-white/80"
              }`}
              strokeWidth={1.5}
              style={hot ? { filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))" } : undefined}
            />
            <span
              className={`text-center leading-tight ${labelCls} ${
                hot ? "text-white" : "text-white/50 group-hover:text-white/80"
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── BaanTDee: real plan catalog (plans.ts) ── */
const PLANS = [
  { name: "Standard", features: ["12 listings", "10 photos / listing"], monthly: 199, annual: 2200 },
  { name: "Pro", badge: "recommended", features: ["30 listings", "15 photos / listing"], monthly: 499, annual: 5400 },
  { name: "Agency", features: ["200 listings", "20 photos / listing", "5-person team"], monthly: 1299, annual: 14000 },
];

function ListingCard() {
  return (
    <div className="flex h-full w-full gap-3">
      <div className="relative flex-1 overflow-hidden rounded-xl bg-black/20">
        {/* 2-story glass house, symmetric, no glow */}
        <svg viewBox="0 0 200 140" className="h-full w-full" role="img" aria-label="House listing">
          <line x1="24" y1="124" x2="176" y2="124" stroke="rgba(255,255,255,0.1)" />
          <rect x="50" y="48" width="100" height="74" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.1" />
          <line x1="50" y1="86" x2="150" y2="86" stroke="rgba(255,255,255,0.12)" />
          <path d="M42 48 L100 18 L158 48" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" strokeLinejoin="round" />
          <rect x="91" y="94" width="18" height="28" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <circle cx="104" cy="108" r="1.4" fill="rgba(255,255,255,0.6)" />
          {[
            [60, 94], [122, 94], [60, 58], [122, 58],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="18" height="15" rx="1.5" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
              <line x1={x + 9} y1={y} x2={x + 9} y2={y + 15} stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
              <line x1={x} y1={y + 7.5} x2={x + 18} y2={y + 7.5} stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
            </g>
          ))}
        </svg>
        <span className="absolute left-2 top-2 bg-white px-2 py-0.5 text-[10px] font-semibold text-black">RENT</span>
      </div>
      <div className="flex w-36 flex-col justify-center gap-1.5">
        <p className="text-sm font-semibold leading-tight text-white">Modern home, prime location, special price</p>
        <p className="flex items-center gap-1 text-[11px] text-white/50">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
          Nakhon Ratchasima · Thailand
        </p>
        <p className="text-lg font-bold text-white">฿ 18,791,000</p>
        <div className="mt-1 space-y-1">
          {[
            ["Floor area", "231.30 m²"],
            ["Land area", "323.80 sq.wah"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-2 border-t border-white/10 pt-1 first:border-t-0 first:pt-0">
              <span className="text-[10px] text-white/40">{k}</span>
              <span className="text-[11px] font-medium text-white/85">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Subscriptions() {
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full">
      {PLANS.map((p, i) => {
        const x = 12 + i * 116;
        const hot = !!p.badge;
        return (
          <g key={p.name}>
            <rect x={x} y="12" width="104" height="152" rx="8" fill={hot ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)"} stroke={hot ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.12)"} strokeWidth={hot ? 1.5 : 1} />
            {hot && <text x={x + 52} y="26" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.75)">★ {p.badge}</text>}
            <text x={x + 52} y={hot ? 42 : 36} textAnchor="middle" fontSize="10" fontWeight={700} fill="rgba(255,255,255,0.9)">{p.name}</text>
            <text x={x + 52} y={hot ? 58 : 52} textAnchor="middle" fontSize="13" fontWeight="700" fill={hot ? "#fff" : "rgba(255,255,255,0.6)"}>
              ฿{p.monthly}
              <tspan fontSize="7" fill="rgba(255,255,255,0.4)"> /mo</tspan>
            </text>
            <line x1={x + 14} y1={hot ? 68 : 62} x2={x + 90} y2={hot ? 68 : 62} stroke="rgba(255,255,255,0.12)" />
            {p.features.map((f, j) => (
              <g key={f}>
                <circle cx={x + 17} cy={80 + j * 15} r="2.5" fill={hot ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)"} />
                <text x={x + 27} y={84 + j * 15} fontSize="8" fill="rgba(255,255,255,0.6)">{f}</text>
              </g>
            ))}
            <rect x={x + 16} y="142" width="72" height="14" rx="7" fill={hot ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.1)"} />
            <text x={x + 52} y="152" textAnchor="middle" fontSize="8" fontWeight="600" fill={hot ? "#0e1116" : "rgba(255,255,255,0.5)"}>upgrade</text>
          </g>
        );
      })}
      <text x="180" y="174" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)">
        real plans · Omise billing · annual ฿2,200 / ฿5,400 / ฿14,000
      </text>
    </svg>
  );
}

/* ── BaanTDee highlight: 4-stage stepper (map search / types / listing / plans) ── */
const BAANTDEE_STAGES = [
  { key: "map", label: "Map search", title: "Search from the map", caption: "region → province map → search, like the real site" },
  { key: "types", label: "Types", title: "7 property types", caption: "same icons as the real site · click → real search" },
  { key: "listing", label: "Listing", title: "A real listing", caption: "rent/sale · seller verified · in-app chat" },
  { key: "plans", label: "Plans", title: "Subscription plans", caption: "Standard ฿199 · Pro ฿499 · Agency ฿1,299 /mo" },
];

function BaantdeeVisual({ stage, onStage }: { stage: number; onStage: (i: number) => void }) {
  const [selectedType, setSelectedType] = useState(0);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-wrap gap-1.5">
        {BAANTDEE_STAGES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => onStage(i)}
            className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              i === stage ? "bg-white/90 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {String(i + 1).padStart(2, "0")} {s.label}
          </button>
        ))}
      </div>
      <div className="mt-2 min-h-0 flex-1">
        {stage === 0 && <MapDrill />}
        {stage === 1 && <PropertyTypes selected={selectedType} onSelect={setSelectedType} />}
        {stage === 2 && <ListingCard />}
        {stage === 3 && <Subscriptions />}
      </div>
    </div>
  );
}

/* ── TSEC: real landing hero ── */

function TsecHeroVisual() {
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full">
      {/* nav band */}
      <rect x="0" y="0" width="360" height="22" fill="rgba(255,255,255,0.08)" />
      <circle cx="14" cy="11" r="5" fill="rgba(255,255,255,0.5)" />
      <text x="24" y="14.5" fontSize="7" fontWeight={700} fill="rgba(255,255,255,0.9)">TSEC</text>
      {["Program", "About", "Timeline"].map((l, i) => (
        <text key={l} x={150 + i * 48} y="14" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.55)">
          {l}
        </text>
      ))}
      <rect x="300" y="5" width="50" height="12" rx="6" fill="rgba(255,255,255,0.9)" />
      <text x="325" y="13.5" textAnchor="middle" fontSize="6" fontWeight={600} fill="#0e1116">Apply now</text>
      {/* hero */}
      <text x="180" y="46" textAnchor="middle" fontSize="11" fontWeight={700} fill="rgba(255,255,255,0.95)">
        Your first step to a university in China
      </text>
      <text x="180" y="60" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.5)">
        ทุนการศึกษาไทยไปจีน · bilingual TH/EN
      </text>
      <rect x="116" y="70" width="52" height="16" rx="8" fill="rgba(255,255,255,0.9)" />
      <text x="142" y="81" textAnchor="middle" fontSize="6.5" fontWeight={600} fill="#0e1116">Apply now</text>
      <rect x="176" y="70" width="68" height="16" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" />
      <text x="210" y="81" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.8)">Learn more</text>
      {/* highlights */}
      {[
        ["Full Scholarship", "100% tuition"],
        ["Top Universities", "partner unis"],
        ["Transparent", "clear criteria"],
        ["Student Support", "end-to-end"],
      ].map(([t, s], i) => (
        <g key={t}>
          <rect x={12 + i * 87} y="96" width="80" height="26" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" />
          <text x={52 + i * 87} y="106" textAnchor="middle" fontSize="5.5" fontWeight={600} fill="rgba(255,255,255,0.8)">
            {t}
          </text>
          <text x={52 + i * 87} y="116" textAnchor="middle" fontSize="4.5" fill="rgba(255,255,255,0.4)">
            {s}
          </text>
        </g>
      ))}
      {/* timeline */}
      <rect x="12" y="130" width="336" height="22" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      {["Apply", "Screening", "Interview", "Result", "Depart"].map((l, i) => (
        <g key={l}>
          <circle cx={44 + i * 68} cy="141" r="3" fill={i === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)"} />
          <text x={44 + i * 68} y="149" textAnchor="middle" fontSize="4.5" fill="rgba(255,255,255,0.55)">
            {l}
          </text>
        </g>
      ))}
      {/* footer */}
      <text x="180" y="170" textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.3)">
        tsec.info · scholarships for Thai students in China
      </text>
    </svg>
  );
}

/* ── TSEC: 6-step registration wizard (real steps) ── */

const TSEC_STEPS_EN = ["Personal", "Education", "Activities", "Documents", "Consent", "Review"];
const TSEC_STEPS_TH = ["ข้อมูลส่วนตัว", "การศึกษา", "กิจกรรม", "เอกสาร", "ยินยอม", "ตรวจสอบ"];

function TsecVisual() {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<"en" | "th">("en");
  const steps = lang === "en" ? TSEC_STEPS_EN : TSEC_STEPS_TH;
  const segW = (320 - 5 * 4) / 6;
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full">
      {/* progress segments */}
      {steps.map((s, i) => (
        <rect
          key={s}
          x={20 + i * (segW + 4)}
          y="28"
          width={segW}
          height="14"
          rx="3"
          fill={i <= step ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)"}
        />
      ))}
      {/* step label */}
      <text x="20" y="66" fontSize="13" fontWeight={600} fill="rgba(255,255,255,0.92)">
        {lang === "en" ? `Step ${step + 1}/6 · ${steps[step]}` : `ขั้นตอน ${step + 1}/6 · ${steps[step]}`}
      </text>
      <text x="20" y="80" fontSize="8" fill="rgba(255,255,255,0.45)">
        {lang === "en" ? "application wizard · autosave" : "ระบบสมัคร · บันทึกอัตโนมัติ"}
      </text>
      {/* form fields mock */}
      {["Full name · ชื่อ-นามสกุล", "Date of birth · วันเกิด", "Phone · เบอร์โทร"].map((f, i) => (
        <g key={f}>
          <text x="20" y={98 + i * 18} fontSize="5.5" fill="rgba(255,255,255,0.45)">{f}</text>
          <rect x="120" y={92 + i * 18} width="160" height="10" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" />
          <rect x="124" y={95 + i * 18} width={i === 0 ? 90 : 60} height="4" rx="2" fill="rgba(255,255,255,0.3)" />
        </g>
      ))}
      {/* lang toggle — above the step bar */}
      {(["en", "th"] as const).map((l, i) => (
        <g key={l} className="cursor-pointer" onClick={() => setLang(l)}>
          <rect x={252 + i * 50} y="6" width="42" height="16" rx="8" fill={lang === l ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)"} />
          <text x={273 + i * 50} y="17.5" textAnchor="middle" fontSize="8" fontWeight={700} fill={lang === l ? "#0e1116" : "rgba(255,255,255,0.6)"}>
            {l.toUpperCase()}
          </text>
        </g>
      ))}
      {/* buttons */}
      <rect x="20" y="152" width="52" height="20" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
      <text x="46" y="165.5" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">← Back</text>
      <g className="cursor-pointer" onClick={() => setStep((step + 1) % 6)}>
        <rect x="282" y="152" width="58" height="20" rx="10" fill="rgba(255,255,255,0.9)" />
        <text x="311" y="165.5" textAnchor="middle" fontSize="7" fontWeight={700} fill="#0e1116">
          {step === 5 ? "Submit" : "Next →"}
        </text>
      </g>
      {/* autosave — centered with the button bar */}
      <circle cx="96" cy="160" r="3" fill="rgba(255,255,255,0.5)" />
      <text x="104" y="163.5" fontSize="6" fill="rgba(255,255,255,0.45)">
        {lang === "en" ? "saved · autosave" : "บันทึกแล้ว"}
      </text>
    </svg>
  );
}

/* ── TSEC: admin console (internal tools) ── */

function TsecAdminVisual() {
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full">
      {/* sidebar */}
      <rect x="0" y="0" width="70" height="180" fill="rgba(255,255,255,0.05)" />
      <rect x="8" y="8" width="54" height="12" rx="4" fill="rgba(255,255,255,0.2)" />
      <text x="35" y="16.5" textAnchor="middle" fontSize="5.5" fontWeight={700} fill="rgba(255,255,255,0.9)">TSEC Admin</text>
      {["Dashboard", "Content", "Events", "Students", "Export", "System"].map((l, i) => (
        <g key={l}>
          <rect x="6" y={26 + i * 14} width="58" height="11" rx="3" fill={i === 3 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.06)"} />
          <text x="12" y={34 + i * 14} fontSize="5" fill={i === 3 ? "#ffffff" : "rgba(255,255,255,0.55)"}>
            {l}
          </text>
        </g>
      ))}
      {/* header */}
      <rect x="70" y="0" width="290" height="24" fill="rgba(255,255,255,0.03)" />
      <text x="80" y="15" fontSize="7" fontWeight={700} fill="rgba(255,255,255,0.9)">Applications · ใบสมัคร</text>
      <circle cx="338" cy="12" r="6" fill="rgba(255,255,255,0.2)" />
      {/* stats */}
      {[
        ["Total", "248"],
        ["Reviewing", "36"],
        ["Approved", "142"],
        ["Rejected", "70"],
      ].map(([l, v], i) => (
        <g key={l}>
          <rect x={80 + i * 70} y="30" width="62" height="30" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" />
          <text x={88 + i * 70} y="41" fontSize="5" fill="rgba(255,255,255,0.5)">{l}</text>
          <text x={88 + i * 70} y="54" fontSize="10" fontWeight={700} fill="rgba(255,255,255,0.92)">{v}</text>
        </g>
      ))}
      {/* applications table */}
      <rect x="80" y="68" width="272" height="104" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      {["Applicant", "Program", "Status"].map((h, i) => (
        <text key={h} x={92 + i * 88} y="80" fontSize="5.5" fill="rgba(255,255,255,0.4)">{h}</text>
      ))}
      {[
        ["Anchalee S.", "Computer Science", "reviewing"],
        ["Nattapong K.", "Medicine", "approved"],
        ["Pimchanok W.", "Business Admin", "submitted"],
        ["Sorasak T.", "Engineering", "approved"],
      ].map((row, i) => (
        <g key={i}>
          <line x1="92" y1={88 + i * 19} x2="340" y2={88 + i * 19} stroke="rgba(255,255,255,0.07)" />
          <text x="92" y={96 + i * 19} fontSize="6" fill="rgba(255,255,255,0.8)">{row[0]}</text>
          <text x="180" y={96 + i * 19} fontSize="6" fill="rgba(255,255,255,0.6)">{row[1]}</text>
          <rect
            x="268"
            y={89 + i * 19}
            width="62"
            height="11"
            rx="5"
            fill={row[2] === "approved" ? "rgba(255,255,255,0.3)" : row[2] === "reviewing" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}
          />
          <text x="299" y={97 + i * 19} textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.85)">{row[2]}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── TSEC highlight: 3 tabs (hero / register / internal tools) ── */

function TsecContainer({ stage, onStage, labels }: { stage: number; onStage: (i: number) => void; labels: string[] }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-wrap gap-1.5">
        {labels.map((l, i) => (
          <button
            key={l}
            onClick={() => onStage(i)}
            className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              i === stage ? "bg-white/90 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {String(i + 1).padStart(2, "0")} {l}
          </button>
        ))}
      </div>
      <div className="mt-2 min-h-0 flex-1">
        {stage === 0 ? <TsecHeroVisual /> : stage === 1 ? <TsecVisual /> : <TsecAdminVisual />}
      </div>
    </div>
  );
}

/* ── HoroAcademy: real course catalog — English main + TH secondary ── */

const HORO_COURSES = [
  {
    cat: "Feng Shui · ฮวงจุ้ย",
    title: "Feng Shui site selection — leap to wealth",
    titleTh: "ฮวงจุ้ยชัยภูมิ เลือกทำเลรวย",
    dur: "20-21 hrs",
    students: 350,
    price: "฿15,900",
  },
  {
    cat: "Chinese astrology · ดวงจีน",
    title: "BaZi basics — unlock your life",
    titleTh: "คอร์สดวงจีน พื้นฐาน (ขั้น 1)",
    dur: "17-18 hrs",
    students: 681,
    price: "฿8,900",
  },
  {
    cat: "Thai numerology · เลขศาสตร์",
    title: "Numerology & taksa prediction",
    titleTh: "คอร์สเลขศาสตร์ และทักษาพยากรณ์",
    dur: "25-26 hrs",
    students: 373,
    price: "฿8,900",
  },
];

function HoroVisual() {
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full">
      {HORO_COURSES.map((c, i) => {
        const x = 10 + i * 117;
        return (
          <g key={c.title}>
            {/* course card */}
            <rect x={x} y="6" width="107" height="150" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
            {/* thumbnail */}
            <rect x={x + 6} y="12" width="95" height="44" rx="5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" />
            <text x={x + 53} y="38" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.35)">✦</text>
            {/* category */}
            <text x={x + 10} y="66" fontSize="6.5" fill="rgba(255,255,255,0.4)">{c.cat}</text>
            {/* title EN */}
            <text x={x + 10} y="78" fontSize="7" fontWeight={600} fill="rgba(255,255,255,0.9)">
              {c.title.slice(0, 26)}
            </text>
            <text x={x + 10} y="87" fontSize="7" fontWeight={600} fill="rgba(255,255,255,0.9)">
              {c.title.slice(26, 52)}
            </text>
            {/* title TH small */}
            <text x={x + 10} y="97" fontSize="5.5" fill="rgba(255,255,255,0.45)">
              {c.titleTh.slice(0, 22)}
            </text>
            {/* students + duration */}
            <text x={x + 10} y="115" fontSize="6.5" fill="rgba(255,255,255,0.55)">👥 {c.students} · {c.dur}</text>
            {/* price */}
            <text x={x + 10} y="140" fontSize="11" fontWeight={700} fill="rgba(255,255,255,0.95)">{c.price}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── HoroAcademy: Filament admin console (internal tools) ── */

function HoroAdminVisual() {
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full">
      {/* sidebar */}
      <rect x="0" y="0" width="64" height="180" fill="rgba(255,255,255,0.05)" />
      <rect x="10" y="10" width="44" height="12" rx="4" fill="rgba(255,255,255,0.25)" />
      {["Dashboard", "Courses", "Users", "Orders", "Settings"].map((m, i) => (
        <g key={m}>
          <rect x="8" y={30 + i * 16} width="48" height="11" rx="3" fill={i === 1 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"} />
          <text x="14" y={38.5 + i * 16} fontSize="6" fill={i === 1 ? "#ffffff" : "rgba(255,255,255,0.45)"}>{m}</text>
        </g>
      ))}
      {/* top bar */}
      <rect x="64" y="0" width="296" height="26" fill="rgba(255,255,255,0.03)" />
      <rect x="240" y="6" width="60" height="14" rx="7" fill="rgba(255,255,255,0.1)" />
      <circle cx="312" cy="13" r="6" fill="rgba(255,255,255,0.25)" />
      {/* stat cards */}
      {[
        ["Courses", "48", 78],
        ["Registered users", "75,000+", 146],
        ["Revenue", "฿2.1M", 214],
      ].map(([label, val, x]) => (
        <g key={label as string}>
          <rect x={x} y="34" width="60" height="40" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" />
          <text x={x + 8} y="48" fontSize="6" fill="rgba(255,255,255,0.45)">{label}</text>
          <text x={x + 8} y="64" fontSize="12" fontWeight={700} fill="rgba(255,255,255,0.92)">{val}</text>
        </g>
      ))}
      {/* table */}
      <rect x="78" y="82" width="274" height="90" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      {["Course", "Students", "Price", "Status"].map((h, i) => (
        <text key={h} x={90 + i * 66} y="96" fontSize="6" fill="rgba(255,255,255,0.4)">{h}</text>
      ))}
      {[
        ["Feng Shui site selection", "681", "฿15,900", "active"],
        ["BaZi basics (Level 1)", "350", "฿8,900", "active"],
        ["Numerology & taksa", "373", "฿8,900", "draft"],
      ].map((row, i) => (
        <g key={i}>
          <line x1="90" y1={104 + i * 18} x2="340" y2={104 + i * 18} stroke="rgba(255,255,255,0.07)" />
          <text x="90" y={112 + i * 18} fontSize="6.5" fill="rgba(255,255,255,0.8)">{row[0]}</text>
          <text x="156" y={112 + i * 18} fontSize="6.5" fill="rgba(255,255,255,0.6)">{row[1]}</text>
          <text x="222" y={112 + i * 18} fontSize="6.5" fill="rgba(255,255,255,0.6)">{row[2]}</text>
          <rect x="288" y={105 + i * 18} width="44" height="10" rx="5" fill={row[3] === "active" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"} />
          <text x="310" y={112.5 + i * 18} textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.85)">{row[3]}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Military Task Manager: mission checklist (tall) + calendar (wide), 35:65 ── */

const MIL_TASKS = [
  { t: "Recon patrol route", r: "commander" },
  { t: "Approve leave request", r: "admin" },
  { t: "Submit mission report", r: "user" },
  { t: "Sync calendar", r: "system" },
];

// date → task index (shared with the calendar)
const MIL_CAL_MARKED: Record<number, number> = { 3: 0, 8: 1, 12: 2, 19: 3 };

function MilitaryChecklistVisual({ done, onToggle }: { done: Set<number>; onToggle: (i: number) => void }) {
  return (
    <svg viewBox="0 0 150 180" className="h-full w-full">
      {MIL_TASKS.map((x, i) => {
        const checked = done.has(i);
        return (
          <g key={x.t} className="cursor-pointer" onClick={() => onToggle(i)}>
            <rect x="8" y={8 + i * 40} width="134" height="34" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
            <rect x="15" y={17 + i * 40} width="14" height="14" rx="3" fill={checked ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.08)"} stroke="rgba(255,255,255,0.3)" />
            {checked && <path d={`M19 ${23 + i * 40} l3 3 l5 -6`} stroke="#0e1116" strokeWidth="1.5" fill="none" />}
            <text
              x="36"
              y={22 + i * 40}
              fontSize="6"
              fontWeight={600}
              fill={checked ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)"}
              textDecoration={checked ? "line-through" : "none"}
            >
              {x.t}
            </text>
            <rect x="88" y={25 + i * 40} width="46" height="10" rx="5" fill="rgba(255,255,255,0.1)" />
            <text x="111" y={32.5 + i * 40} textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.65)">{x.r}</text>
          </g>
        );
      })}
      <text x="75" y="172" textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.3)">role-gated tasks</text>
    </svg>
  );
}

function MilitaryCalendarVisual({ done }: { done: Set<number> }) {
  const [hover, setHover] = useState<number | null>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const offset = 1; // July 2025 starts on Tuesday
  return (
    <svg viewBox="0 0 200 180" className="h-full w-full">
      <text x="100" y="14" textAnchor="middle" fontSize="8" fontWeight={700} fill="rgba(255,255,255,0.9)">
        July 2025
      </text>
      {days.map((d, i) => (
        <text key={d} x={16 + i * 24} y="26" textAnchor="middle" fontSize="4.5" fill="rgba(255,255,255,0.4)">
          {d}
        </text>
      ))}
      {Array.from({ length: 31 }).map((_, idx) => {
        const day = idx + 1;
        const col = (idx + offset) % 7;
        const row = Math.floor((idx + offset) / 7);
        const x = 16 + col * 24;
        const y = 34 + row * 20;
        const taskIdx = MIL_CAL_MARKED[day];
        const hasTask = taskIdx !== undefined;
        const isDone = hasTask && done.has(taskIdx);
        const isHover = hover === day;
        return (
          <g
            key={day}
            onMouseEnter={() => hasTask && setHover(day)}
            onMouseLeave={() => setHover(null)}
          >
            {hasTask && (
              <rect
                x={x - 8}
                y={y - 8}
                width="16"
                height="16"
                rx="4"
                fill={isDone ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)"}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={isHover ? 1 : 0.5}
              />
            )}
            <text x={x} y={y + 3} textAnchor="middle" fontSize="5.5" fill={hasTask ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)"}>
              {day}
            </text>
            {hasTask && <circle cx={x} cy={y + 8} r="1.5" fill={isDone ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)"} />}
            {/* small check top-right when the linked task is done */}
            {isDone && (
              <text x={x + 7} y={y - 6} textAnchor="middle" fontSize="5" fontWeight={700} fill="rgba(255,255,255,0.95)">
                ✓
              </text>
            )}
            {/* hover tooltip with the task name */}
            {isHover && (
              <g pointerEvents="none">
                <rect
                  x={Math.min(Math.max(x - 34, 2), 200 - 76)}
                  y={y - 24}
                  width="68"
                  height="12"
                  rx="4"
                  fill="rgba(255,255,255,0.9)"
                />
                <text
                  x={Math.min(Math.max(x - 34, 2), 200 - 76) + 34}
                  y={y - 15.5}
                  textAnchor="middle"
                  fontSize="5.5"
                  fontWeight={600}
                  fill="#0e1116"
                >
                  {MIL_TASKS[taskIdx].t}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Baby Reveal: simple balloon + string ── */

function BabyRevealVisual() {
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full">
      {/* soft glow */}
      <ellipse cx="180" cy="76" rx="72" ry="72" fill="rgba(255,255,255,0.05)" />
      {/* balloon body */}
      <ellipse cx="180" cy="76" rx="42" ry="54" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      {/* highlight glare */}
      <ellipse cx="163" cy="55" rx="12" ry="20" fill="rgba(255,255,255,0.35)" transform="rotate(-20 163 55)" />
      {/* knot */}
      <path d="M172 128 l8 10 8 -10 z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      {/* string */}
      <path d="M180 138 q-10 18 4 30" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="1.5" />
      <text x="180" y="174" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.35)">
        Baby Reveal
      </text>
    </svg>
  );
}

/* ── DomEmerge: mobile home (6 alert buttons) ── */

const DOM_BUTTONS = ["Intruder", "Fire", "Wild Animal", "Injury", "Equipment Issues", "Others"];
const DOM_ICONS = ["🔓", "🔥", "🐾", "🤕", "🔧", "⋯"];

function DomHomeVisual() {
  return (
    <svg viewBox="0 0 160 180" className="h-full w-full">
      {/* phone frame */}
      <rect x="5" y="2" width="150" height="170" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" />
      <text x="80" y="20" textAnchor="middle" fontSize="9" fontWeight={700} fill="rgba(255,255,255,0.9)">
        DomEmerge
      </text>
      <text x="80" y="30" textAnchor="middle" fontSize="4.5" fill="rgba(255,255,255,0.45)">
        Protect Your Room and Yourselves
      </text>
      {/* 6 alert buttons, 2×3 */}
      {DOM_BUTTONS.map((b, i) => {
        const x = 12 + (i % 2) * 70;
        const y = 38 + Math.floor(i / 2) * 38;
        return (
          <g key={b} className="cursor-pointer">
            <rect x={x} y={y} width="62" height="30" rx="2" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)" />
            <text x={x + 31} y={y + 12} textAnchor="middle" fontSize="6">{DOM_ICONS[i]}</text>
            <text x={x + 31} y={y + 23} textAnchor="middle" fontSize="5.5" fontWeight={600} fill="rgba(255,255,255,0.85)">
              {b.length > 10 ? "Equipment" : b}
            </text>
          </g>
        );
      })}
      {/* confirm hint */}
      <rect x="22" y="156" width="116" height="14" rx="7" fill="rgba(255,255,255,0.1)" />
      <text x="80" y="165.5" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.6)">
        tap → confirm alert
      </text>
    </svg>
  );
}

/* ── DomEmerge: admin (room status + alerts log) ── */

function DomAdminVisual() {
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full">
      <rect x="0" y="0" width="360" height="22" fill="rgba(255,255,255,0.05)" />
      <text x="12" y="15" fontSize="7" fontWeight={700} fill="rgba(255,255,255,0.9)">
        Admin · Room status
      </text>
      <circle cx="338" cy="11" r="6" fill="rgba(255,255,255,0.2)" />
      {[
        ["Room 101", true],
        ["Room 102", true],
        ["Room 103", false],
        ["Room 104", true],
      ].map(([room, on], i) => (
        <g key={room as string}>
          <rect x="16" y={30 + i * 24} width="220" height="20" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
          <circle cx="28" cy={40 + i * 24} r="4" fill={on ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"} />
          <text x="40" y={43.5 + i * 24} fontSize="7" fontWeight={600} fill="rgba(255,255,255,0.85)">
            {room}
          </text>
          <text x="130" y={43.5 + i * 24} fontSize="6" fill={on ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)"}>
            {on ? "Online" : "Offline"}
          </text>
          <rect x="176" y={33 + i * 24} width="48" height="14" rx="7" fill={on ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"} />
          <text x="200" y={42.5 + i * 24} textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.8)">
            {on ? "active" : "offline"}
          </text>
        </g>
      ))}
      {/* alerts log */}
      <rect x="250" y="30" width="98" height="100" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
      <text x="260" y="44" fontSize="6" fontWeight={600} fill="rgba(255,255,255,0.8)">Recent alerts</text>
      {[
        ["Intruder", "Room 101"],
        ["Fire", "Room 104"],
      ].map(([a, r], i) => (
        <g key={i}>
          <text x="260" y={58 + i * 18} fontSize="5.5" fill="rgba(255,255,255,0.6)">• {a}</text>
          <text x="260" y={66 + i * 18} fontSize="5" fill="rgba(255,255,255,0.35)">{r} · 2 min ago</text>
        </g>
      ))}
      <text x="299" y="122" textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.5)">
        hardware 3/4 online
      </text>
    </svg>
  );
}

/* ── DomEmerge: hardware box (sonic sensors + stop alarm button) ── */

function DomHardwareVisual() {
  const [alarm, setAlarm] = useState(false);
  return (
    <svg viewBox="0 0 160 180" className="h-full w-full">
      {/* hardware box — contains sensors + stop button */}
      <rect x="18" y="8" width="124" height="152" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" />
      <text x="80" y="26" textAnchor="middle" fontSize="6" fontWeight={600} fill="rgba(255,255,255,0.8)">
        Sonic sensors
      </text>
      <g stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="1">
        <path d="M55 42 q10 -8 20 0" />
        <path d="M55 52 q10 -8 20 0" />
        <path d="M105 42 q-10 -8 -20 0" />
        <path d="M105 52 q-10 -8 -20 0" />
      </g>
      <text x="80" y="74" textAnchor="middle" fontSize="5.5" fill={alarm ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)"}>
        {alarm ? "⚠ alarm sounding" : "● armed"}
      </text>
      {/* big stop-alarm button — inside the box */}
      <g className="cursor-pointer" onClick={() => setAlarm(!alarm)}>
        <circle
          cx="80"
          cy="116"
          r="28"
          fill={alarm ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)"}
          stroke={alarm ? "#0e1116" : "rgba(255,255,255,0.4)"}
          strokeWidth="2"
        />
        <text x="80" y="114" textAnchor="middle" fontSize="8" fontWeight={700} fill={alarm ? "#0e1116" : "rgba(255,255,255,0.8)"}>
          STOP
        </text>
        <text x="80" y="124" textAnchor="middle" fontSize="5" fill={alarm ? "#0e1116" : "rgba(255,255,255,0.5)"}>
          ALARM
        </text>
      </g>
      <text x="80" y="152" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.3)">
        ultrasonic · buzzer
      </text>
    </svg>
  );
}

/* ── LogicIQ: plans (left) + subscription logic (right) ── */

const LOGIC_PLANS = [
  { name: "Starter", credits: "1,000", feats: ["Tier 1 features"], hot: false },
  { name: "Pro", credits: "5,000", feats: ["Tier 2 features", "Priority support"], hot: true },
  { name: "Enterprise", credits: "20,000+", feats: ["Tier 2 features", "Priority support", "Negotiable price (bulk credits)"], hot: false },
];

function LogicPlansVisual() {
  const [period, setPeriod] = useState<"monthly" | "annual">("annual");
  const DISCOUNTS = ["-11%", "-18%", "-20%"];
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full">
      {/* billing toggle — one segmented pill, centered, high above the cards */}
      <g className="cursor-pointer">
        <rect x="125" y="2" width="110" height="10" rx="5" fill="rgba(255,255,255,0.1)" />
        {(["monthly", "annual"] as const).map((p, i) => {
          const active = period === p;
          return (
            <g key={p} className="cursor-pointer" onClick={() => setPeriod(p)}>
              <rect
                x={125 + i * 55}
                y="2"
                width="55"
                height="10"
                rx="5"
                fill={active ? "rgba(255,255,255,0.9)" : "transparent"}
              />
              <text
                x={152.5 + i * 55}
                y="9.5"
                textAnchor="middle"
                fontSize="8"
                fontWeight={700}
                fill={active ? "#0e1116" : "rgba(255,255,255,0.6)"}
              >
                {p === "monthly" ? "Monthly" : "Annual"}
              </text>
            </g>
          );
        })}
      </g>
      {LOGIC_PLANS.map((pl, i) => {
        const x = 12 + i * 116;
        const hot = pl.hot;
        return (
          <g key={pl.name}>
            <rect
              x={x}
              y="22"
              width="104"
              height="150"
              rx="8"
              fill={hot ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)"}
              stroke={hot ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.12)"}
              strokeWidth={hot ? 1.5 : 1}
            />
            {/* annual discount badge — sticker, ~70% inside the card */}
            {period === "annual" && (
              <g>
                <rect x={x + 79} y="19" width="28" height="11" rx="5.5" fill="rgba(255,255,255,0.85)" />
                <text x={x + 93} y="27" textAnchor="middle" fontSize="6.5" fontWeight={700} fill="#0e1116">
                  {DISCOUNTS[i]}
                </text>
              </g>
            )}
            {hot && (
              <text x={x + 52} y="36" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.75)">★ recommended</text>
            )}
            <text x={x + 52} y={hot ? 52 : 46} textAnchor="middle" fontSize="10" fontWeight={700} fill="rgba(255,255,255,0.9)">
              {pl.name}
            </text>
            <text x={x + 52} y={hot ? 68 : 62} textAnchor="middle" fontSize="13" fontWeight={700} fill={hot ? "#fff" : "rgba(255,255,255,0.6)"}>
              {pl.credits}
              <tspan fontSize="7" fill="rgba(255,255,255,0.4)"> credits</tspan>
            </text>
            <line x1={x + 14} y1={hot ? 78 : 72} x2={x + 90} y2={hot ? 78 : 72} stroke="rgba(255,255,255,0.12)" />
            {pl.feats.flatMap((f, j) => {
              // long feature wraps to a second, indented line inside the card
              const lines =
                f === "Negotiable price (bulk credits)"
                  ? [
                      ["Negotiable price", true],
                      ["(bulk credits)", false],
                    ]
                  : [[f, true]];
              return lines.map(([ln, dot], k) => (
                <g key={`${f}-${k}`}>
                  {dot && (
                    <circle cx={x + 17} cy={90 + (j + k) * 15} r="2.5" fill={hot ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)"} />
                  )}
                  <text x={x + 27} y={94 + (j + k) * 15} fontSize="8" fill="rgba(255,255,255,0.6)">
                    {ln}
                  </text>
                </g>
              ));
            })}
            <rect x={x + 16} y="152" width="72" height="14" rx="7" fill={hot ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.1)"} />
            <text x={x + 52} y="162" textAnchor="middle" fontSize="8" fontWeight={600} fill={hot ? "#0e1116" : "rgba(255,255,255,0.5)"}>
              upgrade
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* tall layout for the narrow 30% panel: balance + top-up + usage */
function LogicVisual() {
  const [bal, setBal] = useState(2450);
  return (
    <svg viewBox="0 0 160 180" className="h-full w-full">
      {/* balance card */}
      <rect x="10" y="10" width="140" height="66" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
      <text x="20" y="27" fontSize="7" fill="rgba(255,255,255,0.5)">credit balance</text>
      <text x="20" y="50" fontSize="17" fontWeight={700} fill="rgba(255,255,255,0.95)">฿ {bal.toLocaleString()}</text>
      <circle cx="20" cy="64" r="3.5" fill="rgba(255,255,255,0.5)" />
      <text x="28" y="67" fontSize="6" fill="rgba(255,255,255,0.6)">Standard plan · active</text>
      {/* top-up buttons */}
      <text x="80" y="98" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.4)">top up</text>
      {[500, 1000, 2000].map((a, i) => (
        <g key={a} className="cursor-pointer" onClick={() => setBal((b) => b + a)}>
          <rect x={12 + i * 48} y="104" width="42" height="24" rx="12" fill="rgba(255,255,255,0.15)" />
          <text x={33 + i * 48} y="119.5" textAnchor="middle" fontSize="8" fontWeight={600} fill="rgba(255,255,255,0.85)">
            {a >= 1000 ? `+${a / 1000}k` : `+${a}`}
          </text>
        </g>
      ))}
      {/* usage */}
      <rect x="10" y="140" width="140" height="30" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      <text x="20" y="154" fontSize="6" fill="rgba(255,255,255,0.5)">usage this month</text>
      <rect x="20" y="160" width="80" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
      <rect x="20" y="160" width="52" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
      <text x="106" y="163" fontSize="6" fill="rgba(255,255,255,0.5)">65%</text>
    </svg>
  );
}

/* ── HoroAcademy: mobile web app — glass theme, Chinese zodiac, EN main + TH secondary ── */

const CN_ZODIAC_FEED = [
  { cn: "鼠", en: "Rat", th: "หนู", line: "Lucky 2, 8 · เลขนำโชค" },
  { cn: "牛", en: "Ox", th: "วัว", line: "Career up · งานก้าวหน้า" },
];

function HoroMobileVisual() {
  return (
    <svg viewBox="127 1 106 166" className="h-full w-full">
      {/* phone frame — glass, like every other card */}
      <rect x="128" y="2" width="104" height="162" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <rect x="130" y="4" width="100" height="158" rx="14" fill="rgba(255,255,255,0.03)" />
      {/* notch + status bar */}
      <rect x="170" y="6" width="20" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
      <text x="135" y="17" fontSize="6" fill="rgba(255,255,255,0.5)">9:41</text>
      {/* app header */}
      <rect x="132" y="22" width="96" height="16" fill="rgba(255,255,255,0.06)" />
      <text x="180" y="30" textAnchor="middle" fontSize="6.5" fontWeight={700} fill="rgba(255,255,255,0.9)">Horo Academy</text>
      <text x="180" y="36" textAnchor="middle" fontSize="4.5" fill="rgba(255,255,255,0.4)">ดวงจีน · feng shui</text>
      {/* today's prediction — Chinese zodiac */}
      <rect x="134" y="42" width="92" height="44" rx="8" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" />
      <text x="180" y="53" textAnchor="middle" fontSize="10" fontWeight={700} fill="rgba(255,255,255,0.9)">龍</text>
      <text x="180" y="63" textAnchor="middle" fontSize="6" fontWeight={600} fill="rgba(255,255,255,0.9)">Dragon · ปีมะโรง</text>
      <text x="180" y="70" textAnchor="middle" fontSize="4.5" fill="rgba(255,255,255,0.5)">Today · คำพยากรณ์วันนี้</text>
      <text x="180" y="77" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.65)">Lucky 3, 7, 9 · โชคดี</text>
      <text x="180" y="83.5" textAnchor="middle" fontSize="4.5" fill="rgba(255,255,255,0.4)">read more · อ่านต่อ</text>
      {/* feed — Chinese zodiac cards */}
      {CN_ZODIAC_FEED.map((z, i) => (
        <g key={z.en}>
          <rect x="134" y={91 + i * 26} width="92" height="22" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
          <rect x="139" y={95 + i * 26} width="14" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <text x="146" y={105.5 + i * 26} textAnchor="middle" fontSize="8" fontWeight={700} fill="rgba(255,255,255,0.85)">{z.cn}</text>
          <text x="158" y={100 + i * 26} fontSize="5.5" fontWeight={600} fill="rgba(255,255,255,0.85)">{z.en} · {z.th}</text>
          <text x="158" y={108 + i * 26} fontSize="4.5" fill="rgba(255,255,255,0.5)">{z.line}</text>
        </g>
      ))}
      {/* bottom nav — rounded to follow the phone's bottom curve */}
      <path d="M134 146 h92 v7 a6 6 0 0 1 -6 6 h-80 a6 6 0 0 1 -6 -6 z" fill="rgba(255,255,255,0.06)" />
      {["Home", "Predictions", "Profile"].map((l, i) => (
        <text
          key={l}
          x={148 + i * 32}
          y="153.5"
          textAnchor="middle"
          fontSize="4.5"
          fontWeight={i === 0 ? 700 : 400}
          fill={i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)"}
        >
          {l}
        </text>
      ))}
    </svg>
  );
}

/* ── HoroAcademy highlight: 3 tabs (mobile / horo app / internal tools) ── */

function HoroContainer({ stage, onStage, labels }: { stage: number; onStage: (i: number) => void; labels: string[] }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-wrap gap-1.5">
        {labels.map((l, i) => (
          <button
            key={l}
            onClick={() => onStage(i)}
            className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              i === stage ? "bg-white/90 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {String(i + 1).padStart(2, "0")} {l}
          </button>
        ))}
      </div>
      <div className="mt-2 min-h-0 flex-1">
        {stage === 0 ? <HoroMobileVisual /> : stage === 1 ? <HoroVisual /> : <HoroAdminVisual />}
      </div>
    </div>
  );
}

/* ── carousel data ── */

export const HIGHLIGHTS = [
  {
    key: "baantdee",
    name: "BaanTDee",
    badge: "Developing",
    live: "https://dev.baantdee.com",
    backend: "NestJS · billing & subscription logic",
    infra: "PostgreSQL + PostGIS · Redis · Docker",
    stages: BAANTDEE_STAGES,
    Visual: BaantdeeVisual,
  },
  {
    key: "tsec",
    name: "TSEC",
    badge: "Flagship",
    live: "https://tsec.info",
    backend: "Next.js 16 · Supabase (Postgres + RLS)",
    infra: "TypeScript · Tailwind CSS 4 · Vercel",
    stages: [
      {
        key: "hero",
        label: "Hero",
        title: "Scholarship landing",
        caption: "bilingual TH/EN · program highlights · apply CTA",
      },
      {
        key: "register",
        label: "Register",
        title: "6-step application wizard",
        caption: "autosave · documents · PDPA consent · review",
      },
      {
        key: "admin",
        label: "Internal tools",
        title: "Admin console",
        caption: "applications · events · content · role-gated",
      },
    ],
    Visual: TsecVisual,
  },
  {
    key: "horo",
    name: "HoroAcademy",
    badge: "Production",
    live: "https://www.horoacademy.com",
    backend: "Laravel · Filament PHP",
    infra: "PostgreSQL · Google Calendar API",
    stages: [
      {
        key: "mobile",
        label: "Horo app mobile",
        title: "Mobile web app — Chinese zodiac",
        caption: "daily Chinese zodiac predictions · LINE login · EN/TH",
      },
      {
        key: "app",
        label: "Horo app",
        title: "Online course platform",
        caption: "real course catalog · Thai astrology & feng shui courses",
      },
      {
        key: "admin",
        label: "Internal tools",
        title: "Filament admin console",
        caption: "manage courses · orders · students",
      },
    ],
    Visual: HoroVisual,
  },
];

/* ── hero carousel: autoplay 15s + glass loading bar + manual nav ── */

export default function ProductShowcase({
  projectIndex,
  onProjectChange,
}: {
  projectIndex: number;
  onProjectChange: (i: number) => void;
}) {
  const [stage, setStage] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const index = projectIndex;
  const h = HIGHLIGHTS[index];
  const Visual = h.Visual;
  const stageInfo = h.stages[Math.min(stage, h.stages.length - 1)];
  const stageCount = h.stages.length;

  // multi-stage projects render their own stage chips; single-stage render directly
  const stageVisual =
    h.key === "baantdee" ? (
      <BaantdeeVisual stage={stage} onStage={setStage} />
    ) : h.key === "tsec" ? (
      <TsecContainer stage={stage} onStage={setStage} labels={h.stages.map((s) => s.label)} />
    ) : h.key === "horo" ? (
      <HoroContainer stage={stage} onStage={setStage} labels={h.stages.map((s) => s.label)} />
    ) : (
      <Visual />
    );

  useEffect(() => {
    const t = setTimeout(() => {
      onProjectChange((index + 1) % HIGHLIGHTS.length);
      setStage(0);
      setResetKey((k) => k + 1);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, resetKey]);

  const go = (i: number) => {
    onProjectChange(((i % HIGHLIGHTS.length) + HIGHLIGHTS.length) % HIGHLIGHTS.length);
    setStage(0);
    setResetKey((k) => k + 1);
  };
  const reset = () => setResetKey((k) => k + 1);
  // arrows: cycle sub-tabs when the project has them, otherwise cycle projects
  const cycle = (dir: number) => {
    if (stageCount > 1) {
      setStage((stage + dir + stageCount) % stageCount);
    } else {
      go(index + dir);
    }
    setResetKey((k) => k + 1);
  };

  return (
    <div className="w-full" onClickCapture={reset}>
      <style>{`@keyframes pcFill { from { width: 0%; } to { width: 100%; } } .pc-fill { animation: pcFill ${AUTOPLAY_MS}ms linear forwards; }`}</style>

      {/* the box */}
      <div className="liquid-glass w-full rounded-3xl p-4 sm:p-5">
        {/* header */}
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs uppercase tracking-widest text-white/50">Featured · how they work</p>
          <a
            href={h.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/70 underline-offset-2 hover:underline"
          >
            {h.live.replace("https://", "")} ↗
          </a>
        </div>

        {/* project tabs */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {HIGHLIGHTS.map((x, i) => (
            <button
              key={x.key}
              onClick={() => go(i)}
              className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                i === index ? "bg-white/90 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              {String(i + 1).padStart(2, "0")} {x.name}
            </button>
          ))}
        </div>

        {/* glass loading bar — fills over AUTOPLAY_MS, resets on interaction */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            key={`${index}-${resetKey}`}
            className="pc-fill h-full rounded-full bg-gradient-to-r from-white/40 to-white"
            style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
          />
        </div>

        {/* stage visual */}
        <div className="mt-3 flex h-64 items-center justify-center rounded-2xl bg-black/30 p-3 sm:h-80">
          {stageVisual}
        </div>

        {/* caption + nav — nav cycles sub-tabs */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-white">{stageInfo.title}</p>
            <p className="truncate text-xs text-white/50">{stageInfo.caption}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={() => cycle(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="previous"
            >
              ←
            </button>
            <span className="w-8 text-center text-xs text-white/50">
              {stageCount > 1 ? `${stage + 1}/${stageCount}` : `${index + 1}/${HIGHLIGHTS.length}`}
            </span>
            <button
              onClick={() => cycle(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="next"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── compact versions for project cards ("their own section") ── */

function CardShowcase({ liveHref, children }: { liveHref?: string; children: ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl bg-black/30 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] uppercase tracking-widest text-white/40">how it works · interactive</p>
        {liveHref && (
          <a
            href={`https://${liveHref}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
          >
            {liveHref} ↗
          </a>
        )}
      </div>
      <div className="mt-2 h-40">{children}</div>
    </div>
  );
}

export function MilitaryShowcase() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    const n = new Set(done);
    n.has(i) ? n.delete(i) : n.add(i);
    setDone(n);
  };
  return (
    <CardShowcase liveHref="">
      <div className="flex h-full w-full gap-2">
        {/* checklist — 35% */}
        <div className="flex w-[35%] min-w-0 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Checklist</p>
          <div className="min-h-0 flex-1">
            <MilitaryChecklistVisual done={done} onToggle={toggle} />
          </div>
        </div>
        {/* calendar — 65% */}
        <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Calendar</p>
          <div className="min-h-0 flex-1">
            <MilitaryCalendarVisual done={done} />
          </div>
        </div>
      </div>
    </CardShowcase>
  );
}

export function BabyRevealShowcase() {
  return (
    <CardShowcase liveHref="baby-reveal-kappa.vercel.app">
      <BabyRevealVisual />
    </CardShowcase>
  );
}

export function DomShowcase() {
  return (
    <CardShowcase liveHref="">
      <div className="flex h-full w-full gap-2">
        {/* home — 40% */}
        <div className="flex w-[40%] min-w-0 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Home</p>
          <div className="min-h-0 flex-1">
            <DomHomeVisual />
          </div>
        </div>
        {/* admin — 40% */}
        <div className="flex w-[40%] min-w-0 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Admin</p>
          <div className="min-h-0 flex-1">
            <DomAdminVisual />
          </div>
        </div>
        {/* hardware — 20% */}
        <div className="flex w-[20%] min-w-0 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Hardware</p>
          <div className="min-h-0 flex-1">
            <DomHardwareVisual />
          </div>
        </div>
      </div>
    </CardShowcase>
  );
}

export function BaanTDeeShowcase() {
  const [selectedType, setSelectedType] = useState(0);
  return (
    <CardShowcase liveHref="dev.baantdee.com">
      <div className="flex h-full w-full flex-col gap-2">
        <div className="min-h-0 flex-1">
          <MapDrill />
        </div>
        <div className="h-10 shrink-0">
          <PropertyTypes selected={selectedType} onSelect={setSelectedType} size="sm" />
        </div>
      </div>
    </CardShowcase>
  );
}

export function TsecShowcase() {
  return (
    <CardShowcase liveHref="tsec.info">
      <div className="flex h-full w-full gap-2">
        <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Hero</p>
          <div className="min-h-0 flex-1">
            <TsecHeroVisual />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Register</p>
          <div className="min-h-0 flex-1">
            <TsecVisual />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Internal tools</p>
          <div className="min-h-0 flex-1">
            <TsecAdminVisual />
          </div>
        </div>
      </div>
    </CardShowcase>
  );
}

export function HoroShowcase() {
  return (
    <CardShowcase liveHref="horoacademy.com">
      <div className="flex h-full w-full gap-2">
        <div className="flex w-[30%] min-w-0 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Horo app mobile</p>
          <div className="min-h-0 flex-1">
            <HoroMobileVisual />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Internal tools</p>
          <div className="min-h-0 flex-1">
            <HoroAdminVisual />
          </div>
        </div>
      </div>
    </CardShowcase>
  );
}

export function LogicShowcase() {
  return (
    <CardShowcase liveHref="logiciq.io">
      <div className="flex h-full w-full gap-2">
        {/* plans — 70% */}
        <div className="flex min-w-0 flex-[7] flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Plans</p>
          <div className="min-h-0 flex-1">
            <LogicPlansVisual />
          </div>
        </div>
        {/* subscription logic — 30% */}
        <div className="flex min-w-0 flex-[3] flex-col rounded-lg bg-black/20 p-1.5">
          <p className="pb-1 text-center text-[8px] uppercase tracking-wider text-white/40">Subscription logic</p>
          <div className="min-h-0 flex-1">
            <LogicVisual />
          </div>
        </div>
      </div>
    </CardShowcase>
  );
}
