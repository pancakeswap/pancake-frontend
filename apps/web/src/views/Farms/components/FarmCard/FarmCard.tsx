import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Card, ExpandableSectionButton, Flex, Skeleton, Text, useModalV2 } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useMemo, useState } from 'react'
import { multiChainPaths } from 'state/info/constant'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { AddLiquidityV3Modal } from 'views/AddLiquidityV3/Modal'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import { useBCakeBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBCakeV3Info'
import { useFarmV2Multiplier } from 'views/Farms/hooks/useFarmV2Multiplier'
import { RewardPerDay } from 'views/PositionManagers/components/RewardPerDay'
import ApyButton from './ApyButton'
import CardActionsContainer from './CardActionsContainer'
import CardHeading from './CardHeading'

const { DetailsSection } = FarmWidget.FarmCard

const StyledCard = styled(Card)`
  align-self: baseline;
  max-width: 100%;
  margin: 0 0 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

const ExpandingWrapper = styled.div`
  padding: 24px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  displayApr: string | null
  removed: boolean
  cakePrice?: BigNumber
  account?: string
  originalLiquidity?: BigNumber
}

const FarmCard: React.FC<React.PropsWithChildren<FarmCardProps>> = ({
  farm,
  displayApr,
  removed,
  cakePrice,
  account,
  originalLiquidity,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const { totalMultipliers, getFarmCakePerSecond, getNumberFarmCakePerSecond } = useFarmV2Multiplier()
  const isBooster = Boolean(farm.bCakeWrapperAddress)
  const farmCakePerSecond = getFarmCakePerSecond(farm.poolWeight)
  const numberFarmCakePerSecond = isBooster
    ? farm?.bCakePublicData?.rewardPerSecond ?? 0
    : getNumberFarmCakePerSecond(farm.poolWeight)
  // if (farm.pid === 163 || farm.pid === 2) console.log(farm, '888')
  const { locked } = useBCakeBoostLimitAndLockInfo()

  const liquidity =
    farm?.liquidity && originalLiquidity?.gt(0) ? farm.liquidity.plus(originalLiquidity) : farm.liquidity

  const totalValueFormatted =
    liquidity && liquidity.gt(0)
      ? `$${liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = farm.lpSymbol && farm.lpSymbol.replace(/pancake/gi, '')
  const earnLabel = t('CAKE + Fees')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
    chainId: farm.token.chainId,
  })

  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/v2/${liquidityUrlPathParts}`
  const { lpAddress, stableSwapAddress, stableLpFee } = farm
  const isPromotedFarm = farm.token.symbol === 'CAKE'

  const infoUrl = useMemo(() => {
    if (farm.isStable) {
      return `/info${multiChainPaths[farm.token.chainId]}/pairs/${stableSwapAddress}?type=stableSwap&chain=${
        CHAIN_QUERY_NAME[farm.token.chainId]
      }`
    }
    return `/info${multiChainPaths[farm.token.chainId]}/pairs/${lpAddress}?chain=${
      CHAIN_QUERY_NAME[farm.token.chainId]
    }`
  }, [farm, lpAddress, stableSwapAddress])

  const toggleExpandableSection = useCallback(() => {
    setShowExpandableSection((prev) => !prev)
  }, [])

  const addLiquidityModal = useModalV2()

  return (
    <StyledCard isActive={isPromotedFarm}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
          boosted={false}
          isStable={farm.isStable}
          version={2}
          pid={farm.pid}
          farmCakePerSecond={farmCakePerSecond}
          totalMultipliers={totalMultipliers}
          isBooster={isBooster && farm?.bCakePublicData?.isRewardInRange}
        />
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text>{t('APR')}:</Text>
            <Text style={{ display: 'flex', alignItems: 'center' }}>
              {farm.apr ? (
                <>
                  {/* {farm.boosted ? (
                    <BoostedApr
                      mr="4px"
                      lpRewardsApr={farm.lpRewardsApr}
                      apr={farm.apr}
                      pid={farm?.pid}
                      lpTotalSupply={farm.lpTotalSupply}
                      userBalanceInFarm={
                        (stakedBalance.plus(tokenBalance).gt(0)
                          ? stakedBalance?.plus(tokenBalance)
                          : proxy?.stakedBalance.plus(proxy?.tokenBalance)) ?? BIG_ZERO
                      }
                    />
                  ) : null} */}
                  <ApyButton
                    variant="text-and-button"
                    pid={farm.pid}
                    lpTokenPrice={farm.lpTokenPrice}
                    lpSymbol={farm.lpSymbol}
                    multiplier={farm.multiplier}
                    lpLabel={lpLabel}
                    addLiquidityUrl={addLiquidityUrl}
                    cakePrice={cakePrice}
                    apr={
                      (isBooster && farm.bCakePublicData?.rewardPerSecond === 0) ||
                      !farm?.bCakePublicData?.isRewardInRange
                        ? 0
                        : farm.apr
                    }
                    displayApr={displayApr ?? undefined}
                    lpRewardsApr={farm.lpRewardsApr}
                    isBooster={isBooster && farm?.bCakePublicData?.isRewardInRange}
                    useTooltipText
                    stableSwapAddress={stableSwapAddress}
                    stableLpFee={stableLpFee}
                    farmCakePerSecond={farmCakePerSecond}
                    totalMultipliers={totalMultipliers}
                    boosterMultiplier={
                      isBooster
                        ? farm?.bCakeUserData?.boosterMultiplier === 0 ||
                          farm?.bCakeUserData?.stakedBalance.eq(0) ||
                          !locked
                          ? 2.5
                          : farm?.bCakeUserData?.boosterMultiplier
                        : 1
                    }
                  />
                </>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}
        <Flex justifyContent="space-between">
          <Text>{t('Earn')}:</Text>
          <Text>{earnLabel}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Reward/Day')}:</Text>
          <RewardPerDay rewardPerSec={Number(numberFarmCakePerSecond)} />
        </Flex>
        <CardActionsContainer
          farm={farm}
          lpLabel={lpLabel}
          account={account}
          addLiquidityUrl={addLiquidityUrl}
          displayApr={displayApr}
          boosterMultiplier={isBooster ? farm.bCakeUserData?.boosterMultiplier ?? 1 : 1}
        />
      </FarmCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton onClick={toggleExpandableSection} expanded={showExpandableSection} />
        {showExpandableSection && (
          <>
            <AddLiquidityV3Modal
              {...addLiquidityModal}
              currency0={unwrappedToken(farm.token)}
              currency1={unwrappedToken(farm.quoteToken)}
              preferredSelectType={farm.isStable ? SELECTOR_TYPE.STABLE : SELECTOR_TYPE.V2}
            />
            <DetailsSection
              removed={removed}
              scanAddress={{ link: getBlockExploreLink(lpAddress, 'address', chainId), chainId }}
              infoAddress={infoUrl}
              totalValueFormatted={totalValueFormatted}
              lpLabel={lpLabel}
              onAddLiquidity={addLiquidityModal.onOpen}
              isCommunity={farm.isCommunity}
              auctionHostingEndDate={farm.auctionHostingEndDate}
              multiplier={farm.multiplier}
              farmCakePerSecond={farmCakePerSecond}
              totalMultipliers={totalMultipliers}
            />
          </>
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default FarmCard
