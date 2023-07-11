/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from '@pancakeswap/position-managers'
import { Card, CardBody } from '@pancakeswap/uikit'
import { Currency, Percent } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { ReactNode, memo, PropsWithChildren } from 'react'

import { CardTitle } from './CardTitle'
import { YieldInfo } from './YieldInfo'

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
  currencyA,
  currencyB,
  name,
  id,
  feeTier,
  autoFarm,
  autoCompound,
}: PropsWithChildren<Props>) {
  const mockApr = new Percent(2233, 10000)
  const mockCmpApr = new Percent(1122, 10000)

  return (
    <Card>
      <CardTitle
        currencyA={currencyA}
        currencyB={currencyB}
        name={name}
        id={id}
        feeTier={feeTier}
        autoFarm={autoFarm}
        autoCompound={autoCompound}
      />
      <CardBody>
        <YieldInfo boostedApr={mockApr} apr={mockCmpApr} autoCompound={autoCompound} />
      </CardBody>
    </Card>
  )
})
