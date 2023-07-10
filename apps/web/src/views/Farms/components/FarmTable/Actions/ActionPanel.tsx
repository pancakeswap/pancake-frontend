import { useTranslation } from '@pancakeswap/localization'
import {
  FarmTableLiquidityProps,
  FarmTableMultiplierProps,
  Farm as FarmUI,
  Flex,
  Skeleton,
  Text,
  useMatchBreakpoints,
  useModalV2,
  ScanLink,
  LinkExternal,
} from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { FC, useContext, useMemo } from 'react'
import { multiChainPaths } from 'state/info/constant'
import styled, { css, keyframes } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { AddLiquidityV3Modal } from 'views/AddLiquidityV3/Modal'

import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import { V2Farm, V3Farm } from 'views/Farms/FarmsV3'
import { useAccount } from 'wagmi'
import { FarmV3ApyButton } from '../../FarmCard/V3/FarmV3ApyButton'
import FarmV3CardList from '../../FarmCard/V3/FarmV3CardList'
import { YieldBoosterStateContext } from '../../YieldBooster/components/ProxyFarmContainer'
import Apr, { AprProps } from '../Apr'
import { HarvestAction, HarvestActionContainer, ProxyHarvestActionContainer } from './HarvestAction'
import StakedAction, { ProxyStakedContainer, StakedContainer } from './StakedAction'

const { Multiplier, Liquidity, StakedLiquidity } = FarmUI.FarmTable
const { NoPosition } = FarmUI.FarmV3Table

export interface ActionPanelProps {
  apr: AprProps
  multiplier: FarmTableMultiplierProps
  liquidity: FarmTableLiquidityProps
  details: V2Farm
  userDataReady: boolean
  expanded: boolean
  alignLinksToRight?: boolean
}

