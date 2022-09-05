import { createRainbowSprinkles, defineProperties } from '@pancakeswap/rainbow-sprinkles'
import { calc } from '@vanilla-extract/css-utils'

import { Breakpoint, breakpointNames, breakpoints } from './breakpoints'
import { vars } from './vars.css'

// Ensure reset has lowest specificity
/* DO NOT MOVE THIS LINE */
import './reset.css'
/* DO NOT MOVE THIS LINE */

const flexAlignment = ['flex-start', 'center', 'start', 'flex-end', 'stretch'] as const

const negativeSpace = {
  '-px': `${calc(vars.space.px).negate()}`,
  '-1': `${calc(vars.space['1']).negate()}`,
  '-2': `${calc(vars.space['2']).negate()}`,
  '-3': `${calc(vars.space['3']).negate()}`,
  '-4': `${calc(vars.space['4']).negate()}`,
  '-5': `${calc(vars.space['5']).negate()}`,
  '-6': `${calc(vars.space['6']).negate()}`,
  '-7': `${calc(vars.space['7']).negate()}`,
}

const extendedSpace = {
  '1/4': '25%',
  '1/3': '33.333333%',
  '1/2': '50%',
  '2/3': '66.666667%',
  '3/4': '75%',
  '100%': '100%',
  full: '100%',
  auto: 'auto',
  screenSm: breakpoints.sm,
  screenMd: breakpoints.md,
  screenLg: breakpoints.lg,
  screenXl: breakpoints.xl,
}

const margin = { ...vars.space, auto: 'auto' }

