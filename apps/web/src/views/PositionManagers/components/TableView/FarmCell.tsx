import { Currency } from '@pancakeswap/sdk'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { memo, useMemo } from 'react'

import BoostedTag from 'views/Farms/components/YieldBooster/components/BoostedTag'
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
    <Flex pl="20px">
      <Box style={{ flexShrink: 0 }} mr="16px">
        <TokenPairLogos
          width={40}
          height={40}
          currencyA={displayCurrencyA}
          currencyB={displayCurrencyB}
          autoMark={autoCompound}
        />
      </Box>
      <Flex flexDirection="row" justifyContent="flex-start" height="100%" alignItems="center">
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center" mr="10px" height="40px">
          <Text fontSize="1em" bold style={{ whiteSpace: 'nowrap' }}>
            {tokenPairName}
          </Text>
          <Text ml="0.25em" fontSize="1.2em">
            {vaultName}
          </Text>
        </Flex>
        <Flex
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
          mt="0.25em"
          style={{ gap: '0.5em' }}
          flexWrap="wrap"
        >
          <FeeTag feeAmount={feeTier} scale="sm" />
          {isSingleDepositToken && <SingleTokenTag scale="sm" />}
          {isBooster && <BoostedTag scale="sm" />}
        </Flex>
      </Flex>
    </Flex>
  )
})
