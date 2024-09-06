import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { CAKE } from '@pancakeswap/tokens'
import { formatBigInt, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Ifo } from '@pancakeswap/widgets-internal'
import { useCallback, useMemo, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'

// TODO should be common hooks
import { useIsMigratedToVeCake } from 'views/CakeStaking/hooks/useIsMigratedToVeCake'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'

import { CAKE_VAULT_SUPPORTED_CHAINS } from '@pancakeswap/pools'
import { BigNumber as BN } from 'bignumber.js'
import { CrossChainVeCakeModal } from 'components/CrossChainVeCakeModal'
import { useMultichainVeCakeWellSynced } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import { useActiveIfoConfig } from 'hooks/useIfoConfig'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useRouter } from 'next/router'
import { useChainNames } from '../hooks/useChainNames'
import { useUserIfoInfo } from '../hooks/useUserIfoInfo'
import { NetworkSwitcherModal } from './IfoFoldableCard/IfoPoolCard/NetworkSwitcherModal'

type Props = {
  ifoAddress?: Address
}

export function CrossChainVeCakeCard({ ifoAddress }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const { activeIfo } = useActiveIfoConfig()

  const targetChainId = useMemo(() => activeIfo?.chainId || chainId, [activeIfo, chainId])

  const { isConnected } = useAccount()
  const cakePrice = useCakePrice()
  const isUserDelegated = useIsUserDelegated()

  const [isOpen, setIsOpen] = useState(false)
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)

  const cakeVaultChainNames = useChainNames([ChainId.BSC])

  const {
    cakeUnlockTime: nativeUnlockTime,
    nativeCakeLockedAmount,
    proxyCakeLockedAmount,
    cakePoolLocked: proxyLocked,
    cakePoolUnlockTime: proxyUnlockTime,
    cakeLocked: nativeLocked,
    shouldMigrate,
  } = useCakeLockStatus(ChainId.BSC)

  const { balance: veCakeOnBSC } = useVeCakeBalance(ChainId.BSC)
  const { balance: veCakeOnTargetChain } = useVeCakeBalance(ChainId.ARBITRUM_ONE)

  const veCakeOnBSCFormatted = useMemo(() => getBalanceNumber(veCakeOnBSC, CAKE[ChainId.BSC].decimals), [veCakeOnBSC])
  const veCakeOnTargetChainFormatted = useMemo(
    () => getBalanceNumber(veCakeOnTargetChain, CAKE[targetChainId].decimals),
    [veCakeOnTargetChain, targetChainId],
  )

  const { isVeCakeWillSync } = useMultichainVeCakeWellSynced(targetChainId)

  const hasVeCakeOnBSC = useMemo(() => veCakeOnBSC.gt(0), [veCakeOnBSC])

  const isMigrated = useIsMigratedToVeCake(targetChainId)
  const needMigrate = useMemo(() => shouldMigrate && !isMigrated, [shouldMigrate, isMigrated])
  const totalLockCake = useMemo(
    () =>
      Number(
        formatBigInt(
          isUserDelegated ? nativeCakeLockedAmount : nativeCakeLockedAmount + proxyCakeLockedAmount,
          CAKE[ChainId.BSC].decimals,
        ),
      ),
    [nativeCakeLockedAmount, proxyCakeLockedAmount, isUserDelegated],
  )
  const hasProxyCakeButNoNativeVeCake = useMemo(() => !nativeLocked && proxyLocked, [nativeLocked, proxyLocked])
  const unlockAt = useMemo(() => {
    if (hasProxyCakeButNoNativeVeCake) {
      return proxyUnlockTime
    }
    return nativeUnlockTime
  }, [hasProxyCakeButNoNativeVeCake, nativeUnlockTime, proxyUnlockTime])

  const { snapshotTime, credit, veCake } = useUserIfoInfo({ ifoAddress, chainId: targetChainId })
  const creditBN = useMemo(
    () => credit && new BN(credit.numerator.toString()).div(credit.decimalScale.toString()),
    [credit],
  )
  const hasICake = useMemo(() => creditBN && creditBN.toNumber() > 0, [creditBN])
  const hasVeCake = useMemo(() => veCake && veCake.toNumber() > 0, [veCake])

  const handleSwitchNetworkSuccess = useCallback(() => {
    setIsNetworkModalOpen(false)

    router.push('/cake-staking') // TODO: See why this is not working
  }, [router, setIsNetworkModalOpen])

  const header = (
    <>
      <Ifo.MyICake amount={creditBN} />
      <Ifo.IfoSalesLogo hasICake={hasICake} />
    </>
  )

  return (
    <Ifo.VeCakeCard header={header}>
      {/* {isConnected && !hasVeCake ? (
        !needMigrate && hasProxyCakeButNoNativeVeCake && !isUserDelegated ? (
          <Ifo.InsufficientNativeVeCakeTips mt="1.5rem" />
        ) : (
          <Ifo.ZeroVeCakeTips mt="1.5rem" />
        )
      ) : null}
      {needMigrate ? <Ifo.MigrateVeCakeTips mt="1.5rem" /> : null} */}

      {isConnected && hasVeCakeOnBSC ? (
        <Ifo.CrossChainLockInfoCard
          veCakeAmount={veCakeOnBSCFormatted}
          cakeLocked={totalLockCake}
          usdPrice={cakePrice}
          unlockAt={unlockAt}
        />
      ) : (
        <>
          <Ifo.NoVeCakeCard
            isConnected={isConnected}
            userChainId={chainId}
            nativeChainId={ChainId.BSC}
            onClick={() => setIsNetworkModalOpen(true)}
          />
          <NetworkSwitcherModal
            isOpen={isNetworkModalOpen}
            supportedChains={CAKE_VAULT_SUPPORTED_CHAINS}
            title={t('Stake CAKE')}
            description={t('Lock CAKE on %chain% to obtain iCAKE', {
              chain: cakeVaultChainNames,
            })}
            buttonText={t('Switch chain to stake CAKE')}
            onDismiss={() => setIsNetworkModalOpen(false)}
            onSwitchNetworkSuccess={handleSwitchNetworkSuccess}
          />
        </>
      )}

      {isConnected && hasVeCakeOnBSC && (
        <>
          <Ifo.CrossChainMyVeCake
            mt="16px"
            chainId={targetChainId}
            veCakeAmount={veCakeOnTargetChainFormatted}
            isVeCakeSynced={isVeCakeWillSync}
            onClick={() => setIsOpen(true)}
          />
          <CrossChainVeCakeModal
            targetChainId={targetChainId}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onDismiss={() => setIsOpen(false)}
          />
        </>
      )}
      <Ifo.ICakeInfo mt="1.5rem" snapshot={snapshotTime} />
      {!isConnected && <ConnectWalletButton width="100%" mt="1.5rem" />}
    </Ifo.VeCakeCard>
  )
}
