export const breakpoints = {
  xs: 370,
  sm: 576,
  md: 852,
  lg: 968,
  xl: 1080,
  xxl: 1200,
} as const;

export const mediaQueries = {
  xs: ``,
  sm: `@media screen and (min-width: ${breakpoints.sm}px)`,
  md: `@media screen and (min-width: ${breakpoints.md}px)`,
  lg: `@media screen and (min-width: ${breakpoints.lg}px)`,
  xl: `@media screen and (min-width: ${breakpoints.xl}px)`,
  xxl: `@media screen and (min-width: ${breakpoints.xxl}px)`,
};

export type Breakpoint = keyof typeof breakpoints;

export const breakpointNames = Object.keys(breakpoints) as Breakpoint[];
