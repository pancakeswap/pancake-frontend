/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from '@pancakeswap/position-managers'
import { Card, CardBody, Flex, Text } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { ReactNode, memo, PropsWithChildren, useMemo } from 'react'

import { CardHeader } from './CardLayout'
import { FeeTag, FarmTag } from './Tags'
import { TokenPairLogos } from './TokenPairLogos'

interface Props {
  currencyA: Currency
  currencyB: Currency
  name: string
  id: string | number
  feeTier: FeeAmount

  autoFarm?: boolean
  autoCompound?: boolean
  strategy: Strategy
  manager?: ReactNode
  info?: ReactNode
}

export const DuoTokenVaultCard = memo(function DuoTokenVaultCard({
  children,
  currencyA,
  currencyB,
  name,
  id,
  feeTier,
  autoFarm,
  autoCompound,
}: PropsWithChildren<Props>) {
  const tokenPairName = useMemo(() => `${currencyA.symbol}-${currencyB.symbol}`, [currencyA, currencyB])
  const vaultReadableId = useMemo(() => `(${name}#${id})`, [name, id])

  return (
    <Card>
      <CardHeader>
        <TokenPairLogos currencyA={currencyA} currencyB={currencyB} autoMark={autoCompound} />
        <Flex flexDirection="column" justifyContent="flex-start">
          <Flex flexDirection="row" justifyContent="flex-end">
            <Text fontSize="1.5em" bold>
              {tokenPairName}
            </Text>
            <Text ml="0.25em" fontSize="1.5em">
              {vaultReadableId}
            </Text>
          </Flex>
          <Flex flexDirection="row" justifyContent="flex-end" mt="0.25em">
            <FeeTag feeAmount={feeTier} />
            {autoFarm && <FarmTag ml="0.5em" />}
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
})
