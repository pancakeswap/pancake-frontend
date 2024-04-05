import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Flex,
  LinkExternal,
  Message,
  MessageText,
  ScanLink,
  Skeleton,
  Text,
  VerifiedIcon,
  useMatchBreakpoints,
  useModalV2,
} from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import { FC, useContext, useMemo } from 'react'
import { ChainLinkSupportChains, multiChainPaths } from 'state/info/constant'
import { css, keyframes, styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { isAddressEqual } from 'viem'
import { AddLiquidityV3Modal } from 'views/AddLiquidityV3/Modal'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import { V2Farm, V3Farm } from 'views/Farms/FarmsV3'
import { StatusView } from 'views/Farms/components/YieldBooster/components/bCakeV3/StatusView'
import { useBCakeBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBCakeV3Info'
import { useBoostStatusPM } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBoostStatus'
import { useWrapperBooster } from 'views/PositionManagers/hooks'
import { useAccount } from 'wagmi'
import { useUpdateBCakeFarms } from '../../../hooks/useUpdateBCake'
import { FarmV3ApyButton } from '../../FarmCard/V3/FarmV3ApyButton'
import FarmV3CardList from '../../FarmCard/V3/FarmV3CardList'
import { YieldBoosterStateContext } from '../../YieldBooster/components/ProxyFarmContainer'
import Apr, { AprProps } from '../Apr'
import { HarvestAction, HarvestActionContainer, ProxyHarvestActionContainer } from './HarvestAction'
import StakedAction, { ProxyStakedContainer, StakedContainer } from './StakedAction'

const { Multiplier, Liquidity, StakedLiquidity } = FarmWidget.FarmTable
const { NoPosition } = FarmWidget.FarmV3Table
const { MerklNotice } = FarmWidget

export interface ActionPanelProps {
  apr: AprProps
  multiplier: FarmWidget.FarmTableMultiplierProps
  liquidity: FarmWidget.FarmTableLiquidityProps
  details: V2Farm
  userDataReady: boolean
  expanded: boolean
  alignLinksToRight?: boolean
  isLastFarm: boolean
}

export interface ActionPanelV3Props {
  apr: {
    value: string
    pid: number
  }
  multiplier: FarmWidget.FarmTableMultiplierProps
  stakedLiquidity: FarmWidget.FarmTableLiquidityProps
  details: V3Farm
  farm: FarmWidget.FarmTableFarmTokenInfoProps & { version: 3 }
  userDataReady: boolean
  expanded: boolean
  alignLinksToRight?: boolean
  isLastFarm: boolean
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
  padding-top: 24px;
  padding-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: center;
    padding: 16px 24px;
  }
  ${({ isLastFarm }) => isLastFarm && `border-radius: 0 0 32px 32px;`}
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

const ActionPanelContainer = ({ expanded, values, infos, children, isLastFarm }) => {
  return (
    <Container expanded={expanded} isLastFarm={isLastFarm}>
      <InfoContainer>
        <ValueContainer>{values}</ValueContainer>
        {infos}
      </InfoContainer>
      <ActionContainer style={{ maxHeight: 700 }}>{children}</ActionContainer>
    </Container>
  )
}

const StyleMerklWarning = styled.div`
  margin-bottom: 24px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 12px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
    margin-bottom: 0;
  }
`

const MerklWarning: React.FC<{
  merklLink: string
  hasFarm?: boolean
}> = ({ merklLink, hasFarm }) => {
  return (
    <StyleMerklWarning>
      <Message variant="primary" icon={<VerifiedIcon color="#7645D9" />}>
        <MessageText color="#7645D9">
          <MerklNotice.Content hasFarm={hasFarm} merklLink={merklLink} linkColor="currentColor" />
        </MessageText>
      </Message>
    </StyleMerklWarning>
  )
}

export const ActionPanelV3: FC<ActionPanelV3Props> = ({
  expanded,
  details,
  farm: farm_,
  multiplier,
  stakedLiquidity,
  alignLinksToRight,
  userDataReady,
  isLastFarm,
}) => {
  const { isDesktop } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const { merklLink } = farm_
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

  const hasBothFarmAndMerkl = useMemo(
    // for now, only rETH-ETH require both farm and merkl, so we hardcode it here
    () => Boolean(merklLink) && isAddressEqual(farm.lpAddress, '0x2201d2400d30BFD8172104B4ad046d019CA4E7bd'),
    [farm.lpAddress, merklLink],
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
        isLastFarm={isLastFarm}
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
              <StyledScanLink
                useBscCoinFallback={typeof chainId !== 'undefined' && ChainLinkSupportChains.includes(chainId)}
                href={bsc}
              >
                {t('View Contract')}
              </StyledScanLink>
            </Flex>
          </>
        }
      >
        {!isDesktop && merklLink ? <MerklWarning hasFarm={hasBothFarmAndMerkl} merklLink={merklLink} /> : null}
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
  isLastFarm,
  alignLinksToRight = true,
}) => {
  const bCakeProps = {
    bCakeWrapperAddress: details.bCakeWrapperAddress,
    bCakeUserData: details.bCakeUserData,
    bCakePublicData: details.bCakePublicData,
  }
  const { chainId } = useActiveChainId()
  const { proxyFarm, shouldUseProxyFarm } = useContext(YieldBoosterStateContext)
  const { address: account } = useAccount()
  const { theme } = useTheme()

  const farm = details

  const { isDesktop, isMobile } = useMatchBreakpoints()
  const { locked } = useBCakeBoostLimitAndLockInfo()
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
    if (!chainId) return ''
    if (farm.isStable) {
      return `/info${multiChainPaths[chainId]}/pairs/${farm.stableSwapAddress}?type=stableSwap&chain=${CHAIN_QUERY_NAME[chainId]}`
    }
    return `/info${multiChainPaths[chainId]}/pairs/${farm.lpAddress}?chain=${CHAIN_QUERY_NAME[chainId]}`
  }, [chainId, farm.isStable, farm.lpAddress, farm.stableSwapAddress])

  const addLiquidityModal = useModalV2()
  const isBooster = Boolean(details?.bCakeWrapperAddress)
  const isRewardInRange = details?.bCakePublicData?.isRewardInRange
  const hasStakedInBCake = Boolean(details?.bCakeUserData?.stakedBalance?.gt(0))

  const { status } = useBoostStatusPM(isBooster, details?.bCakeUserData?.boosterMultiplier)
  const { shouldUpdate, veCakeUserMultiplierBeforeBoosted } = useWrapperBooster(
    details?.bCakeUserData?.boosterContractAddress ?? '0x',
    details?.bCakeUserData?.boosterMultiplier ?? 1,
    details?.bCakeWrapperAddress,
  )
  const { onUpdate } = useUpdateBCakeFarms(details?.bCakeWrapperAddress ?? '0x', details?.pid)

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
        isLastFarm={isLastFarm}
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
                    useTooltipText
                    strikethrough={false}
                    boosted={false}
                    farmCakePerSecond={
                      details?.bCakeWrapperAddress
                        ? (details?.bCakePublicData?.rewardPerSecond ?? 0).toFixed(4)
                        : multiplier.farmCakePerSecond
                    }
                    totalMultipliers={multiplier.totalMultipliers}
                    isBooster={Boolean(details?.bCakeWrapperAddress) && details?.bCakePublicData?.isRewardInRange}
                    boosterMultiplier={
                      details?.bCakeWrapperAddress
                        ? details?.bCakeUserData?.boosterMultiplier === 0 ||
                          details?.bCakeUserData?.stakedBalance.eq(0) ||
                          !locked
                          ? 2.5
                          : details?.bCakeUserData?.boosterMultiplier
                        : 1
                    }
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
              <StyledScanLink
                useBscCoinFallback={typeof chainId !== 'undefined' && ChainLinkSupportChains.includes(chainId)}
                href={bsc}
              >
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
        ) : !farm?.bCakeWrapperAddress ? (
          <HarvestActionContainer
            {...farm}
            {...bCakeProps}
            bCakeUserData={farm.bCakeUserData}
            userDataReady={userDataReady}
          >
            {(harvestProps) => <HarvestAction {...harvestProps} />}
          </HarvestActionContainer>
        ) : null}
        {shouldUseProxyFarm ? (
          <ProxyStakedContainer {...proxyFarm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value}>
            {(props) => <StakedAction {...props} />}
          </ProxyStakedContainer>
        ) : (
          <>
            <StakedContainer
              {...farm}
              {...bCakeProps}
              userDataReady={userDataReady}
              lpLabel={lpLabel}
              displayApr={apr.value}
            >
              {(props) => (
                <StakedAction
                  {...props}
                  bCakeInfoSlot={
                    isBooster ? (
                      <>
                        {account && hasStakedInBCake && (
                          <>
                            <Box
                              style={{
                                height: isMobile ? 2 : 70,
                                width: isMobile ? '100%' : 2,
                                backgroundColor: theme.colors.cardBorder,
                              }}
                            />
                            <HarvestActionContainer {...farm} {...bCakeProps} userDataReady={userDataReady}>
                              {(harvestProps) => (
                                <HarvestAction
                                  {...harvestProps}
                                  style={{
                                    border: 'none',
                                    minHeight: 'auto',
                                    marginLeft: '0px',
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    width: isMobile ? '100%' : undefined,
                                    marginBottom: isMobile ? '0' : undefined,
                                  }}
                                />
                              )}
                            </HarvestActionContainer>
                          </>
                        )}
                        {isRewardInRange && (
                          <Box
                            style={{
                              height: isMobile ? 2 : 70,
                              width: isMobile ? '100%' : 2,
                              backgroundColor: theme.colors.cardBorder,
                            }}
                          />
                        )}
                        {isRewardInRange && (
                          <Flex
                            flexGrow={1}
                            maxWidth={isMobile ? 'auto' : hasStakedInBCake ? '27%' : '50%'}
                            justifyContent="space-between"
                            alignItems="center"
                            p={isMobile ? '16px 0' : undefined}
                            width={isMobile ? '100%' : undefined}
                          >
                            <StatusView
                              status={status}
                              isFarmStaking={farm?.bCakeUserData?.stakedBalance?.gt(0)}
                              boostedMultiplier={details?.bCakeUserData?.boosterMultiplier}
                              maxBoostMultiplier={2.5}
                              shouldUpdate={shouldUpdate}
                              expectMultiplier={veCakeUserMultiplierBeforeBoosted}
                            />
                            {!locked && (
                              <NextLink href="/cake-staking" passHref>
                                <Button width="100%" style={{ whiteSpace: 'nowrap' }}>
                                  {t('Go to Lock')}
                                </Button>
                              </NextLink>
                            )}
                            {shouldUpdate && farm?.bCakeUserData?.stakedBalance?.gt(0) && (
                              <Button onClick={onUpdate}>{t('Update')}</Button>
                            )}
                          </Flex>
                        )}
                      </>
                    ) : undefined
                  }
                />
              )}
            </StakedContainer>
          </>
        )}
      </ActionPanelContainer>
    </>
  )
}
