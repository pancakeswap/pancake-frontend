import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import useSushi from 'hooks/useSushi'
import useTokenBalance from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { getSushiAddress } from 'sushi/utils'
import { getBalanceNumber } from 'utils/formatBalance'
import CardValue from 'components/Card/CardValue'

const Label = styled(Text)`
  color: ${({ theme }) => theme.colors.textDisabled};
`

const CakeWalletBalance = () => {
  const TranslateString = useI18n()
  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))
  const { account } = useWallet()

  if (!account || !sushi) {
    return <Label>{TranslateString(298, 'Locked')}</Label>
  }

  return <CardValue value={getBalanceNumber(sushiBalance)} fontSize="24px" />
}

export default CakeWalletBalance
