import { useMemo } from 'react'
import { SquidWidget } from '@0xsquid/widget'
import { AppConfig } from '@0xsquid/widget/widget/core/types/config'
import { Box, PancakeTheme } from '@pancakeswap/uikit'
import { useTheme } from 'styled-components'
import PageContainer from 'components/Page'

const lightStyle = {
  neutralContent: '#7a6eaa',
  baseContent: '#280d5f',
  base100: '#eeeaf4',
  base200: '#ffffff',
  base300: '#ffffff',
  error: '#ed4b9e',
  warning: '#ffb237',
  success: '#31d0aa',
  primary: '#1fc7d4',
  secondary: '#1fc7d4',
  secondaryContent: '#280d5f',
  neutral: '#FFFFFF',
  roundedBtn: '26px',
  roundedBox: '1rem',
  roundedDropDown: '20rem',
  displayDivider: false,
}

const darkStyle = {
  neutralContent: '#b8add2',
  baseContent: '#ffffff',
  base100: '#372f47',
  base200: '#26272c',
  base300: '#26272c',
  error: '#ed4b9e',
  warning: '#ffb237',
  success: '#31d0aa',
  primary: '#1fc7d4',
  secondary: '#1fc7d4',
  secondaryContent: '#280d5f',
  neutral: '#26272c',
  roundedBtn: '26px',
  roundedBox: '1rem',
  roundedDropDown: '20rem',
  displayDivider: false,
}

const Axelar = () => {
  const theme = useTheme()

  const config = useMemo(() => {
    const style = (theme as PancakeTheme).isDark ? darkStyle : lightStyle
    return {
      integratorId: 'squid-swap-pancakeswap',
      slippage: 1.5,
      instantExec: true,
      infiniteApproval: false,
      style,
      mainLogoUrl: '',
      hideAnimations: true,
      apiUrl: 'https://api.squidrouter.com',
      // apiUrl: "https://dev.api.0xsquid.com",
    } as unknown as AppConfig
  }, [theme])

  return (
    <PageContainer>
      <style jsx global>{`
        #squid-header-title {
          font-weight: 600 !important;
        }

        button > svg {
          width: 16px;
        }

        [data-theme='light'] {
          .tw-dsw-toggle-secondary:not(:checked) {
            box-shadow: calc(1.5rem * -1) 0 0 2px #efebf4 inset, 0 0 0 2px #efebf4 inset, 0 0 !important;
          }

          .tw-flex ul li > span:first-child,
          .tw-flex ul li > span:first-child a,
          .tw-rounded-t-box.tw-flex.tw-flex-col span.tw-flex.tw-flex-row.tw-items-center:first-child {
            color: #7645d9 !important;
            font-weight: 600 !important;
          }
        }

        [data-theme='dark'] {
          .tw-dsw-toggle-secondary:not(:checked) {
            box-shadow: calc(1.5rem * -1) 0 0 2px #372f46 inset, 0 0 0 2px #372f46 inset, 0 0 !important;
          }

          .tw-flex ul li > span:first-child,
          .tw-flex ul li > span:first-child a,
          .tw-rounded-t-box.tw-flex.tw-flex-col span.tw-flex.tw-flex-row.tw-items-center:first-child {
            color: #a881fc !important;
            font-weight: 600 !important;
          }
        }
      `}</style>

      <Box width={['100%', '420px']} m="auto">
        <SquidWidget config={config} />
      </Box>
    </PageContainer>
  )
}

export default Axelar
