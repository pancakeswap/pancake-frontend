import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Card, ExpandableSectionButton, Farm as FarmUI, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useMemo, useState } from 'react'
import { multiChainPaths } from 'state/info/constant'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import ApyButton from './ApyButton'
import CardActionsContainer from './CardActionsContainer'
import CardHeading from './CardHeading'

import BoostedApr from '../YieldBooster/components/BoostedApr'

const { DetailsSection } = FarmUI.FarmCard

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
  displayApr: string
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

  const liquidity =
    farm?.liquidity && originalLiquidity?.gt(0) ? farm.liquidity.plus(originalLiquidity) : farm.liquidity

  const totalValueFormatted =
    liquidity && liquidity.gt(0)
      ? `$${liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = farm.lpSymbol && farm.lpSymbol.replace(/pancake/gi, '')
  const earnLabel = farm.dual ? farm.dual.earnLabel : t('CAKE + Fees')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
    chainId,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const { lpAddress, stableSwapAddress, stableLpFee } = farm
  const isPromotedFarm = farm.token.symbol === 'CAKE'
  const { stakedBalance, proxy, tokenBalance } = farm.userData

  const infoUrl = useMemo(() => {
    if (farm.isStable) {
      return `/info${multiChainPaths[chainId]}/pairs/${stableSwapAddress}?type=stableSwap&chain=${CHAIN_QUERY_NAME[chainId]}`
    }
    return `/info${multiChainPaths[chainId]}/pairs/${lpAddress}?chain=${CHAIN_QUERY_NAME[chainId]}`
  }, [chainId, farm.isStable, lpAddress, stableSwapAddress])

  const toggleExpandableSection = useCallback(() => {
    setShowExpandableSection((prev) => !prev)
  }, [])

  return (
    <StyledCard isActive={isPromotedFarm}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
          boosted={farm.boosted}
          isStable={farm.isStable}
        />
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text>{t('APR')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {farm.apr ? (
                <>
                  {farm.boosted ? (
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
                  ) : null}
                  <ApyButton
                    variant="text-and-button"
                    pid={farm.pid}
                    lpTokenPrice={farm.lpTokenPrice}
                    lpSymbol={farm.lpSymbol}
                    multiplier={farm.multiplier}
                    lpLabel={lpLabel}
                    addLiquidityUrl={addLiquidityUrl}
                    cakePrice={cakePrice}
                    apr={farm.apr}
                    displayApr={displayApr}
                    lpRewardsApr={farm.lpRewardsApr}
                    strikethrough={farm.boosted}
                    useTooltipText
                    boosted={farm.boosted}
                    stableSwapAddress={stableSwapAddress}
                    stableLpFee={stableLpFee}
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
          <Text bold>{earnLabel}</Text>
        </Flex>
        <CardActionsContainer
          farm={farm}
          lpLabel={lpLabel}
          account={account}
          addLiquidityUrl={addLiquidityUrl}
          displayApr={displayApr}
        />
      </FarmCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton onClick={toggleExpandableSection} expanded={showExpandableSection} />
        {showExpandableSection && (
          <DetailsSection
            removed={removed}
            scanAddressLink={getBlockExploreLink(lpAddress, 'address', chainId)}
            infoAddress={infoUrl}
            totalValueFormatted={totalValueFormatted}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
            isCommunity={farm.isCommunity}
            auctionHostingEndDate={farm.auctionHostingEndDate}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default FarmCard
