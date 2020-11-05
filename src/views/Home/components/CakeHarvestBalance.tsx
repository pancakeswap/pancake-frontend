import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import useAllEarnings from 'hooks/useAllEarnings'
import CardValue from 'components/Card/CardValue'

const Label = styled(Text)`
  color: ${({ theme }) => theme.colors.textDisabled};
`

const CakeHarvestBalance = () => {
  const TranslateString = useI18n()
  const { account } = useWallet()
  const allEarnings = useAllEarnings()
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return (accum += new BigNumber(earning)
      .div(new BigNumber(10).pow(18))
      .toNumber())
  }, 0)

  if (!account) {
    return <Label>{TranslateString(298, 'Locked')}</Label>
  }

  return <CardValue value={earningsSum} />
}

export default CakeHarvestBalance
