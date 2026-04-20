export type AnimationVariant =
  | 'fade-up'
  | 'fade-down'
  | 'scale-in'
  | 'slide-left'
  | 'slide-right';

export type EasingName =
  | 'cinematic'
  | 'spring'
  | 'smooth'
  | 'sharp'
  | 'decelerate'
  | 'accelerate';

export interface ScrollTriggerConfig {
  trigger: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string;
  markers?: boolean;
  toggleActions?: string;
}

export interface AnimationConfig {
  variant: AnimationVariant;
  duration?: number;
  delay?: number;
  easing?: EasingName;
}
