import { useTranslation } from '@pancakeswap/localization'
import { Card, FarmMultiplierInfo, Flex, HelpIcon, LinkExternal, Skeleton, Text, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useFarms } from 'state/farms/hook'
import { styled } from 'styled-components'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getDisplayFarmCakePerSecond } from '../getDisplayFarmCakePerSecond'
import ApyButton from './ApyButton'
import CardActionsContainer from './CardActionsContainer'
import CardHeading from './CardHeading'
import { EarnedUsdPrice } from './EarnedUsdPrice'

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

interface FarmCardProps {
  farm: any
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
  const { totalRegularAllocPoint, cakePerBlock } = useFarms()

  const totalMultipliers = totalRegularAllocPoint ? (Number(totalRegularAllocPoint) / 100).toString() : '0'

  const farmCakePerSecond = getDisplayFarmCakePerSecond(farm.poolWeight?.toNumber(), cakePerBlock)

  const liquidity =
    farm?.liquidity && originalLiquidity?.gt(0) ? farm.liquidity.plus(originalLiquidity) : farm.liquidity

  const totalValueFormatted =
    liquidity && liquidity.gt(0)
      ? `$${liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = farm.lpSymbol

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken?.address,
    tokenAddress: farm.token?.address,
  })
  const addLiquidityUrl = `/add/${liquidityUrlPathParts}`
  const isPromotedFarm = farm.token?.symbol === 'CAKE'

  const multiplierTooltipContent = FarmMultiplierInfo({
    farmCakePerSecond: farmCakePerSecond ?? '-',
    totalMultipliers: totalMultipliers ?? '-',
  })

  const { targetRef, tooltip, tooltipVisible } = useTooltip(multiplierTooltipContent, {
    placement: 'bottom',
  })

  const {
    targetRef: totalValueTargetRef,
    tooltip: totalValueTooltip,
    tooltipVisible: totalValueTooltipVisible,
  } = useTooltip(t('Total value of the funds in this farm’s liquidity pair'), {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <StyledCard isActive={isPromotedFarm}>
      <FarmCardInnerContainer>
        <CardHeading
          lpAddress={farm.lpAddress}
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
        />
        <Flex justifyContent="space-between">
          <Text>{t('Earn')}:</Text>
          <EarnedUsdPrice isCardView {...farm} />
        </Flex>
        {!removed && (
          <>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>{t('APR')}:</Text>
              <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                {farm.apr ? (
                  <ApyButton
                    variant="text-and-button"
                    pid={farm.pid}
                    lpAddress={farm.lpAddress}
                    lpTokenPrice={farm.lpTokenPrice}
                    lpSymbol={farm.lpSymbol}
                    multiplier={farm.multiplier}
                    lpLabel={lpLabel}
                    addLiquidityUrl={addLiquidityUrl}
                    cakePrice={cakePrice}
                    apr={farm.apr}
                    displayApr={displayApr}
                    lpRewardsApr={farm.lpRewardsApr}
                    useTooltipText
                    farmCakePerSecond={farmCakePerSecond}
                    totalMultipliers={totalMultipliers}
                    dualTokenRewardApr={farm.dualTokenRewardApr}
                  />
                ) : (
                  <Skeleton height={24} width={80} />
                )}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('Staked Liquidity')}:</Text>
              {totalValueFormatted ? (
                <Flex>
                  <Text>{totalValueFormatted}</Text>
                  {totalValueTooltipVisible && totalValueTooltip}
                  <Flex ref={totalValueTargetRef}>
                    <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                  </Flex>
                </Flex>
              ) : (
                <Skeleton width={75} height={25} />
              )}
            </Flex>
          </>
        )}
        <Flex justifyContent="space-between">
          <Text>{t('Multiplier')}:</Text>
          {farm.multiplier ? (
            <Flex>
              <Text>{farm.multiplier}</Text>
              {tooltipVisible && tooltip}
              <Flex ref={targetRef}>
                <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
              </Flex>
            </Flex>
          ) : (
            <Skeleton width={75} height={25} />
          )}
        </Flex>
        <CardActionsContainer
          farm={farm}
          lpLabel={lpLabel}
          account={account}
          addLiquidityUrl={addLiquidityUrl}
          displayApr={displayApr}
          farmCakePerSecond={farmCakePerSecond}
          totalMultipliers={totalMultipliers}
        />
      </FarmCardInnerContainer>
      <LinkExternal margin="0 auto 24px auto" fontWeight={400} href={addLiquidityUrl}>
        {t('Add %symbol%', { symbol: lpLabel })}
      </LinkExternal>
    </StyledCard>
  )
}

export default FarmCard
