import { Currency } from '@pancakeswap/sdk'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { memo, useMemo } from 'react'

import BoostedTag from 'views/Farms/components/YieldBooster/components/BoostedTag'
import { CardHeader } from '../CardLayout'
import { FeeTag, SingleTokenTag } from '../Tags'
import { TokenPairLogos } from '../TokenPairLogos'

interface Props {
  currencyA: Currency
  currencyB: Currency
  vaultName: string
  feeTier: FeeAmount
  isSingleDepositToken: boolean
  allowDepositToken1: boolean
  autoFarm?: boolean
  autoCompound?: boolean
  isBooster?: boolean
}

export const FarmCell = memo(function CardTitle({
  currencyA,
  currencyB,
  vaultName,
  feeTier,
  isSingleDepositToken,
  autoFarm,
  autoCompound,
  allowDepositToken1,
  isBooster,
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
      <Box style={{ flexShrink: 0 }}>
        <TokenPairLogos
          width={54}
          height={54}
          currencyA={displayCurrencyA}
          currencyB={displayCurrencyB}
          autoMark={autoCompound}
        />
      </Box>
      <Flex flexDirection="row" justifyContent="flex-start">
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          <Text fontSize="1em" bold style={{ whiteSpace: 'nowrap' }}>
            {tokenPairName}
          </Text>
          <Text ml="0.25em" fontSize="1.2em">
            {vaultName}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="flex-end" mt="0.25em" style={{ gap: '0.5em' }} flexWrap="wrap">
          <FeeTag feeAmount={feeTier} />
          {isSingleDepositToken && <SingleTokenTag />}
          {isBooster && <BoostedTag />}
        </Flex>
      </Flex>
    </CardHeader>
  )
})
