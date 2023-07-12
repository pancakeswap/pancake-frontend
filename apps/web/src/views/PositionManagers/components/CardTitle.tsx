import { memo, useMemo } from 'react'
import { Currency } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Flex, Text } from '@pancakeswap/uikit'

import { CardHeader } from './CardLayout'
import { TokenPairLogos } from './TokenPairLogos'
import { FeeTag, FarmTag } from './Tags'

interface Props {
  currencyA: Currency
  currencyB: Currency
  vaultName: string
  feeTier: FeeAmount

  autoFarm?: boolean
  autoCompound?: boolean
}

export const CardTitle = memo(function CardTitle({
  currencyA,
  currencyB,
  vaultName,
  feeTier,
  autoFarm,
  autoCompound,
}: Props) {
  const tokenPairName = useMemo(() => `${currencyA.symbol}-${currencyB.symbol}`, [currencyA, currencyB])

  return (
    <CardHeader>
      <TokenPairLogos currencyA={currencyA} currencyB={currencyB} autoMark={autoCompound} />
      <Flex flexDirection="column" justifyContent="flex-start">
        <Flex flexDirection="row" justifyContent="flex-end">
          <Text fontSize="1.5em" bold>
            {tokenPairName}
          </Text>
          <Text ml="0.25em" fontSize="1.5em">
            {vaultName}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="flex-end" mt="0.25em">
          <FeeTag feeAmount={feeTier} />
          {autoFarm && <FarmTag ml="0.5em" />}
        </Flex>
      </Flex>
    </CardHeader>
  )
})