export interface ActionPanelV3Props {
  apr: {
    value: string
    pid: number
  }
  multiplier: FarmTableMultiplierProps
  stakedLiquidity: FarmTableLiquidityProps
  details: V3Farm
  userDataReady: boolean
  expanded: boolean
  alignLinksToRight?: boolean
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
  padding-top: 24px;
  padding-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: center;
    padding: 16px 24px;
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const StyledScanLink = styled(ScanLink)`
  font-weight: 400;
`

const ActionContainer = styled.div`
  display: flex;
  overflow: auto;
  padding-left: 24px;
  padding-right: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-wrap: wrap;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;
  padding-left: 24px;
  padding-right: 24px;
`

const ValueContainer = styled.div``

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`

const StyledText = styled(Text)`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const ActionPanelContainer = ({ expanded, values, infos, children }) => {
  return (
    <Container expanded={expanded}>
      <InfoContainer>
        <ValueContainer>{values}</ValueContainer>
        {infos}
      </InfoContainer>
      <ActionContainer style={{ maxHeight: 700 }}>{children}</ActionContainer>
    </Container>
  )
}

export const ActionPanelV3: FC<ActionPanelV3Props> = ({
  expanded,
  details,
  multiplier,
  stakedLiquidity,
  alignLinksToRight,
  userDataReady,
}) => {
  const { isDesktop } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const farm = details
  const isActive = farm.multiplier !== '0X'
  const lpLabel = useMemo(() => farm.lpSymbol && farm.lpSymbol.replace(/pancake/gi, ''), [farm.lpSymbol])
  const bsc = useMemo(
    () => getBlockExploreLink(farm.lpAddress, 'address', farm.token.chainId),
    [farm.lpAddress, farm.token.chainId],
  )

  const infoUrl = useMemo(() => {
    return `/info/v3${multiChainPaths[farm.token.chainId]}/pairs/${farm.lpAddress}?chain=${
      CHAIN_QUERY_NAME[farm.token.chainId]
    }`
  }, [farm.lpAddress, farm.token.chainId])

  const hasNoPosition = useMemo(
    () => userDataReady && farm.stakedPositions.length === 0 && farm.unstakedPositions.length === 0,
    [farm.stakedPositions.length, farm.unstakedPositions.length, userDataReady],
  )

  const addLiquidityModal = useModalV2()

  return (
    <>
      <AddLiquidityV3Modal
        {...addLiquidityModal}
        currency0={unwrappedToken(farm.token)}
        currency1={unwrappedToken(farm.quoteToken)}
        feeAmount={farm.feeAmount}
      />
      <ActionPanelContainer
        expanded={expanded}
        values={
          <>
            {!isDesktop && (
              <>
                <ValueWrapper>
                  <Text>{t('APR')}</Text>
                  <FarmV3ApyButton farm={farm} />
                </ValueWrapper>
                <ValueWrapper>
                  <Text>{t('Multiplier')}</Text>
                  <Multiplier {...multiplier} />
                </ValueWrapper>
                <ValueWrapper>
                  <Text>{t('Staked Liquidity')}</Text>
                  <StakedLiquidity {...stakedLiquidity} />
                </ValueWrapper>
              </>
            )}
          </>
        }
        infos={
          <>
            {isActive && (
              <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
                <StyledText color="primary" onClick={addLiquidityModal.onOpen}>
                  {t('Add %symbol%', { symbol: lpLabel })}
                </StyledText>
              </Flex>
            )}
            <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
              <StyledLinkExternal href={infoUrl}>{t('See Pair Info')}</StyledLinkExternal>
            </Flex>
            <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
              <StyledScanLink chainId={chainId} href={bsc}>
                {t('View Contract')}
              </StyledScanLink>
            </Flex>
          </>
        }
      >
        {!userDataReady ? (
          <Skeleton height={200} width="100%" />
        ) : account && !hasNoPosition ? (
          <FarmV3CardList farm={farm} direction="row" showHarvestAll />
        ) : (
          <NoPosition
            inactive={!isActive}
            boostedAction={null}
            account={account}
            hasNoPosition={hasNoPosition}
            onAddLiquidity={addLiquidityModal.onOpen}
            connectWalletButton={<ConnectWalletButton mt="8px" width="100%" />}
          />
        )}
      </ActionPanelContainer>
    </>
  )
}

export const ActionPanelV2: React.FunctionComponent<React.PropsWithChildren<ActionPanelProps>> = ({
  details,
  apr,
  multiplier,
  liquidity,
  userDataReady,
  expanded,
  alignLinksToRight = true,
}) => {
  const { chainId } = useActiveChainId()
  const { proxyFarm, shouldUseProxyFarm } = useContext(YieldBoosterStateContext)

  const farm = details

  const { isDesktop } = useMatchBreakpoints()

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const isActive = farm.multiplier !== '0X'
  const lpLabel = useMemo(() => farm.lpSymbol && farm.lpSymbol.replace(/pancake/gi, ''), [farm.lpSymbol])
  const bsc = useMemo(
    () => getBlockExploreLink(farm.lpAddress, 'address', farm.token.chainId),
    [farm.lpAddress, farm.token.chainId],
  )

  const infoUrl = useMemo(() => {
    if (farm.isStable) {
      return `/info${multiChainPaths[chainId]}/pairs/${farm.stableSwapAddress}?type=stableSwap&chain=${CHAIN_QUERY_NAME[chainId]}`
    }
    return `/info${multiChainPaths[chainId]}/pairs/${farm.lpAddress}?chain=${CHAIN_QUERY_NAME[chainId]}`
  }, [chainId, farm.isStable, farm.lpAddress, farm.stableSwapAddress])

  const addLiquidityModal = useModalV2()

  return (
    <>
      <AddLiquidityV3Modal
        {...addLiquidityModal}
        currency0={unwrappedToken(farm.token)}
        currency1={unwrappedToken(farm.quoteToken)}
        preferredSelectType={farm.isStable ? SELECTOR_TYPE.STABLE : SELECTOR_TYPE.V2}
      />
      <ActionPanelContainer
        expanded={expanded}
        values={
          <>
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
                  <Apr
                    {...apr}
                    useTooltipText={false}
                    boosted={farm.boosted}
                    farmCakePerSecond={multiplier.farmCakePerSecond}
                    totalMultipliers={multiplier.totalMultipliers}
                  />
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
          </>
        }
        infos={
          <>
            {isActive && (
              <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
                <StyledText color="primary" onClick={addLiquidityModal.onOpen}>
                  {t('Add %symbol%', { symbol: lpLabel })}
                </StyledText>
              </Flex>
            )}
            <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
              <StyledLinkExternal href={infoUrl}>{t('See Pair Info')}</StyledLinkExternal>
            </Flex>
            <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
              <StyledScanLink chainId={chainId} href={bsc}>
                {t('View Contract')}
              </StyledScanLink>
            </Flex>
          </>
        }
      >
        {shouldUseProxyFarm ? (
          <ProxyHarvestActionContainer {...proxyFarm} userDataReady={userDataReady}>
            {(props) => <HarvestAction {...props} />}
          </ProxyHarvestActionContainer>
        ) : (
          <HarvestActionContainer {...farm} userDataReady={userDataReady}>
            {(props) => <HarvestAction {...props} />}
          </HarvestActionContainer>
        )}
        {/* {farm?.boosted && (
          <ActionContainerSection style={{ minHeight: isMobile ? 'auto' : isMobile ? 'auto' : 124.5 }}>
            <BoostedAction
              title={(status) => (
                <ActionTitles>
                  <Text mr="3px" bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                    {t('Yield Booster')}
                  </Text>
                  <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
                    {status}
                  </Text>
                </ActionTitles>
              )}
              desc={(actionBtn) => <ActionContent>{actionBtn}</ActionContent>}
              farmPid={farm?.pid}
              lpTokenStakedAmount={farm?.lpTokenStakedAmount}
              userBalanceInFarm={
                stakedBalance.plus(tokenBalance).gt(0)
                  ? stakedBalance.plus(tokenBalance)
                  : proxy.stakedBalance.plus(proxy.tokenBalance)
              }
            />
          </ActionContainerSection>
        )} */}
        {shouldUseProxyFarm ? (
          <ProxyStakedContainer {...proxyFarm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value}>
            {(props) => <StakedAction {...props} />}
          </ProxyStakedContainer>
        ) : (
          <StakedContainer {...farm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value}>
            {(props) => <StakedAction {...props} />}
          </StakedContainer>
        )}
      </ActionPanelContainer>
    </>
  )
}
