/**
 * Kantongin — Modern Fintech theme tokens.
 * Ported from the design's `--c1-*` CSS vars + c1-ui semantic colors.
 */

export type { Palette } from './colors';
export { colors, darkColors, lightColors } from './colors';

/** Semantic transaction colors. Transfer is deliberately its own hue. */
export const semantic = {
  income: '#12936A',
  expense: '#E5484D',
  transfer: '#6D4AFF',
} as const;

export const radius = 22;

/** Plus Jakarta Sans weights as loaded by @expo-google-fonts/plus-jakarta-sans. */
export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

/** iOS prototype canvas size the design was authored at. */
export const DEVICE = { width: 402, height: 874 } as const;

/**
 * Convert an OKLCH color to an sRGB hex string.
 * React Native cannot parse `oklch()` in styles, so category colors —
 * which the design expressed as oklch(L C hue) — are precomputed here.
 * Math: Björn Ottosson's OKLab → linear sRGB matrices.
 */
export function oklchToHex(L: number, C: number, H: number): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const gamma = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  const toHex = (x: number) => {
    const byte = Math.max(0, Math.min(255, Math.round(gamma(x) * 255)));
    return byte.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

/** Vivid category color (matches design's catColor). */
export const catColor = (hue: number, L = 0.62, C = 0.15) => oklchToHex(L, C, hue);
/** Soft tinted background for a category (matches design's catSoft). */
export const catSoft = (hue: number) => oklchToHex(0.95, 0.04, hue);

/** Add an alpha channel to a 6-digit hex color (e.g. withAlpha('#6D4AFF', 0.08)). */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.max(0, Math.min(255, Math.round(alpha * 255)))
    .toString(16)
    .padStart(2, '0');
  return hex + a;
}

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Linear sRGB blend of two hex colors. t=1 returns `a`, t=0 returns `b`. */
export function mixHex(a: string, b: string, t: number): string {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  const ch = (x: number, y: number) =>
    Math.round(x * t + y * (1 - t)).toString(16).padStart(2, '0');
  return `#${ch(r1, r2)}${ch(g1, g2)}${ch(b1, b2)}`;
}

export * from './theme-context';
