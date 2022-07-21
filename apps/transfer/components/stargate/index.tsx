import { Box, PancakeTheme } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import type {} from 'styled-jsx'
import { FEE_COLLECTOR, FEE_TENTH_BPS, PARTNER_ID } from './config'
import { darkTheme, lightTheme, FontFamily } from './theme'

const stringDarkTheme = JSON.stringify(darkTheme)
const stringLightTheme = JSON.stringify(lightTheme)

export const StargateWidget = ({ theme }: { theme: PancakeTheme }) => {
  const widgetTheme = useMemo(() => {
    return theme.isDark ? stringDarkTheme : stringLightTheme
  }, [theme])

  return (
    <Box width="100%">
      <style jsx global>{`
        .MuiScopedCssBaseline-root {
          background-color: transparent !important;
        }
        .StgHeader {
          border-bottom: 1px solid ${theme.colors.cardBorder} !important;
        }
        .StgHeader .MuiTypography-subtitle1 {
          font-family: ${FontFamily.KANIT};
        }
        .MuiScopedCssBaseline-root .StgMaxButton {
          border-color: ${theme.colors.primary}!important;
          background-color: transparent;
        }
        .MuiFormLabel-root.Mui-focused {
          color: ${theme.colors.text} !important;
        }
      `}</style>
      {/* @ts-ignore */}
      <stargate-widget
        partnerId={PARTNER_ID}
        feeCollector={FEE_COLLECTOR}
        theme={widgetTheme}
        tenthBps={FEE_TENTH_BPS}
      />
    </Box>
  )
}
