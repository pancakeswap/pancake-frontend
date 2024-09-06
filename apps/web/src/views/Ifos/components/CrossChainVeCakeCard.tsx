import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { CAKE } from '@pancakeswap/tokens'
import { Box } from '@pancakeswap/uikit'
import { formatBigInt, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Ifo } from '@pancakeswap/widgets-internal'
import { useMemo, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'

// TODO should be common hooks
import { useIsMigratedToVeCake } from 'views/CakeStaking/hooks/useIsMigratedToVeCake'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'

import { BigNumber as BN } from 'bignumber.js'
import { CrossChainVeCakeModal } from 'components/CrossChainVeCakeModal'
import { ArbitrumIcon, BinanceIcon, EthereumIcon, ZKsyncIcon } from 'components/CrossChainVeCakeModal/ChainLogos'
import { useMultichainVeCakeWellSynced } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import { useActiveIfoConfig } from 'hooks/useIfoConfig'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import styled from 'styled-components'
import { useUserIfoInfo } from '../hooks/useUserIfoInfo'

const TwoColumns = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const GradientCard = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  border-radius: ${({ theme }) => theme.radii.default};
`

const GreyCard = styled(Box)`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: ${({ theme }) => theme.radii.default};
`

const LogoWrapper = styled(Box)`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  background: #280d5f;
  border-radius: 8px;
`

const ChainLogoMap = {
  [ChainId.BSC]: <BinanceIcon />,
  [ChainId.ETHEREUM]: <EthereumIcon width={16} />,
  [ChainId.ARBITRUM_ONE]: <ArbitrumIcon width={24} height={24} />,
  [ChainId.ZKSYNC]: <ZKsyncIcon width={16} />,
}

const ChainNameMap = {
  [ChainId.BSC]: 'BSC',
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.ARBITRUM_ONE]: 'Arbitrum',
  [ChainId.ZKSYNC]: 'ZKSync',
}

type Props = {
  ifoAddress?: Address
}

export function CrossChainVeCakeCard({ ifoAddress }: Props) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { activeIfo } = useActiveIfoConfig()

  const targetChainId = useMemo(() => activeIfo?.chainId || chainId, [activeIfo, chainId])

  const { isConnected } = useAccount()
  const cakePrice = useCakePrice()
  const isUserDelegated = useIsUserDelegated()

  const [isOpen, setIsOpen] = useState(false)

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

  // Re-think logic for this and if this is needed or something already exists for it (isVeCakeWillSync?)
  const needToSyncVeCake = useMemo(() => veCakeOnBSC.gt(veCakeOnTargetChain), [veCakeOnBSC, veCakeOnTargetChain])

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
        <Ifo.NoVeCakeCard />
      )}

      {isConnected && hasVeCakeOnBSC && (
        <>
          <Ifo.CrossChainMyVeCake
            mt="16px"
            chainId={targetChainId}
            veCakeAmount={veCakeOnTargetChainFormatted}
            needToSyncVeCake={needToSyncVeCake}
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
      {/* {isConnected ? <NavigateButton mt="1.5rem" /> : <ConnectWalletButton width="100%" mt="1.5rem" />} */}
      {!isConnected && <ConnectWalletButton width="100%" mt="1.5rem" />}
    </Ifo.VeCakeCard>
  )
}
