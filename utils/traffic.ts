export type TrafficLoad = "low" | "medium" | "high";

const LOW = { r: 34, g: 197, b: 94 };
const MID = { r: 250, g: 204, b: 21 };
const HIGH = { r: 239, g: 68, b: 68 };

export function trafficLoad(level: number): TrafficLoad {
  if (level < 45) return "low";
  if (level < 75) return "medium";
  return "high";
}

export function trafficFillRgba(level: number, alpha = 0.28): string {
  const load = trafficLoad(level);
  const c = load === "low" ? LOW : load === "medium" ? MID : HIGH;
  return `rgba(${c.r},${c.g},${c.b},${alpha})`;
}

export function trafficHeatRgba(level: number, alpha: number): string {
  return trafficFillRgba(level, alpha);
}

export function trafficMarkerClass(level: number, active: boolean): string {
  const load = trafficLoad(level);
  const base =
    load === "low"
      ? "border-emerald-200/80 bg-emerald-500/90 shadow-[0_0_20px_rgba(34,197,94,0.85)]"
      : load === "medium"
        ? "border-amber-200/80 bg-amber-400/90 shadow-[0_0_20px_rgba(250,204,21,0.85)]"
        : "border-rose-200/80 bg-red-500/90 shadow-[0_0_22px_rgba(239,68,68,0.9)]";
  const size = active ? "size-5" : "size-4";
  return `${size} rounded-full border-2 ${base}`;
}
