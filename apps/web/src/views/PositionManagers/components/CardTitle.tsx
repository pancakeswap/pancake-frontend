import { memo, useMemo } from 'react'
import { Currency } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Flex, Text } from '@pancakeswap/uikit'

import { CardHeader } from './CardLayout'
import { TokenPairLogos } from './TokenPairLogos'
import { FeeTag, FarmTag, SingleTokenTag } from './Tags'

interface Props {
  currencyA: Currency
  currencyB: Currency
  vaultName: string
  feeTier: FeeAmount
  isSingleDepositToken: boolean
  allowDepositToken1: boolean
  autoFarm?: boolean
  autoCompound?: boolean
}

export const CardTitle = memo(function CardTitle({
  currencyA,
  currencyB,
  vaultName,
  feeTier,
  isSingleDepositToken,
  autoFarm,
  autoCompound,
  allowDepositToken1,
}: Props) {
  const isTokenDisplayReverse = useMemo(
    () => isSingleDepositToken && allowDepositToken1,
    [isSingleDepositToken, allowDepositToken1],
  )
  const displayCurrencyA = useMemo(
    () => (isTokenDisplayReverse ? currencyB : currencyA),
    [isTokenDisplayReverse, currencyA, currencyB],
  )
  const displayCurrencyB = useMemo(
    () => (isTokenDisplayReverse ? currencyA : currencyB),
    [isTokenDisplayReverse, currencyA, currencyB],
  )
  const tokenPairName = useMemo(
    () => `${displayCurrencyA.symbol}-${displayCurrencyB.symbol}`,
    [displayCurrencyA, displayCurrencyB],
  )

  return (
    <CardHeader>
      <TokenPairLogos currencyA={displayCurrencyA} currencyB={displayCurrencyB} autoMark={autoCompound} />
      <Flex flexDirection="column" justifyContent="flex-start">
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          <Text fontSize="1.3em" bold style={{ whiteSpace: 'nowrap' }}>
            {tokenPairName}
          </Text>
          <Text ml="0.25em" fontSize="1.2em">
            {vaultName}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="flex-end" mt="0.25em">
          <FeeTag feeAmount={feeTier} />
          {autoFarm && <FarmTag ml="0.5em" />}
          {isSingleDepositToken && <SingleTokenTag ml="0.5em" />}
        </Flex>
      </Flex>
    </CardHeader>
  )
})
