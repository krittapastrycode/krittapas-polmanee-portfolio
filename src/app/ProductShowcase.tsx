"use client";

// Interactive platform-highlight stepper for the hero right panel.
// Mirrors the REAL BaanTDee site (local codebase):
//   - Map stage: full Thailand map -> click region -> REGION MAP with province
//     polygons (region-province-map.tsx + province-polygons.ts) -> click
//     province -> opens dev.baantdee.com/search?province=<thai name>
//   - Types stage: the real lucide-react category icons (category-icons.tsx),
//     7 types -> opens dev.baantdee.com/search?type=<key>
//   - Listing + Plans stages: real listing data + real plan catalog (plans.ts)

import { useState } from "react";
import { Home, Building2, Landmark, TreePine, Store, Warehouse, Castle } from "lucide-react";
import regionData from "./baantdee-provinces.json";

type RegionId = "northern" | "northeastern" | "central" | "eastern" | "southern";

const REGION_AREAS: { id: RegionId; name: string; labelX: number; labelY: number; points: string }[] = [
  {
    id: "northern",
    name: "North",
    labelX: 29.94,
    labelY: 36.37,
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
    id: "northeastern",
    name: "Northeast",
    labelX: 69.86,
    labelY: 55.14,
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
    id: "central",
    name: "Central",
    labelX: 36.62,
    labelY: 78.84,
    points:
      "48.82,62.5 45.9,64.03 41.39,62.71 38.54,67.08 35.35,63.33 34.38,64.65 30.9,64.38 31.6,66.81 28.75,68.33 26.32,66.88 " +
      "22.71,67.43 17.78,60.56 18.12,63.54 13.47,65.42 14.58,70.49 22.36,78.2 25.49,84.65 23.68,89.86 25.28,94.31 27.57,95.77 " +
      "29.51,105.35 24.24,112.99 25.0,113.89 27.78,113.47 27.36,111.6 33.33,100.28 33.61,86.18 40.14,84.31 44.17,85.35 47.15,83.68 " +
      "53.06,88.33 55.83,86.53 59.03,87.36 65.9,78.06 57.43,77.92 54.58,74.93 47.22,73.89 46.67,70.7 49.58,69.17",
  },
  {
    id: "eastern",
    name: "East",
    labelX: 53.47,
    labelY: 91.97,
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
    id: "southern",
    name: "South",
    labelX: 30.77,
    labelY: 147.4,
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

/* ── real category icons (category-icons.tsx) ── */
const PROPERTY_TYPES = [
  { key: "house", label: "House", icon: Home },
  { key: "condo", label: "Condo", icon: Building2 },
  { key: "townhouse", label: "Townhouse", icon: Landmark },
  { key: "land", label: "Land", icon: TreePine },
  { key: "commercial", label: "Commercial", icon: Store },
  { key: "warehouse", label: "Warehouse", icon: Warehouse },
  { key: "resort", label: "Resort / Hotel", icon: Castle },
] as const;

/* ── real plan catalog (plans.ts) ── */
const PLANS = [
  { name: "Standard", features: ["12 listings", "10 photos / listing"], monthly: 199, annual: 2200 },
  { name: "Pro", badge: "recommended", features: ["30 listings", "15 photos / listing"], monthly: 499, annual: 5400 },
  { name: "Agency", features: ["200 listings", "20 photos / listing", "5-person team"], monthly: 1299, annual: 14000 },
];

const MAP_FILTER = { filter: "grayscale(1) invert(1) brightness(1.2) contrast(1.05) opacity(0.85)" };
const REGION_MAP_FILTER = { filter: "grayscale(1) invert(1) brightness(1.7) contrast(1.1)" };

function openSearch(params: string) {
  window.open(`${SEARCH_BASE}?${params}`, "_blank", "noopener,noreferrer");
}

/* ── Map drill: full map → region map with provinces → search ── */
function MapDrill() {
  const [region, setRegion] = useState<RegionId | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const data = region ? REGION_DATA[region] : null;

  return (
    <div className="flex h-full w-full gap-2">
      {/* map */}
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
            {/* back */}
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

      {/* side list */}
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

/* ── Types stage: real lucide icons, like the real site ── */
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

function ListingCard() {
  return (
    <div className="flex h-full w-full gap-3">
      <div className="relative flex-1 overflow-hidden rounded-xl bg-black/20">
        {/* 2-story glass house, symmetric, no glow */}
        <svg viewBox="0 0 200 140" className="h-full w-full" role="img" aria-label="House listing">
          {/* ground */}
          <line x1="24" y1="124" x2="176" y2="124" stroke="rgba(255,255,255,0.1)" />
          {/* body (two floors: 48-86, 86-122) */}
          <rect x="50" y="48" width="100" height="74" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.1" />
          {/* floor divider */}
          <line x1="50" y1="86" x2="150" y2="86" stroke="rgba(255,255,255,0.12)" />
          {/* roof, symmetric — base flush with body top, no bottom stroke */}
          <path
            d="M42 48 L100 18 L158 48"
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          {/* door (center) */}
          <rect x="91" y="94" width="18" height="28" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <circle cx="104" cy="108" r="1.4" fill="rgba(255,255,255,0.6)" />
          {/* windows — mirrored pairs */}
          {[
            [60, 94], [122, 94], // ground floor
            [60, 58], [122, 58], // upper floor
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
            <rect
              x={x}
              y="12"
              width="104"
              height="152"
              rx="8"
              fill={hot ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)"}
              stroke={hot ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.12)"}
              strokeWidth={hot ? 1.5 : 1}
            />
            {hot && (
              <text x={x + 52} y="26" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.75)">
                ★ {p.badge}
              </text>
            )}
            <text x={x + 52} y={hot ? 42 : 36} textAnchor="middle" fontSize="10" fontWeight={700} fill="rgba(255,255,255,0.9)">
              {p.name}
            </text>
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
            <text x={x + 52} y="152" textAnchor="middle" fontSize="8" fontWeight="600" fill={hot ? "#0e1116" : "rgba(255,255,255,0.5)"}>
              upgrade
            </text>
          </g>
        );
      })}
      <text x="180" y="174" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)">
        real plans · Omise billing · annual ฿2,200 / ฿5,400 / ฿14,000
      </text>
    </svg>
  );
}

