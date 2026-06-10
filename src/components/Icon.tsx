/**
 * Kantongin icon set — stroke icons ported from the design's c1-icons.jsx
 * to react-native-svg. Same 24x24 viewBox and path data as the prototype.
 */
import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

export type IconName =
  | 'home' | 'history' | 'analytics' | 'settings' | 'plus'
  | 'up' | 'down' | 'swap' | 'eye' | 'eyeoff' | 'chevron' | 'chevdown'
  | 'search' | 'filter' | 'close' | 'calendar' | 'bell' | 'download'
  | 'cloud' | 'user' | 'check' | 'wallet' | 'coins'
  | 'food' | 'car' | 'bag' | 'bolt' | 'play';

interface IconProps {
  name: IconName;
  size?: number;
  /** stroke width */
  stroke?: number;
  color?: string;
}

export function Icon({ name, size = 22, stroke = 2, color = colors.text }: IconProps) {
  const p = {
    fill: 'none',
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;

  const paths: Record<IconName, React.ReactNode> = {
    home: (
      <>
        <Path d="M3 10.5 12 3l9 7.5" {...p} />
        <Path d="M5 9.5V20h14V9.5" {...p} />
      </>
    ),
    history: <Path d="M3 6h18M3 12h18M3 18h12" {...p} />,
    analytics: <Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...p} />,
    settings: (
      <>
        <Circle cx={12} cy={12} r={3} {...p} />
        <Path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" {...p} />
      </>
    ),
    plus: <Path d="M12 5v14M5 12h14" {...p} />,
    up: <Path d="M12 19V5M6 11l6-6 6 6" {...p} />,
    down: <Path d="M12 5v14M6 13l6 6 6-6" {...p} />,
    swap: <Path d="M7 7h11l-3-3M17 17H6l3 3" {...p} />,
    eye: (
      <>
        <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" {...p} />
        <Circle cx={12} cy={12} r={3} {...p} />
      </>
    ),
    eyeoff: <Path d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M9.4 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.6 4.4M6.2 6.3A17 17 0 0 0 2 12s3.5 7 10 7a10.4 10.4 0 0 0 3-.4" {...p} />,
    chevron: <Path d="M9 6l6 6-6 6" {...p} />,
    chevdown: <Path d="M6 9l6 6 6-6" {...p} />,
    search: (
      <>
        <Circle cx={11} cy={11} r={7} {...p} />
        <Path d="M21 21l-4-4" {...p} />
      </>
    ),
    filter: <Path d="M3 5h18M6 12h12M10 19h4" {...p} />,
    close: <Path d="M6 6l12 12M18 6 6 18" {...p} />,
    calendar: (
      <>
        <Rect x={3} y={5} width={18} height={16} rx={3} {...p} />
        <Path d="M3 9h18M8 3v4M16 3v4" {...p} />
      </>
    ),
    bell: (
      <>
        <Path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" {...p} />
        <Path d="M10 19a2 2 0 0 0 4 0" {...p} />
      </>
    ),
    download: <Path d="M12 3v12M7 10l5 5 5-5M5 21h14" {...p} />,
    cloud: <Path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.8 3.8 0 0 1 18 18Z" {...p} />,
    user: (
      <>
        <Circle cx={12} cy={8} r={4} {...p} />
        <Path d="M4 20a8 8 0 0 1 16 0" {...p} />
      </>
    ),
    check: <Path d="M5 12l5 5L20 6" {...p} />,
    wallet: (
      <>
        <Rect x={3} y={6} width={18} height={13} rx={3} {...p} />
        <Path d="M16 12h3M3 9h13a2 2 0 0 1 2 2" {...p} />
      </>
    ),
    coins: (
      <>
        <Ellipse cx={12} cy={6} rx={7} ry={3} {...p} />
        <Path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" {...p} />
      </>
    ),
    food: <Path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10M17 3c-1.5 0-3 2-3 6 0 2 1 3 2 3v9" {...p} />,
    car: (
      <>
        <Path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M4 13h16v5H4z" {...p} />
        <Circle cx={8} cy={18} r={1.4} {...p} />
        <Circle cx={16} cy={18} r={1.4} {...p} />
      </>
    ),
    bag: (
      <>
        <Path d="M5 8h14l-1 12H6L5 8Z" {...p} />
        <Path d="M9 8V6a3 3 0 0 1 6 0v2" {...p} />
      </>
    ),
    bolt: <Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" {...p} />,
    play: (
      <>
        <Circle cx={12} cy={12} r={9} {...p} />
        <Path d="M10 9l5 3-5 3V9Z" {...p} />
      </>
    ),
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {paths[name]}
    </Svg>
  );
}

/** Category id -> glyph name, matching the design's glyphFor map. */
export const glyphFor: Record<string, IconName> = {
  makan: 'food',
  transport: 'car',
  belanja: 'bag',
  tagihan: 'bolt',
  hiburan: 'play',
  kesehatan: 'plus',
  gaji: 'wallet',
  transfer: 'swap',
};
