export const breakpoints = {
  sm: 576,
  md: 852,
  lg: 968,
  xl: 1080,
  xxl: 1200,
} as const

export type Breakpoint = keyof typeof breakpoints

export const breakpointNames = Object.keys(breakpoints) as Breakpoint[]