const STAGES = [
  { key: "map", label: "Map search", title: "Search from the map", caption: "region → province map → search, like the real site" },
  { key: "types", label: "Types", title: "7 property types", caption: "same icons as the real site · click → real search" },
  { key: "listing", label: "Listing", title: "A real listing", caption: "rent/sale · seller verified · in-app chat" },
  { key: "plans", label: "Plans", title: "Subscription plans", caption: "Standard ฿199 · Pro ฿499 · Agency ฿1,299 /mo" },
];

/* ── compact version for the BaanTDee project card in “Things I've built” ── */
export function BaanTDeeShowcase() {
  const [selectedType, setSelectedType] = useState(0);
  return (
    <div className="mt-4 rounded-2xl bg-black/30 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] uppercase tracking-widest text-white/40">how it works · interactive</p>
        <a
          href="https://dev.baantdee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
        >
          dev.baantdee.com ↗
        </a>
      </div>
      <div className="mt-2 h-44">
        <MapDrill />
      </div>
      <div className="mt-2 h-16">
        <PropertyTypes selected={selectedType} onSelect={setSelectedType} size="sm" />
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  const [stage, setStage] = useState(0);
  const [selectedType, setSelectedType] = useState(0);
  const current = STAGES[stage];

  const go = (i: number) => setStage(i);

  return (
    <div className="liquid-glass w-full rounded-3xl p-4 sm:p-5">
      {/* header */}
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs uppercase tracking-widest text-white/50">BaanTDee · how it works</p>
        <a
          href="https://dev.baantdee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/70 underline-offset-2 hover:underline"
        >
          dev.baantdee.com ↗
        </a>
      </div>

      {/* step chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {STAGES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => go(i)}
            className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              i === stage ? "bg-white/90 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {String(i + 1).padStart(2, "0")} {s.label}
          </button>
        ))}
      </div>

      {/* stage visual */}
      <div className="mt-3 flex h-56 items-center justify-center rounded-2xl bg-black/30 p-3 sm:h-64">
        {stage === 0 && <MapDrill />}
        {stage === 1 && (
          <PropertyTypes
            selected={selectedType}
            onSelect={(i) => setSelectedType(i)}
          />
        )}
        {stage === 2 && <ListingCard />}
        {stage === 3 && <Subscriptions />}
      </div>

      {/* caption + nav */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-white">{current.title}</p>
          <p className="truncate text-xs text-white/50">{current.caption}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => go((stage + 3) % 4)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="previous highlight"
          >
            ←
          </button>
          <span className="w-8 text-center text-xs text-white/50">
            {stage + 1}/4
          </span>
          <button
            onClick={() => go((stage + 1) % 4)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="next highlight"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
