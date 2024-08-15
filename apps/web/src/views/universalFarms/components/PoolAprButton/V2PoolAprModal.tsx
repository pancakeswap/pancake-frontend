import { Protocol } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { LegacyRouter, LegacyStableSwapPair } from '@pancakeswap/smart-router/legacy-router'
import { ModalV2, RoiCalculatorModal, UseModalV2Props } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import { useAccountPositionDetailByPool } from 'state/farmsV4/hooks'
import { getUniversalBCakeWrapperForPool } from 'state/farmsV4/state/poolApr/fetcher'
import { PoolInfo } from 'state/farmsV4/state/type'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Address, isAddressEqual } from 'viem'
import { useMasterChefV2Data } from 'views/Farms/hooks/useMasterChefV2Data'
import { useV2LpTokenTotalSupply } from 'views/Farms/hooks/useV2LpTokenTotalSupply'
import { useBCakeWrapperRewardPerSecond } from 'views/universalFarms/hooks/useBCakeWrapperInfo'
import { displayApr } from 'views/universalFarms/utils/displayApr'
import { useAccount } from 'wagmi'

type V2PoolAprModalProps = {
  modal: UseModalV2Props
  poolInfo: PoolInfo
  combinedApr: number
  boostMultiplier?: number
  lpApr?: number
}

export const V2PoolAprModal: React.FC<V2PoolAprModalProps> = ({
  modal,
  poolInfo,
  combinedApr,
  boostMultiplier,
  lpApr,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const lpSymbol = useMemo(
    () => (poolInfo ? `${poolInfo?.token0.symbol}-${poolInfo?.token1.symbol} LP` : ''),
    [poolInfo],
  )
  const lpLabel = useMemo(() => {
    return lpSymbol.replace(/pancake/gi, '')
  }, [lpSymbol])
  const { data: userPosition } = useAccountPositionDetailByPool<Protocol.STABLE | Protocol.V2>(
    poolInfo.chainId,
    account,
    poolInfo,
  )

  const stakingTokenBalance = useMemo(() => {
    return BIG_ZERO.plus(userPosition?.farmingBalance?.quotient.toString() ?? 0).plus(
      userPosition?.nativeBalance?.quotient.toString() ?? 0,
    )
  }, [userPosition?.farmingBalance, userPosition?.nativeBalance])

  const { data: lpTokenTotalSupply } = useV2LpTokenTotalSupply(
    poolInfo.lpAddress, // @todo check if stable swap use poolInfo.stableSwapLpAddress
    poolInfo.chainId,
  )
  const lpTokenPrice = useMemo(() => {
    return new BigNumber(poolInfo.tvlUsd ?? 0).div((lpTokenTotalSupply ?? 1).toString()).times(1e18)
  }, [poolInfo.tvlUsd, lpTokenTotalSupply])
  const cakePrice = useCakePrice()

  const addLiquidityUrl = useMemo(() => {
    const liquidityUrlPathParts = getLiquidityUrlPathParts({
      quoteTokenAddress: poolInfo.token0.wrapped.address,
      tokenAddress: poolInfo.token1.address,
      chainId: poolInfo.chainId,
    })
    return `${poolInfo.protocol}/add/${liquidityUrlPathParts}`
  }, [poolInfo.chainId, poolInfo.protocol, poolInfo.token0.wrapped.address, poolInfo.token1.address])

  const stableConfig = useMemo((): LegacyStableSwapPair | undefined => {
    if (poolInfo.protocol === 'stable') {
      return LegacyRouter.stableSwapPairsByChainId[poolInfo.chainId]?.find((pair) => {
        return isAddressEqual(pair.stableSwapAddress, poolInfo?.lpAddress as Address)
      })
    }
    return undefined
  }, [poolInfo.chainId, poolInfo?.lpAddress, poolInfo.protocol])
  const bCakeWrapperAddress = useMemo(() => {
    return getUniversalBCakeWrapperForPool(poolInfo)?.bCakeWrapperAddress
  }, [poolInfo])
  const { data: farmCakePerSecond } = useBCakeWrapperRewardPerSecond(poolInfo.chainId, bCakeWrapperAddress)
  const { data: masterChefV2Data } = useMasterChefV2Data(poolInfo.chainId)
  const totalMultipliers = useMemo(() => {
    const { totalRegularAllocPoint } = masterChefV2Data ?? { totalRegularAllocPoint: 0n }
    const point = totalRegularAllocPoint.toString()
    return Number.isFinite(+point) ? (+point / 10).toString() : '-'
  }, [masterChefV2Data])

  return (
    <ModalV2 {...modal}>
      <RoiCalculatorModal
        account={account}
        pid={poolInfo.pid}
        linkLabel={t('Add %symbol%', { symbol: lpLabel })}
        stakingTokenBalance={stakingTokenBalance}
        stakingTokenDecimals={18}
        stakingTokenSymbol={lpSymbol}
        stakingTokenPrice={lpTokenPrice.toNumber()}
        earningTokenPrice={cakePrice?.toNumber() ?? 0}
        apr={combinedApr * 100}
        multiplier={boostMultiplier ? `${boostMultiplier}X` : undefined}
        displayApr={displayApr(combinedApr)}
        linkHref={addLiquidityUrl}
        lpRewardsApr={(lpApr ?? 0) * 100}
        isFarm={poolInfo.isFarming}
        stableSwapAddress={stableConfig?.stableSwapAddress}
        stableLpFee={stableConfig?.stableLpFee}
        farmCakePerSecond={farmCakePerSecond ? farmCakePerSecond.toString() : '0'}
        totalMultipliers={totalMultipliers}
        isBCakeBooster={poolInfo.isFarming}
      />
    </ModalV2>
  )
}
