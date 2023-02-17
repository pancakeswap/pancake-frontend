import { Currency } from '@pancakeswap/sdk'
import { useContext } from 'react'
import { Box } from '@pancakeswap/uikit'

import AccessRisk from 'views/Swap/components/AccessRisk'

import { SwapFeaturesContext } from '../../SwapFeaturesContext'

interface Props {
  currency?: Currency
}

export function RiskCheck({ currency }: Props) {
  const { isAccessTokenSupported } = useContext(SwapFeaturesContext)

  if (!isAccessTokenSupported || !currency?.isToken) {
    return null
  }

  return (
    <Box>
      <AccessRisk token={currency} />
    </Box>
  )
}
