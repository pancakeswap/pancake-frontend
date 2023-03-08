import { useTranslation } from '@pancakeswap/localization'
import {
  Farm as FarmUI,
  FarmTableLiquidityProps,
  FarmTableMultiplierProps,
  LinkExternal,
  Text,
  useMatchBreakpoints,
  Flex,
} from '@pancakeswap/uikit'

import { FarmWithStakedValue } from '@pancakeswap/farms'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { multiChainPaths } from 'state/info/constant'
import styled, { css, keyframes } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import WalletNotConnected from 'views/Farms/components/FarmTable/V3/Actions/WalletNotConnected'
import FarmV3TableAction from 'views/Farms/components/FarmTable/V3/Actions/FarmV3TableAction'
import Apr, { AprProps } from '../../Apr'

const { Multiplier, Liquidity } = FarmUI.FarmTable

export interface ActionPanelProps {
  apr: AprProps
  multiplier: FarmTableMultiplierProps
  liquidity: FarmTableLiquidityProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
  alignLinksToRight?: boolean
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 10000px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 10000px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded }>`
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

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    flex-wrap: wrap;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;

  ${({ theme }) => theme.mediaQueries.lg} {
    align-self: flex-start;
  }
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
  expanded,
  alignLinksToRight = true,
}) => {
  const { chainId } = useActiveChainId()
  const { account } = useActiveWeb3React()
  const farm = details
  const hasNoPosition = false // TODO: FARM_V3

  const { isDesktop } = useMatchBreakpoints()

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const isActive = farm.multiplier !== '0X'
  const { quoteToken, token, stableSwapAddress } = farm
  const lpLabel = farm.lpSymbol && farm.lpSymbol.replace(/pancake/gi, '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
    chainId,
  })
  const { lpAddress } = farm
  const bsc = getBlockExploreLink(lpAddress, 'address', chainId)

  const infoUrl = useMemo(() => {
    if (farm.isStable) {
      return `/info${multiChainPaths[chainId]}/pairs/${stableSwapAddress}?type=stableSwap&chain=${CHAIN_QUERY_NAME[chainId]}`
    }
    return `/info${multiChainPaths[chainId]}/pairs/${lpAddress}?chain=${CHAIN_QUERY_NAME[chainId]}`
  }, [chainId, farm.isStable, lpAddress, stableSwapAddress])

  return (
    <Container expanded={expanded}>
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
                <Apr {...apr} useTooltipText={false} boosted={farm.boosted} />
              </ValueWrapper>
              <ValueWrapper>
                <Text>{t('Multiplier')}</Text>
                <Multiplier {...multiplier} />
              </ValueWrapper>
              <ValueWrapper>
                <Text>{t('Liquidity')}</Text>
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
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <StyledLinkExternal href={infoUrl}>{t('See Pair Info')}</StyledLinkExternal>
        </Flex>
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <StyledLinkExternal isBscScan href={bsc}>
            {t('View Contract')}
          </StyledLinkExternal>
        </Flex>
      </InfoContainer>
      <ActionContainer>
        {account && !hasNoPosition ? (
          <Flex flexDirection="column">
            <FarmV3TableAction title={t('%totalStakedFarm% Staked Farming', { totalStakedFarm: 2 })} farm={farm} />
            <FarmV3TableAction
              title={t('%totalAvailableFarm% LP Available for Farming', { totalAvailableFarm: 2 })}
              farm={farm}
            />
          </Flex>
        ) : (
          <WalletNotConnected
            farm={farm}
            account={account}
            hasNoPosition={hasNoPosition}
            liquidityUrlPathParts={`/add/${liquidityUrlPathParts}`}
          />
        )}
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
