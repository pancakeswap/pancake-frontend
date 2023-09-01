import { StyleRule } from '@vanilla-extract/css'
import { Breakpoint, breakpoints } from './breakpoints'

type CSSProps = Omit<StyleRule, '@media' | '@supports'>

const makeMediaQuery = (breakpoint: Breakpoint) => (styles?: CSSProps) =>
  !styles || Object.keys(styles).length === 0
    ? {}
    : {
        [`screen and (min-width: ${breakpoints[breakpoint]}px)`]: styles,
      }

const mediaQuery = {
  sm: makeMediaQuery('sm'),
  md: makeMediaQuery('md'),
  lg: makeMediaQuery('lg'),
  xl: makeMediaQuery('xl'),
  xxl: makeMediaQuery('xxl'),
}

type ResponsiveStyle = {
  xs?: CSSProps
  sm?: CSSProps
  md?: CSSProps
  lg?: CSSProps
  xl?: CSSProps
  xxl?: CSSProps
}

export const responsiveStyle = ({ xs, sm, md, lg, xl, xxl }: ResponsiveStyle): StyleRule => {
  const { '@media': _, ...xsStyle } = (xs ?? {}) as any
  return {
    ...xsStyle,
    ...(sm || md || lg || xl
      ? {
          '@media': {
            ...mediaQuery.sm(sm ?? {}),
            ...mediaQuery.md(md ?? {}),
            ...mediaQuery.lg(lg ?? {}),
            ...mediaQuery.xl(xl ?? {}),
            ...mediaQuery.xxl(xxl ?? {}),
          },
        }
      : {}),
  }
}
