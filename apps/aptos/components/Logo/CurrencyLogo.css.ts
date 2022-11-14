import { style } from '@vanilla-extract/css'

export const aptosLogoClass = style({
  selectors: {
    '[data-theme="light"] &': {
      filter: 'invert(1)',
    },
  },
})
