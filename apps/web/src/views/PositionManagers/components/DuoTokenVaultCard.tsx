/* eslint-disable @typescript-eslint/no-unused-vars */
import { MANAGER, Strategy } from '@pancakeswap/position-managers'
import { Card, CardBody } from '@pancakeswap/uikit'
import { Currency, Percent, Price } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { ReactNode, memo, PropsWithChildren, useMemo } from 'react'

import { CardTitle } from './CardTitle'
import { YieldInfo } from './YieldInfo'
import { ManagerInfo } from './ManagerInfo'
import { LiquidityManagement } from './LiquidityManagement'
import { getVaultName } from '../utils'
import { ExpandableSection } from './ExpandableSection'
import { VaultInfo } from './VaultInfo'

interface Props {
  currencyA: Currency
  currencyB: Currency
  name: string
  id: string | number
  feeTier: FeeAmount

  strategy: Strategy
  manager: {
    id: MANAGER
    name: string
  }

  autoFarm?: boolean
  autoCompound?: boolean
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
  manager,
  strategy,
}: PropsWithChildren<Props>) {
  // TODO: mock
  const mockApr = new Percent(2233, 10000)
  const mockCmpApr = new Percent(1122, 10000)
  const price = new Price(currencyA, currencyB, 100000n, 100000n)
  const vaultName = useMemo(() => getVaultName(id, name), [name, id])
  const assets = useMemo(
    () => ({
      position: {
        positionId: '1',
        liquidity: 1000n,
        tickUpper: 1,
        tickLower: -1,
      },
    }),
    [currencyA, currencyB],
  )

  return (
    <Card>
      <CardTitle
        currencyA={currencyA}
        currencyB={currencyB}
        vaultName={vaultName}
        feeTier={feeTier}
        autoFarm={autoFarm}
        autoCompound={autoCompound}
      />
      <CardBody>
        <YieldInfo boostedApr={mockApr} apr={mockCmpApr} autoCompound={autoCompound} />
        <ManagerInfo mt="1.5em" id={manager.id} name={manager.name} strategy={strategy} />
        <LiquidityManagement
          currencyA={currencyA}
          currencyB={currencyB}
          price={price}
          vaultName={vaultName}
          feeTier={feeTier}
          assets={assets}
        />
        <ExpandableSection mt="1.5em">
          <VaultInfo />
        </ExpandableSection>
      </CardBody>
    </Card>
  )
})
