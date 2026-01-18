export const SHAKE_THRESHOLD = 1.78;

export const UPDATE_INTERVAL = 100;

export const COOLDOWN_TIME = 1000; 

export const SMOOTHING_SAMPLES = 3;


export const DICE_MIN = 1;
export const DICE_MAX = 6;

export const ROLL_ANIMATION_DURATION = 300;


export const COLORS = {
  background: '#403925',
  surface: '#73624D',
  primary: '#D9C3A9',
  text: '#F2E2CE',
  accent: '#A68D77',

  primaryDark: '#73624D',
  primaryLight: '#F2E2CE',
  
  backgroundAlt: '#403925', 
  
  diceBackground: '#F2E2CE',
  diceDots: '#403925',
  
  textSecondary: '#D9C3A9',
  textMuted: '#A68D77',
  
  success: '#10b981',       
  warning: '#f59e0b',       
  error: '#ef4444',         
  info: '#3b82f6',          
  
  shadow: '#000000',       
  glow: '#D9C3A9',          
  
  border: '#A68D77',
  borderLight: 'rgba(217, 195, 169, 0.2)',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(242, 226, 206, 0.1)',
} as const;

export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const DIMENSIONS = {
  diceSize: 150,
  diceBorderRadius: 25,
  dotSize: 20,
  dotBorderRadius: 10,
  
  buttonHeight: 50,
  buttonBorderRadius: 15,
  
  cardBorderRadius: 15,
} as const;

export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const;

export const MESSAGES = {
  sensorActive: '¡Agita tu teléfono!',
  sensorInactive: 'Activando sensor...',
  sensorUnavailable: 'Sensor no disponible',
  rolling: 'Lanzando...',
  ready: 'Listo para jugar',
} as const;

export type ColorKeys = keyof typeof COLORS;
export type TypographyKeys = keyof typeof TYPOGRAPHY;
export type SpacingKeys = keyof typeof SPACING;