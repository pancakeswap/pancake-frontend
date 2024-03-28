import { ChainId } from '@pancakeswap/chains'
import {
  DeserializedFarm,
  FarmV3DataWithPriceAndUserInfo,
  FarmWithStakedValue,
  filterFarmsByQuery,
  supportedChainIdV2,
  supportedChainIdV3,
} from '@pancakeswap/farms'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowForwardIcon,
  Box,
  Button,
  Flex,
  FlexLayout,
  Heading,
  Image,
  Link,
  Loading,
  OptionProps,
  PageHeader,
  SearchInput,
  Select,
  Text,
  Toggle,
  ToggleView,
} from '@pancakeswap/uikit'

import { BIG_ONE, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { FarmWidget, NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { V3_MIGRATION_SUPPORTED_CHAINS } from 'config/constants/supportChains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'
import orderBy from 'lodash/orderBy'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFarms, usePollFarmsWithUserData } from 'state/farms/hooks'
import { useFarmsV3WithPositionsAndBooster } from 'state/farmsV3/hooks'
import { useCakeVaultUserData } from 'state/pools/hooks'
import { ViewMode } from 'state/user/actions'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import { styled } from 'styled-components'
import { getFarmApr } from 'utils/apr'
import { getStakedFarms } from 'views/Farms/utils/getStakedFarms'
import { BCakeMigrationBanner } from 'views/Home/components/Banners/BCakeMigrationBanner'
import { useAccount } from 'wagmi'
import Table from './components/FarmTable/FarmTable'
import { FarmTypesFilter } from './components/FarmTypesFilter'
import { BCakeBoosterCard } from './components/YieldBooster/components/bCakeV3/BCakeBoosterCard'
import { FarmsV3Context } from './context'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const FarmFlexWrapper = styled(Flex)`
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: nowrap;
  }
`
const FarmH1 = styled(Heading)`
  font-size: 32px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
    margin-bottom: 24px;
  }
`
const FarmH2 = styled(Heading)`
  font-size: 16px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
    margin-bottom: 18px;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const FinishedTextContainer = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const NUMBER_OF_FARMS_VISIBLE = 12

export interface V3FarmWithoutStakedValue extends FarmV3DataWithPriceAndUserInfo {
  version: 3
}

export interface V3Farm extends V3FarmWithoutStakedValue {
  version: 3
}

export interface V2FarmWithoutStakedValue extends DeserializedFarm {
  version: 2
}

export interface V2Farm extends FarmWithStakedValue {
  version: 2
}

type V2AndV3Farms = Array<V3FarmWithoutStakedValue | V2FarmWithoutStakedValue>

export type V2StakeValueAndV3Farm = V3Farm | V2Farm

const Farms: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname, query: urlQuery } = useRouter()
  const mockApr = Boolean(urlQuery.mockApr)
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { data: farmsV2, userDataLoaded: v2UserDataLoaded, poolLength: v2PoolLength, regularCakePerBlock } = useFarms()
  const {
    farmsWithPositions: farmsV3,
    poolLength: v3PoolLength,
    isLoading,
    userDataLoaded: v3UserDataLoaded,
  } = useFarmsV3WithPositionsAndBooster({ mockApr })

  // FIXME: temporary sort sable v2 farm in front of v3 farms
  const farmsLP: V2AndV3Farms = useMemo(() => {
    const farms: V2AndV3Farms = [
      ...farmsV3.map((f) => ({ ...f, version: 3 } as V3FarmWithoutStakedValue)),
      ...farmsV2.map((f) => ({ ...f, version: 2 } as V2FarmWithoutStakedValue)),
    ]
    if (chainId !== ChainId.BSC) {
      return farms
    }
    const sableFarm = farms.find((f) => f.version === 2 && f.pid === 167)
    const v3TargetFarm = farms.find((f) => f.version === 3 && f.pid === 60)
    if (!sableFarm || !v3TargetFarm) {
      return farms
    }
    const sableFarmIndex = farms.indexOf(sableFarm)
    const targetIndex = farms.indexOf(v3TargetFarm)
    return [
      ...farms.slice(0, targetIndex + 1),
      sableFarm,
      ...farms.slice(targetIndex + 1, sableFarmIndex),
      ...farms.slice(sableFarmIndex + 1),
    ]
  }, [farmsV2, farmsV3, chainId])

  const cakePrice = useCakePrice()

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const [viewMode, setViewMode] = useUserFarmsViewMode()
  const { address: account } = useAccount()
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  useCakeVaultUserData()

  usePollFarmsWithUserData()

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady =
    !account ||
    (!!account &&
      (chainId && supportedChainIdV2.includes(chainId) ? v2UserDataLoaded : true) &&
      (chainId && supportedChainIdV3.includes(chainId) ? v3UserDataLoaded : true))

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)
  const [v3FarmOnly, setV3FarmOnly] = useState(false)
  const [v2FarmOnly, setV2FarmOnly] = useState(false)
  const [boostedOnly, setBoostedOnly] = useState(false)
  const [stableSwapOnly, setStableSwapOnly] = useState(false)
  const [farmTypesEnableCount, setFarmTypesEnableCount] = useState(0)

  const activeFarms = farmsLP.filter(
    (farm) =>
      farm.pid !== 0 &&
      farm.multiplier !== '0X' &&
      (farm.version === 3 ? !v3PoolLength || v3PoolLength >= farm.pid : !v2PoolLength || v2PoolLength > farm.pid),
  )

  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')

  const archivedFarms = farmsLP

  const stakedOnlyFarms = useMemo(() => getStakedFarms(activeFarms), [activeFarms])

  const stakedInactiveFarms = useMemo(() => getStakedFarms(inactiveFarms), [inactiveFarms])

  const stakedArchivedFarms = useMemo(() => getStakedFarms(archivedFarms), [archivedFarms])

  const farmsList = useCallback(
    (farmsToDisplay: V2AndV3Farms): V2StakeValueAndV3Farm[] => {
      const farmsToDisplayWithAPR: any = farmsToDisplay.map((farm) => {
        if (farm.version === 3) {
          return farm
        }

        if (!farm.quoteTokenAmountTotal || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidityFromLp = new BigNumber(farm?.lpTotalInQuoteToken ?? 0).times(farm.quoteTokenPriceBusd)
        // Mock 1$ tvl if the farm doesn't have lp staked
        const totalLiquidity = totalLiquidityFromLp.eq(BIG_ZERO) && mockApr ? BIG_ONE : totalLiquidityFromLp
        const { cakeRewardsApr, lpRewardsApr } =
          isActive && chainId
            ? getFarmApr(
                chainId,
                new BigNumber(farm?.poolWeight ?? 0),
                cakePrice,
                totalLiquidity,
                farm.lpAddress,
                regularCakePerBlock,
              )
            : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      return filterFarmsByQuery(farmsToDisplayWithAPR, query)
    },
    [query, isActive, chainId, cakePrice, regularCakePerBlock, mockApr],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  const chosenFarms = useMemo(() => {
    let chosenFs: V2StakeValueAndV3Farm[] = []
    if (isActive) {
      chosenFs = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFs = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFs = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    if (v3FarmOnly || v2FarmOnly || boostedOnly || stableSwapOnly) {
      const filterFarmsWithTypes = chosenFs.filter(
        (farm) =>
          (v3FarmOnly && farm.version === 3) ||
          (v2FarmOnly && farm.version === 2) ||
          (boostedOnly && farm.boosted && farm.version === 3) ||
          (stableSwapOnly && farm.version === 2 && farm.isStable),
      )

      const stakedFilterFarmsWithTypes = getStakedFarms(filterFarmsWithTypes)

      chosenFs = stakedOnly ? farmsList(stakedFilterFarmsWithTypes) : farmsList(filterFarmsWithTypes)
    }

    return chosenFs
  }, [
    isActive,
    isInactive,
    isArchived,
    stakedOnly,
    farmsList,
    stakedOnlyFarms,
    activeFarms,
    stakedInactiveFarms,
    inactiveFarms,
    stakedArchivedFarms,
    archivedFarms,
    boostedOnly,
    stableSwapOnly,
    v3FarmOnly,
    v2FarmOnly,
  ])

  const chosenFarmsMemoized = useMemo(() => {
    const sortFarms = (farms: V2StakeValueAndV3Farm[]): V2StakeValueAndV3Farm[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm) => (farm.version === 3 ? Number(farm.cakeApr) : farm.apr ?? 0), 'desc')
        case 'multiplier':
          return orderBy(farms, (farm) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0), 'desc')
        case 'earned':
          return orderBy(
            farms,
            (farm) => {
              if (farm.version === 2) {
                return farm.userData ? Number(farm.userData.earnings) : 0
              }
              const totalEarned = Object.values(farm.pendingCakeByTokenIds)
                .reduce((a, b) => a + b, 0n)
                .toString()
              return account ? totalEarned : 0
            },
            'desc',
          )
        case 'liquidity':
          return orderBy(
            farms,
            (farm) => {
              if (farm.version === 3) {
                return Number(farm.activeTvlUSD)
              }
              return Number(farm.liquidity)
            },
            'desc',
          )
        case 'latest':
          return orderBy(
            orderBy(farms, (farm) => Number(farm.pid), 'desc'),
            ['version'],
            'desc',
          )
        default:
          return farms
      }
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [chosenFarms, numberOfFarmsVisible, sortOption, account])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const providerValue = useMemo(() => ({ chosenFarmsMemoized }), [chosenFarmsMemoized])

  return (
    <FarmsV3Context.Provider value={providerValue}>
      <PageHeader>
        <Box mb="32px" mt="16px">
          <BCakeMigrationBanner />
        </Box>
        <Flex flexDirection="column">
          <FarmFlexWrapper justifyContent="space-between">
            <Box style={{ flex: '1 1 100%' }}>
              <FarmH1 as="h1" scale="xxl" color="secondary" mb="24px">
                {t('Farms')}
              </FarmH1>
              <FarmH2 scale="lg" color="text">
                {t('Stake LP tokens to earn.')}
              </FarmH2>
              <NextLinkFromReactRouter to="/farms/auction" prefetch={false}>
                <Button p="0" variant="text">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Community Auctions')}
                  </Text>
                  <ArrowForwardIcon color="primary" />
                </Button>
              </NextLinkFromReactRouter>
            </Box>

            {(chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET) && (
              <Box>
                <BCakeBoosterCard />
              </Box>
            )}
          </FarmFlexWrapper>
        </Flex>
      </PageHeader>
      <Page>
        <ControlContainer>
          <ViewControls>
            <Flex mt="20px">
              <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
            </Flex>
            <FarmWidget.FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
            <Flex mt="20px" ml="16px">
              <FarmTypesFilter
                v3FarmOnly={v3FarmOnly}
                handleSetV3FarmOnly={setV3FarmOnly}
                v2FarmOnly={v2FarmOnly}
                handleSetV2FarmOnly={setV2FarmOnly}
                boostedOnly={boostedOnly}
                handleSetBoostedOnly={setBoostedOnly}
                stableSwapOnly={stableSwapOnly}
                handleSetStableSwapOnly={setStableSwapOnly}
                farmTypesEnableCount={farmTypesEnableCount}
                handleSetFarmTypesEnableCount={setFarmTypesEnableCount}
              />
              <ToggleWrapper>
                <Toggle
                  id="staked-only-farms"
                  checked={stakedOnly}
                  onChange={() => setStakedOnly(!stakedOnly)}
                  scale="sm"
                />
                <Text> {t('Staked only')}</Text>
              </ToggleWrapper>
            </Flex>
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
                {t('Sort by')}
              </Text>
              <Select
                options={[
                  {
                    label: t('Hot'),
                    value: 'hot',
                  },
                  {
                    label: t('APR'),
                    value: 'apr',
                  },
                  {
                    label: t('Multiplier'),
                    value: 'multiplier',
                  },
                  {
                    label: t('Earned'),
                    value: 'earned',
                  },
                  {
                    label: t('Liquidity'),
                    value: 'liquidity',
                  },
                  {
                    label: t('Latest'),
                    value: 'latest',
                  },
                ]}
                onOptionChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
                {t('Search')}
              </Text>
              <SearchInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search Farms" />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {isInactive && (
          <Box mb="32px">
            {chainId === ChainId.BSC && (
              <FinishedTextContainer>
                <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
                  {t("Don't see the farm you are staking?")}
                </Text>
                <Flex>
                  <FinishedTextLink
                    external
                    color="failure"
                    fontSize={['16px', null, '20px']}
                    href="https://v1-farms.pancakeswap.finance/farms/history"
                  >
                    {t('check out v1 farms')}.
                  </FinishedTextLink>
                </Flex>
              </FinishedTextContainer>
            )}
            {chainId && V3_MIGRATION_SUPPORTED_CHAINS.includes(chainId) && (
              <FinishedTextContainer>
                <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
                  {t('Unstaking from v2 farm?')}
                </Text>
                <Flex>
                  <FinishedTextLink external color="failure" fontSize={['16px', null, '20px']} href="/migration">
                    {t('Migrate to v3 here')}.
                  </FinishedTextLink>
                </Flex>
              </FinishedTextContainer>
            )}
          </Box>
        )}

        {!isLoading && // FarmV3 initial data will be slower, wait for it loads for now to prevent showing the v2 farm from config and then v3 pop up later
          (viewMode === ViewMode.TABLE ? (
            <Table farms={chosenFarmsMemoized} cakePrice={cakePrice} userDataReady={userDataReady} />
          ) : (
            <FlexLayout>{children}</FlexLayout>
          ))}
        {account && !v2UserDataLoaded && !v3UserDataLoaded && stakedOnly && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        {chosenFarms.length > 0 && <div ref={observerRef} />}
        <StyledImage src="/images/decorations/3dpan.png" alt="Pancake illustration" width={120} height={103} />
        <V3SubgraphHealthIndicator />
      </Page>
    </FarmsV3Context.Provider>
  )
}

export default Farms
