import { Ifo } from '@pancakeswap/widgets-internal'
import { ChainId } from '@pancakeswap/chains'
import { Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Link from 'next/link'
import { SpaceProps } from 'styled-system'
import { useAccount } from 'wagmi'
import { Address } from 'viem'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { CAKE } from '@pancakeswap/tokens'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'

import { useCakePrice } from 'hooks/useCakePrice'
import { useActiveChainId } from 'hooks/useActiveChainId'
import ConnectWalletButton from 'components/ConnectWalletButton'

// TODO should be common hooks
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { useIsMigratedToVeCake } from 'views/CakeStaking/hooks/useIsMigratedToVeCake'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'

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
  const { isConnected } = useAccount()
  const cakePrice = useCakePrice()
  const isUserDelegated = useIsUserDelegated()
  const {
    cakeUnlockTime: nativeUnlockTime,
    nativeCakeLockedAmount,
    proxyCakeLockedAmount,
    cakePoolLocked: proxyLocked,
    cakePoolUnlockTime: proxyUnlockTime,
    cakeLocked: nativeLocked,
    shouldMigrate,
  } = useCakeLockStatus()
  const isMigrated = useIsMigratedToVeCake()
  const needMigrate = useMemo(() => shouldMigrate && !isMigrated, [shouldMigrate, isMigrated])
  const totalLockCake = useMemo(
    () =>
      Number(
        formatBigInt(
          isUserDelegated ? nativeCakeLockedAmount : nativeCakeLockedAmount + proxyCakeLockedAmount,
          CAKE[chainId || ChainId.BSC].decimals,
        ),
      ),
    [nativeCakeLockedAmount, proxyCakeLockedAmount, chainId, isUserDelegated],
  )
  const hasProxyCakeButNoNativeVeCake = useMemo(() => !nativeLocked && proxyLocked, [nativeLocked, proxyLocked])
  const unlockAt = useMemo(() => {
    if (hasProxyCakeButNoNativeVeCake) {
      return proxyUnlockTime
    }
    return nativeUnlockTime
  }, [hasProxyCakeButNoNativeVeCake, nativeUnlockTime, proxyUnlockTime])

  const { snapshotTime, credit, veCake } = useUserIfoInfo({ ifoAddress, chainId })
  const creditBN = useMemo(
    () => credit && new BigNumber(credit.numerator.toString()).div(credit.decimalScale.toString()),
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

      {isConnected && hasICake && totalLockCake ? (
        <Ifo.LockInfoCard mt="1.5rem" amount={totalLockCake} unlockAt={unlockAt} usdPrice={cakePrice} />
      ) : null}

      {isConnected && !hasVeCake ? (
        !needMigrate && hasProxyCakeButNoNativeVeCake && !isUserDelegated ? (
          <Ifo.InsufficientNativeVeCakeTips mt="1.5rem" />
        ) : (
          <Ifo.ZeroVeCakeTips mt="1.5rem" />
        )
      ) : null}

      {needMigrate ? <Ifo.MigrateVeCakeTips mt="1.5rem" /> : null}
      {isConnected ? <NavigateButton mt="1.5rem" /> : <ConnectWalletButton width="100%" mt="1.5rem" />}
    </Ifo.VeCakeCard>
  )
}
