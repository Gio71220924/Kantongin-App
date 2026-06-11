export interface Palette {
  bg: string;
  card: string;
  text: string;
  muted: string;
  line: string;
  primary: string;
}

export const lightColors: Palette = {
  bg: '#F4F6FA',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#7B8794',
  line: '#EAEDF2',
  primary: '#1F6FEB',
};

export const darkColors: Palette = {
  bg: '#0E1117',
  card: '#181C24',
  text: '#F3F5F9',
  muted: '#8B95A3',
  line: '#272D38',
  primary: '#3D7BFF',
};

/** @deprecated Prefer `useColors()`. */
export const colors: Palette = lightColors;
