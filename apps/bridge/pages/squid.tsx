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

const Squid = () => {
  const theme = useTheme()

  const config = useMemo(() => {
    const style = (theme as PancakeTheme).isDark ? darkStyle : lightStyle
    return {
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
      <Box width={['100%', null, '420px']} m="auto">
        <SquidWidget config={config} />
      </Box>
    </PageContainer>
  )
}

export default Squid
