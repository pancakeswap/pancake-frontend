import { ChainId, isTestnetChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { CAKE } from '@pancakeswap/tokens'
import { formatBigInt, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Ifo } from '@pancakeswap/widgets-internal'
import { useCallback, useMemo, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'

// TODO should be common hooks
import { useIsMigratedToVeCake } from 'views/CakeStaking/hooks/useIsMigratedToVeCake'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'

import { CAKE_VAULT_SUPPORTED_CHAINS } from '@pancakeswap/pools'
import { Flex, Text } from '@pancakeswap/uikit'
import { BigNumber as BN } from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { CrossChainVeCakeModal } from 'components/CrossChainVeCakeModal'
import { useUserVeCakeStatus } from 'components/CrossChainVeCakeModal/hooks/useUserVeCakeStatus'
import { useActiveIfoConfig } from 'hooks/useIfoConfig'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useRouter } from 'next/router'
import { logGTMIfoGoToCakeStakingEvent } from 'utils/customGTMEventTracking'
import { useChainNames } from '../hooks/useChainNames'
import { useUserIfoInfo } from '../hooks/useUserIfoInfo'
import { ICakeLogo } from './Icons'
import { NetworkSwitcherModal } from './IfoFoldableCard/IfoPoolCard/NetworkSwitcherModal'

type Props = {
  ifoAddress?: Address
}

export function CrossChainVeCakeCard({ ifoAddress }: Props) {
  const { t } = useTranslation()
  const router = useRouter()

  const { chainId } = useActiveChainId()
  const { isConnected } = useAccount()

  const { activeIfo } = useActiveIfoConfig()

  const targetChainId = useMemo(() => activeIfo?.chainId || chainId, [activeIfo, chainId])

  const cakePrice = useCakePrice()
  const isUserDelegated = useIsUserDelegated()

  const [isOpen, setIsOpen] = useState(false)

  // For "Switch Chain to Stake Cake" Modal
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)
  const supportedChainIds = useMemo(
    () => CAKE_VAULT_SUPPORTED_CHAINS.filter((vaultChainId) => !isTestnetChainId(vaultChainId)),
    [],
  )
  const cakeVaultChainNames = useChainNames(supportedChainIds)

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

  const hasVeCakeOnBSC = useMemo(() => veCakeOnBSC.gt(0), [veCakeOnBSC])

  const { isSynced, isVeCakeSynced } = useUserVeCakeStatus(targetChainId)

  // To be synced for the first time
  const toBeSynced = useMemo(() => veCakeOnBSC.gt(0) && veCakeOnTargetChain.eq(0), [veCakeOnBSC, veCakeOnTargetChain])

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

  const { snapshotTime, credit, veCake, ratio } = useUserIfoInfo({ ifoAddress, chainId: targetChainId })

  const creditBN = useMemo(
    () => credit && new BN(credit.numerator.toString()).div(credit.decimalScale.toString()),
    [credit],
  )

  const hasICake = useMemo(() => creditBN && creditBN.toNumber() > 0, [creditBN])
  const hasVeCake = useMemo(() => veCake && veCake.toNumber() > 0, [veCake])

  const handleSwitchNetworkSuccess = useCallback(() => {
    setIsNetworkModalOpen(false)

    router.push('/cake-staking') // See why this is not working in dev but works in preview links
  }, [router, setIsNetworkModalOpen])

  const header = (
    <>
      <Ifo.MyICake amount={creditBN} />
      <Ifo.IfoSalesLogo hasICake={hasICake} />
    </>
  )

  return (
    <Ifo.VeCakeCard header={header}>
      <span id="sync-vecake" />
      {isConnected && !hasVeCake ? (
        !needMigrate && hasProxyCakeButNoNativeVeCake && !isUserDelegated ? (
          <Ifo.InsufficientNativeVeCakeTips mt="1.5rem" />
        ) : null
      ) : null}
      {needMigrate ? <Ifo.MigrateVeCakeTips mt="1.5rem" /> : null}

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
            onClick={() => {
              setIsNetworkModalOpen(true)
              logGTMIfoGoToCakeStakingEvent()
            }}
            ConnectWalletButton={<ConnectWalletButton width="100%" mt="8px" />}
          />

          <NetworkSwitcherModal
            isOpen={isNetworkModalOpen}
            supportedChains={supportedChainIds}
            title={t('Stake CAKE')}
            description={t('Lock CAKE on %chain% to obtain iCAKE', {
              chain: cakeVaultChainNames,
            })}
            buttonText={t('Switch chain to stake CAKE')}
            tips={
              <>
                <Flex flexDirection="column" justifyContent="flex-start">
                  <ICakeLogo />
                  <Text mt="0.625rem">
                    {t('Stake CAKE to obtain iCAKE - in order to be eligible in this public sale.')}
                  </Text>
                </Flex>
              </>
            }
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
            isSynced={Boolean(isSynced)}
            toBeSynced={toBeSynced}
            isVeCakeSynced={Boolean(isVeCakeSynced)}
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
      <Ifo.ICakeInfo mt="1.5rem" snapshot={snapshotTime} ratio={ratio} />
    </Ifo.VeCakeCard>
  )
}
