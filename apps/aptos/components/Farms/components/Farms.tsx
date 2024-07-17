import { useAccount } from '@pancakeswap/awgmi'
import type { DeserializedFarm } from '@pancakeswap/farms'
import { FarmWithStakedValue, filterFarmsByQuery } from '@pancakeswap/farms'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Flex,
  FlexLayout,
  Heading,
  Image,
  Loading,
  OptionProps,
  PageHeader,
  SearchInput,
  Select,
  Text,
  Toggle,
  ToggleView,
} from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { AptosYieldFarmingBanner } from 'components/Banner/AptosYieldFarmingBanner'
import useLpRewardsAprs from 'components/Farms/hooks/useLpRewardsAprs'
import Page from 'components/Layout/Page'
import NoSSR from 'components/NoSSR'
import { APT } from 'config/coins'
import { useActiveChainId } from 'hooks/useNetwork'
import { usePriceCakeUsdc, useTokenUsdcPrice } from 'hooks/useStablePrice'
import orderBy from 'lodash/orderBy'
import { useRouter } from 'next/router'
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFarms } from 'state/farms/hook'
import { calcPendingRewardApt } from 'state/farms/utils/pendingApt'
import { ViewMode, useFarmViewMode, useFarmsStakedOnly } from 'state/user'
import { styled } from 'styled-components'
import { getFarmApr } from 'utils/farmApr'
import Table from './FarmTable/FarmTable'

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

const NUMBER_OF_FARMS_VISIBLE = 12

const Farms: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  const chainId = useActiveChainId()
  const cakePrice = usePriceCakeUsdc()
  const aptPrice = useTokenUsdcPrice(APT[chainId])
  const { pathname, query: urlQuery } = useRouter()
  const [viewMode, setViewMode] = useFarmViewMode()
  const [stakedOnly, setStakedOnly] = useFarmsStakedOnly()
  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const {
    data: farmsLP,
    userDataLoaded,
    poolLength,
    regularCakePerBlock,
    totalRegularAllocPoint,
    cakePerBlock,
  } = useFarms()
  const lpRewardsAprs = useLpRewardsAprs()

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const { account } = useAccount()
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const activeFarms = farmsLP?.filter(
    (farm) =>
      farm.pid !== 0 &&
      (farm.multiplier !== '0X' || farm?.bCakeWrapperAddress) &&
      (!poolLength || poolLength > farm.pid),
  )
  const inactiveFarms = farmsLP?.filter(
    (farm) => farm.pid !== 0 && farm.multiplier === '0X' && !farm?.bCakeWrapperAddress,
  )
  const archivedFarms = farmsLP

  const stakedOnlyFarms = activeFarms?.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveFarms = inactiveFarms?.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedArchivedFarms = archivedFarms?.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay?.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr } = isActive
          ? getFarmApr(new BigNumber(farm.poolWeight ?? 0), cakePrice, totalLiquidity, regularCakePerBlock ?? 0)
          : { cakeRewardsApr: 0 }

        const lpRewardsApr = lpRewardsAprs?.[farm.lpAddress?.toLowerCase()] ?? 0

        const dualTokenRewardApr = isActive
          ? calcPendingRewardApt(
              new BigNumber(farm.poolWeight ?? 0),
              regularCakePerBlock ?? 0,
              aptPrice,
              farm?.dual?.aptIncentiveInfo ?? 0,
              totalLiquidity,
            )
          : 0

        return {
          ...farm,
          apr: cakeRewardsApr,
          lpRewardsApr,
          liquidity: totalLiquidity,
          dualTokenRewardApr,
        }
      })

      return filterFarmsByQuery(farmsToDisplayWithAPR, query)
    },
    [query, isActive, cakePrice, aptPrice, regularCakePerBlock, lpRewardsAprs],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const chosenFarms: FarmWithStakedValue[] = useMemo(() => {
    let chosenFs: FarmWithStakedValue[] = []
    if (isActive) {
      chosenFs = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFs = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFs = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    return chosenFs
  }, [
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
  ])

  const chosenFarmsMemoized: any = useMemo(() => {
    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          // @ts-ignore
          return orderBy(farms, (farm: FarmWithStakedValue) => farm?.apr + farm?.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm?.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        case 'latest':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.pid), 'desc')
        default:
          return farms
      }
    }

    return sortFarms(chosenFarms)?.slice(0, numberOfFarmsVisible)
  }, [chosenFarms, sortOption, numberOfFarmsVisible])

  chosenFarmsLength.current = chosenFarmsMemoized?.length

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
    <FarmsContext.Provider value={providerValue}>
      <PageHeader>
        <Box mb="32px" mt="16px">
          <AptosYieldFarmingBanner />
        </Box>
        <FarmFlexWrapper justifyContent="space-between">
          <Box>
            <FarmH1 as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Farms')}
            </FarmH1>
            <FarmH2 scale="lg" color="text">
              {t('Stake LP tokens to earn.')}
            </FarmH2>
          </Box>
        </FarmFlexWrapper>
      </PageHeader>
      <Page title={t('Farms')}>
        <ControlContainer>
          <ViewControls>
            <Flex mt="20px">
              <NoSSR>
                <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
              </NoSSR>
            </Flex>
            <FarmWidget.FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms?.length > 0} />
            <Flex mt="20px">
              <ToggleWrapper>
                <Toggle
                  id="staked-only-farms"
                  scale="sm"
                  checked={stakedOnly}
                  onChange={() => setStakedOnly(!stakedOnly)}
                />
                <Text>{t('Staked only')}</Text>
              </ToggleWrapper>
            </Flex>
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Text textTransform="uppercase">{t('Sort by')}</Text>
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
              <Text textTransform="uppercase">{t('Search')}</Text>
              <SearchInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search Farms" />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        <NoSSR>
          {viewMode === ViewMode.TABLE ? (
            <Table
              farms={chosenFarmsMemoized}
              cakePrice={cakePrice}
              userDataReady={userDataReady}
              totalRegularAllocPoint={totalRegularAllocPoint}
              cakePerBlock={cakePerBlock}
            />
          ) : (
            <FlexLayout>{children}</FlexLayout>
          )}
          {account && !userDataLoaded && stakedOnly && (
            <Flex justifyContent="center">
              <Loading />
            </Flex>
          )}
          {poolLength && <div ref={observerRef} />}
        </NoSSR>
        <StyledImage src="/images/decorations/3dpan.png" alt="Pancake illustration" width={120} height={103} />
      </Page>
    </FarmsContext.Provider>
  )
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export default Farms