const responsiveProperties = defineProperties({
  defaultCondition: 'xs',
  conditions: {
    xs: {},
    sm: { '@media': `(min-width: ${breakpoints.sm}px)` },
    md: { '@media': `(min-width: ${breakpoints.md}px)` },
    lg: { '@media': `(min-width: ${breakpoints.lg}px)` },
    xl: { '@media': `(min-width: ${breakpoints.xl}px)` },
    xxl: { '@media': `(min-width: ${breakpoints.xxl}px)` },
  },
  responsiveArray: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  staticProperties: {
    display: ['block', 'flex', 'grid', 'inline', 'inline-flex', 'inline-block', 'none', 'contents'],
    flexDirection: ['column', 'row', 'column-reverse'],
    alignItems: ['center', 'end', 'baseLine', 'inherit', ...flexAlignment],
    flexWrap: ['wrap', 'nowrap'],
    overflow: ['auto', 'hidden', 'scroll', 'unset'],
    overflowY: ['auto', 'hidden', 'scroll'],
    overflowX: ['auto', 'hidden', 'scroll'],
    position: ['absolute', 'fixed', 'relative', 'sticky'],
    textAlign: ['center', 'left', 'right'],
    justifyContent: [...flexAlignment, 'space-around', 'space-between'],
    justifyItems: [...flexAlignment],
    justifySelf: [...flexAlignment],
    inset: { ...vars.space, ...negativeSpace },
    height: { ...vars.space, ...extendedSpace },
    left: { ...vars.space, ...negativeSpace },
    marginBottom: { ...margin, ...negativeSpace },
    marginLeft: { ...margin, ...negativeSpace },
    marginRight: { ...margin, ...negativeSpace },
    marginTop: { ...margin, ...negativeSpace },
    maxHeight: vars.space,
    maxWidth: {
      ...vars.space,
      ...extendedSpace,
      none: 'none',
    },
    minHeight: vars.space,
    minWidth: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    paddingTop: vars.space,
    fontSize: {
      ...vars.fontSizes,
      inherit: 'inherit',
    },
    right: { ...vars.space, ...negativeSpace },
    top: { ...vars.space, ...negativeSpace },
    flex: {
      1: '1 1 0%',
      auto: '1 1 auto',
      initial: '0 1 auto',
      none: 'none',
    },
    width: {
      ...vars.space,
      ...extendedSpace,
    },
    zIndex: {
      '0': 0,
      ribbon: 9,
      dropdown: 10,
      '10': 10,
      '20': 20,
      '30': 30,
      '40': 40,
      '50': 50,
      '75': 75,
      '100': 100,
      modal: 100,
      auto: 'auto',
    },
  },
  dynamicProperties: {
    display: true,
    // flex
    order: true,
    flexBasis: true,
    flex: true,
    flexGrow: true,
    flexShrink: true,
    flexDirection: true, // TODO: fix type before move to static
    justifyContent: true, // TODO: fix type before move to static
    alignItems: true, // TODO: fix type before move to static
    alignSelf: true, // to static
    alignContent: true,
    // border
    border: true,
    borderWidth: true,
    borderBottomWidth: true,
    borderLeftWidth: true,
    borderRightWidth: true,
    borderTopWidth: true,
    borderStyle: true,
    borderTopStyle: true,
    borderBottomStyle: true,
    borderLeftStyle: true,
    borderRightStyle: true,
    borderTop: true,
    borderRight: true,
    borderLeft: true,
    borderBottom: true,
    borderColor: true,
    borderTopColor: true,
    borderRightColor: true,
    borderBottomColor: true,
    borderLeftColor: true,
    borderRadius: vars.radii,
    borderBottomLeftRadius: vars.radii,
    borderBottomRightRadius: vars.radii,
    borderTopLeftRadius: vars.radii,
    borderTopRightRadius: vars.radii,
    textAlign: true,
    zIndex: true,
    // background
    background: true,
    backgroundImage: true,
    backgroundSize: true,
    backgroundPosition: true,
    backgroundRepeat: true,
    // grid
    gridColumn: true,
    // gridRow: true,
    columnGap: true,
    gridAutoRows: true,
    gridTemplateColumns: true,
    gridTemplateRows: true,
    gridTemplateAreas: true,
    rowGap: true,
    bottom: true,
    fontSize: {
      ...vars.fontSizes,
      inherit: 'inherit',
    },
    opacity: true,
    gap: vars.space,
    inset: true,
    height: true,
    left: true,
    marginBottom: true,
    marginLeft: true,
    marginRight: true,
    marginTop: true,
    maxHeight: true,
    maxWidth: true,
    minHeight: true,
    minWidth: true,
    paddingBottom: true,
    paddingLeft: true,
    paddingRight: true,
    padding: true,
    margin: true,
    paddingTop: true,
    right: true,
    top: true,
    width: true,
  },
  shorthands: {
    borderLeftRadius: ['borderBottomLeftRadius', 'borderTopLeftRadius'],
    borderRightRadius: ['borderBottomRightRadius', 'borderTopRightRadius'],
    borderTopRadius: ['borderTopLeftRadius', 'borderTopRightRadius'],
    borderBottomRadius: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    m: ['margin'],
    ml: ['marginLeft'],
    mr: ['marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    mx: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    my: ['marginTop', 'marginBottom'],
    pl: ['paddingLeft'],
    pr: ['paddingRight'],
    pt: ['paddingTop'],
    pb: ['paddingBottom'],
    p: ['padding'],
    paddingX: ['paddingLeft', 'paddingRight'],
    px: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    py: ['paddingTop', 'paddingBottom'],
    size: ['width', 'height'],
  },
})

const unresponsiveProperties = defineProperties({
  // conditions: {},
  staticProperties: {
    isolation: ['isolate'],
    objectFit: ['contain', 'cover', 'none'],
    pointerEvents: ['none'],
    textTransform: ['capitalize', 'lowercase', 'uppercase'],
    cursor: ['default', 'pointer', 'not-allowed'],
    visibility: ['hidden', 'visible'],
    whiteSpace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'],
    wordBreak: ['break-word'],
    wordWrap: ['normal', 'break-word'],
  },
  shorthands: {},
  dynamicProperties: {
    aspectRatio: {
      auto: 'auto',
      '1/1': '1 / 1',
      '2/1': '2 / 1',
      '4/1': '4 / 1',
      '4/3': '4 / 3',
      '16/9': '16 / 9',
    },
    fontFamily: vars.fonts,
    transitionProperty: {
      none: 'none',
      all: 'all',
      default: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      colors: 'background-color, border-color, color, fill, stroke',
      opacity: 'opacity',
      shadow: 'box-shadow',
      transform: 'transform',
    },
    transitionTimingFunction: {
      linear: 'linear',
      ease: 'ease',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    },
  },
})

const interactiveProperties = defineProperties({
  conditions: {
    base: {},
    hover: { selector: '&:hover' },
    focus: { selector: '&:focus' },
    active: { selector: '&:active' },
  },
  defaultCondition: 'base',
  staticProperties: {
    backgroundColor: vars.colors,
    borderColor: vars.colors,
    color: vars.colors,
    outlineColor: vars.colors,
  },
  dynamicProperties: {
    backgroundColor: vars.colors,
    borderColor: vars.colors,
    color: vars.colors,
    outlineColor: vars.colors,
    transform: true,
    transition: true,
    animation: true,
  },
  shorthands: {
    bg: ['backgroundColor'],
  },
})

export const sprinkles = createRainbowSprinkles(responsiveProperties, unresponsiveProperties, interactiveProperties)
export type Sprinkles = Parameters<typeof sprinkles>[0]

export type OptionalResponsiveObject<Value> = Value | Partial<Record<Breakpoint, Value>>
export type RequiredResponsiveObject<Value> = Partial<Record<Breakpoint, Value>> &
  Record<typeof breakpointNames[0], Value>
