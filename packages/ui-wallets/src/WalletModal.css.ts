import { responsiveStyle } from '@pancakeswap/ui/css/responsiveStyle'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const modalWrapperClass = style([
  style({
    display: 'flex',
    height: '490px',
    marginBottom: '50px',
  }),
  responsiveStyle({
    xs: {
      width: '100%',
    },
    lg: {
      width: '792px',
    },
  }),
])

export const desktopWalletSelectionClass = style(
  responsiveStyle({
    xs: {
      maxWidth: '360px',
    },
    lg: {
      maxWidth: '408px',
    },
  }),
)

export const walletSelectWrapperClass = style(
  responsiveStyle({
    xs: {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      rowGap: '24px',
      columnGap: '16px',
    },
    sm: {
      gridTemplateColumns: '1fr 1fr',
    },
    lg: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  }),
)

export const walletButtonVariants = recipe({
  base: {
    borderRadius: 12,
  },
  variants: {
    selected: {
      true: {
        background: '#7645D9',
        opacity: 0.5,
      },
    },
  },
})
