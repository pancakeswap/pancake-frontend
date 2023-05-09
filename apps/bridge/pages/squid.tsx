import React from 'react'
import { SquidWidget } from '@0xsquid/widget'
import { AppConfig } from '@0xsquid/widget/widget/core/types/config'
import { Box } from '@pancakeswap/uikit'
import PageContainer from 'components/Page'

const config = {
  companyName: 'Test Widget',
  slippage: 1.5,
  instantExec: true,
  infiniteApproval: false,
  style: {
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
  },
  mainLogoUrl: '',
  apiUrl: 'https://api.squidrouter.com',
  // apiUrl: "https://dev.api.0xsquid.com",
} as unknown as AppConfig

const Squid = () => {
  return (
    <PageContainer>
      <Box width={['100%', null, '420px']} m="auto">
        <SquidWidget config={config} />
      </Box>
    </PageContainer>
  )
}

export default Squid
