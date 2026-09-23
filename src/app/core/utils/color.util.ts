/**
 * Lightens or darkens a hex color by blending it toward white/black.
 * Used to derive hover/light variants of a tenant's chosen brand color at
 * runtime, since only one base color is configurable but the UI needs
 * matching light/dark shades for badges and hover states.
 */
function shadeHexColor(hex: string, percent: number): string | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;

  const num = parseInt(match[1], 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;

  const blend = (channel: number) =>
    percent >= 0
      ? Math.round(channel + (255 - channel) * percent)
      : Math.round(channel * (1 + percent));

  const toHex = (channel: number) => Math.max(0, Math.min(255, channel)).toString(16).padStart(2, '0');

  return `#${toHex(blend(r))}${toHex(blend(g))}${toHex(blend(b))}`;
}

export function lightenHexColor(hex: string, percent = 0.92): string | null {
  return shadeHexColor(hex, Math.abs(percent));
}

export function darkenHexColor(hex: string, percent = 0.1): string | null {
  return shadeHexColor(hex, -Math.abs(percent));
}

export function isValidHexColor(hex: string | null | undefined): hex is string {
  return !!hex && /^#?[0-9a-f]{6}$/i.test(hex.trim());
}
