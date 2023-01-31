import { recipe } from '@vanilla-extract/recipes'

export const aptosLogoClass = recipe({
  base: {
    opacity: 1,
    borderRadius: '50%',
  },
  variants: {
    isProduction: {
      false: {
        opacity: 0.35,
        border: 'solid 2px #7645D9',
      },
    },
  },
})
