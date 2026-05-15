export const T = {
  // Backgrounds
  ivory: '#FAF9F5',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F3EE',
  warnBg: '#FEF3EE',
  warnBgLight: '#FDF6F2',

  // Text
  slate: '#141413',
  muted: '#6B6A68',
  mutedLight: '#A09E9B',

  // Accents
  clay: '#D97757',
  clayLight: '#EEB49E',
  clayDark: '#B85E3E',

  olive: '#5C6B3A',
  oliveLight: '#8C9E6A',
  oliveBg: '#EEF2E8',

  sky: '#3D7CC9',
  skyLight: '#6BA0DF',
  skyBg: '#EBF2FA',

  fig: '#5B4B7A',
  figLight: '#8A74A8',
  figBg: '#F0ECF7',

  heather: '#7B5EA7',
  heatherLight: '#A882CC',
  heatherBg: '#F5EFF9',

  red: '#C0593E',
  redBg: '#FDEEEB',

  // Borders
  border: '#E5E3DC',
  borderMed: '#D0CEC5',
  borderStrong: '#B8B5AD',

  // Spacing multiples of 4
  s1: '4px',
  s2: '8px',
  s3: '12px',
  s4: '16px',
  s5: '20px',
  s6: '24px',
  s8: '32px',
  s10: '40px',

  // Border radius
  rSm: '4px',
  rMd: '6px',
  rLg: '12px',
  rFull: '9999px',

  // Font
  fontSans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontMono: '"JetBrains Mono", "Fira Mono", monospace',
};

export const KIND_COLORS = {
  HM: T.sky,
  TS: T.olive,
  CD: T.clay,
  SD: T.fig,
  CL: T.heather,
  DB: T.slate,
};

export const KIND_BG = {
  HM: T.skyBg,
  TS: T.oliveBg,
  CD: T.warnBg,
  SD: T.figBg,
  CL: T.heatherBg,
  DB: '#EEEEED',
};

export const KIND_LABEL = {
  HM: 'HM screen',
  TS: 'Tech screen',
  CD: 'Coding',
  SD: 'Sys design',
  CL: 'Culture',
  DB: 'Debrief',
};
