import { modeVars } from '@pancakeswap/ui/css/vars.css'
import { tokens } from '@pancakeswap/ui/tokens'
import { createGlobalTheme } from '@vanilla-extract/css'

createGlobalTheme('[data-theme="light"]', modeVars, {
  colors: {
    ...tokens.colors.light,
    gradientBubblegum: 'linear-gradient(180deg, #F7F7F8 22.88%, #D6F2EB 99.79%, #2ED8A7 99.87%, #00A380 100%);',
  },
})
