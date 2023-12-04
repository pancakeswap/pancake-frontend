import { Ifo } from '@pancakeswap/widgets-internal'
import { Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Link from 'next/link'
import { SpaceProps } from 'styled-system'
import { Address } from 'viem'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { CAKE } from '@pancakeswap/tokens'
import { CurrencyAmount } from '@pancakeswap/sdk'

import { useCakePrice } from 'hooks/useCakePrice'
import { useActiveChainId } from 'hooks/useActiveChainId'

// TODO these two hooks should be common hooks
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { useCakePoolLockInfo } from 'views/CakeStaking/hooks/useCakePoolLockInfo'

import { useUserIfoInfo } from '../hooks/useUserIfoInfo'

function NavigateButton(props: SpaceProps) {
  const { t } = useTranslation()

  return (
    <Button width="100%" as={Link} href="/cake-staking" {...props}>
      {t('Go to CAKE Staking')}
    </Button>
  )
}

type Props = {
  ifoAddress?: Address
}

export function VeCakeCard({ ifoAddress }: Props) {
  const { chainId } = useActiveChainId()
  const { lockedAmount, lockEndTime } = useCakePoolLockInfo()
  const { shouldMigrate } = useCakeLockStatus()
  const cakePrice = useCakePrice()
  const lockedAmountBN = useMemo(
    () =>
      chainId &&
      CAKE[chainId] &&
      lockedAmount &&
      new BigNumber(CurrencyAmount.fromRawAmount(CAKE[chainId], lockedAmount).toExact()),
    [chainId, lockedAmount],
  )
  const { snapshotTime, credit, veCake } = useUserIfoInfo({ ifoAddress, chainId })
  const creditBN = useMemo(
    () => credit && new BigNumber(credit.numerator.toString()).div(credit.denominator.toString()),
    [credit],
  )
  const hasICake = useMemo(() => creditBN && creditBN.toNumber() > 0, [creditBN])
  const hasVeCake = useMemo(() => veCake && veCake.toNumber() > 0, [veCake])

  const header = (
    <>
      <Ifo.MyICake amount={creditBN} />
      <Ifo.IfoSalesLogo hasICake={hasICake} />
    </>
  )

  return (
    <Ifo.VeCakeCard header={header}>
      <Ifo.MyVeCake amount={veCake} />
      <Ifo.ICakeInfo mt="1.5rem" snapshot={snapshotTime} />

      {hasICake && lockedAmountBN ? (
        <Ifo.LockInfoCard mt="1.5rem" amount={lockedAmountBN} unlockAt={Number(lockEndTime)} usdPrice={cakePrice} />
      ) : null}

      {!hasVeCake ? <Ifo.ZeroVeCakeTips mt="1.5rem" /> : null}

      {shouldMigrate ? <Ifo.MigrateVeCakeTips mt="1.5rem" /> : null}
      <NavigateButton mt="1.5rem" />
    </Ifo.VeCakeCard>
  )
}
