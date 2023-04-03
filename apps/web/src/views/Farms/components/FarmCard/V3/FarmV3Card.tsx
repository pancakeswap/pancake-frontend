import { useTranslation } from '@pancakeswap/localization'
import { Card, ExpandableSectionButton, Farm as FarmUI, Flex, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useMemo, useState } from 'react'
import { multiChainPaths } from 'state/info/constant'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { V3Farm } from 'views/Farms/FarmsV3'
import CardHeading from '../CardHeading'
import CardActionsContainer from './CardActionsContainer'
import { FarmV3ApyButton } from './FarmV3ApyButton'

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
  farm: V3Farm
  removed: boolean
  cakePrice?: BigNumber
  account?: string
}

export const FarmV3Card: React.FC<React.PropsWithChildren<FarmCardProps>> = ({
  farm,
  removed,
  // cakePrice,
  account,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const lpLabel = farm.lpSymbol && farm.lpSymbol.replace(/pancake/gi, '')
  const earnLabel = t('CAKE + Fees')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
    chainId,
    feeAmount: farm.feeAmount,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const { lpAddress } = farm
  const isPromotedFarm = farm.token.symbol === 'CAKE'

  const infoUrl = useMemo(() => {
    return `/info/v3${multiChainPaths[chainId]}/pools/${lpAddress}?chain=${CHAIN_QUERY_NAME[chainId]}`
  }, [chainId, lpAddress])

  const toggleExpandableSection = useCallback(() => {
    setShowExpandableSection((prev) => !prev)
  }, [])

  const aprTooltip = useTooltip(
    <>
      <Text>
        {t(
          'Global APR calculated using the total amount of active & staked liquidity with the pool CAKE reward emissions.',
        )}
      </Text>
      <br />
      <Text>{t('APRs for individual positions may vary depend on their price range settings.')}</Text>
    </>,
  )

  return (
    <StyledCard isActive={isPromotedFarm}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          token={farm.token}
          quoteToken={farm.quoteToken}
          version={3}
          feeAmount={farm.feeAmount}
        />
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center">
            <TooltipText ref={aprTooltip.targetRef}>{t('APR')}:</TooltipText>
            {aprTooltip.tooltipVisible && aprTooltip.tooltip}
            <Text style={{ display: 'flex', alignItems: 'center' }}>
              <FarmV3ApyButton farm={farm} />
            </Text>
          </Flex>
        )}
        <Flex justifyContent="space-between">
          <Text>{t('Earn')}:</Text>
          <Text>{earnLabel}</Text>
        </Flex>
        <CardActionsContainer farm={farm} lpLabel={lpLabel} account={account} />
      </FarmCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton onClick={toggleExpandableSection} expanded={showExpandableSection} />
        {showExpandableSection && (
          <DetailsSection
            removed={removed}
            scanAddressLink={getBlockExploreLink(lpAddress, 'address', chainId)}
            infoAddress={infoUrl}
            totalValueFormatted={`$${parseInt(farm.activeTvlUSD).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`}
            totalValueLabel="Staked Liquidity"
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
            isCommunity={false}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}
