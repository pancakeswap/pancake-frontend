import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, LinkExternal, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import { getDisplayFarmCakePerSecond } from 'components/Farms/components/getDisplayFarmCakePerSecond'
import { useFarms } from 'state/farms/hook'
import { css, keyframes, styled } from 'styled-components'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'

import Apr, { AprProps } from '../Apr'
import { HarvestActionContainer, TableHarvestAction } from './HarvestAction'
import StakedAction, { StakedContainer } from './StakedAction'

const { Multiplier, Liquidity } = FarmWidget.FarmTable

export interface ActionPanelProps {
  apr: AprProps
  multiplier: FarmWidget.FarmTableMultiplierProps
  liquidity: FarmWidget.FarmTableLiquidityProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
  alignLinksToRight?: boolean
  isLastFarm: boolean
  farmCakePerSecond?: string
  totalMultipliers?: string
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded; isLastFarm }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: center;
    padding: 16px 32px;
  }
  ${({ isLastFarm }) => isLastFarm && `border-radius: 0 0 16px 16px;`}
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    flex-wrap: wrap;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;
`

const ValueContainer = styled.div``

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`

const ActionPanel: React.FunctionComponent<React.PropsWithChildren<ActionPanelProps>> = ({
  details,
  apr,
  multiplier,
  liquidity,
  userDataReady,
  expanded,
  alignLinksToRight = true,
  isLastFarm,
}) => {
  const farm = details
  const { isDesktop } = useMatchBreakpoints()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const isActive = farm.multiplier !== '0X'
  const { quoteToken, token } = farm
  const lpLabel = farm.lpSymbol
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken?.address,
    tokenAddress: token?.address,
  })

  const { totalRegularAllocPoint, cakePerBlock } = useFarms()
  const totalMultipliers = totalRegularAllocPoint ? (Number(totalRegularAllocPoint) / 100).toString() : '0'
  const farmCakePerSecond = getDisplayFarmCakePerSecond(farm.poolWeight?.toNumber(), cakePerBlock)

  return (
    <Container expanded={expanded} isLastFarm={isLastFarm}>
      <InfoContainer>
        <ValueContainer>
          {farm.isCommunity && farm.auctionHostingEndDate && (
            <ValueWrapper>
              <Text>{t('Auction Hosting Ends')}</Text>
              <Text paddingLeft="4px">
                {new Date(farm.auctionHostingEndDate).toLocaleString(locale, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </ValueWrapper>
          )}
          {!isDesktop && (
            <>
              <ValueWrapper>
                <Text>{t('APR')}</Text>
                <Apr {...apr} useTooltipText={false} />
              </ValueWrapper>
              <ValueWrapper>
                <Text>{t('Multiplier')}</Text>
                <Multiplier {...multiplier} />
              </ValueWrapper>
              <ValueWrapper>
                <Text>{t('Staked Liquidity')}</Text>
                <Liquidity {...liquidity} />
              </ValueWrapper>
            </>
          )}
        </ValueContainer>
        {isActive && (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <StakeContainer>
              <StyledLinkExternal href={`/add/${liquidityUrlPathParts}`}>
                {t('Get %symbol%', { symbol: lpLabel })}
              </StyledLinkExternal>
            </StakeContainer>
          </Flex>
        )}
      </InfoContainer>
      <ActionContainer>
        <HarvestActionContainer
          pid={farm.pid}
          lpAddress={farm.lpAddress}
          earnings={farm?.userData?.earnings}
          dual={farm.dual}
          earningsDualTokenBalance={farm?.userData?.earningsDualTokenBalance}
        >
          {(props) => <TableHarvestAction {...props} />}
        </HarvestActionContainer>
        <StakedContainer
          {...farm}
          userDataReady={userDataReady}
          lpLabel={lpLabel}
          displayApr={apr.value}
          farmCakePerSecond={farmCakePerSecond}
          totalMultipliers={totalMultipliers}
        >
          {(props) => <StakedAction {...props} />}
        </StakedContainer>
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
