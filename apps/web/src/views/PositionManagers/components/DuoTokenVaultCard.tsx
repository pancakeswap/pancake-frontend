/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from '@pancakeswap/position-managers'
import { Card, CardBody, Heading } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { ReactNode, memo, PropsWithChildren, useMemo } from 'react'

import { TokenPairImage } from 'components/TokenImage'

import { CardHeader } from './CardLayout'

interface Props {
  currencyA: Currency
  currencyB: Currency
  name: string

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
}: PropsWithChildren<Props>) {
  const tokenPairName = useMemo(() => `${currencyA.symbol}-${currencyB.symbol}`, [currencyA, currencyB])

  return (
    <Card>
      <CardHeader>
        <TokenPairImage
          variant="inverted"
          primaryToken={currencyA.wrapped}
          secondaryToken={currencyB.wrapped}
          width={64}
          height={64}
        />
        <Heading>{tokenPairName}</Heading>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
})
