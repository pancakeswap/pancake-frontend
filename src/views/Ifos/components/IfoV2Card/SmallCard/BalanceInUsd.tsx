import React from 'react'
import { Box, Text } from '@pancakeswap-libs/uikit'
import { useGetApiPrice } from 'state/hooks'

interface BalanceInUsdProps {
  token: string
  balance: number
}

const BalanceInUsd: React.FC<BalanceInUsdProps> = ({ token, balance }) => {
  const priceInUsd = useGetApiPrice(token)
  const hasBalance = !!priceInUsd && balance > 0
  const total = priceInUsd * balance

  return (
    <Box minHeight="18px">
      <Text color="textSubtle" fontSize="12px">
        {hasBalance && `~$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      </Text>
    </Box>
  )
}

export default BalanceInUsd
