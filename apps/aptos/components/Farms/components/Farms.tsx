import { useEffect, useCallback, useState, useMemo, useRef, createContext } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'
import { useAccount } from '@pancakeswap/awgmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePriceCakeUsdc } from 'hooks/useStablePrice'
import {
  Image,
  Heading,
  Toggle,
  Text,
  Flex,
  Box,
  PageHeader,
  FlexLayout,
  Select,
  OptionProps,
  Loading,
  SearchInput,
  Farm as FarmUI,
  ToggleView,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'
import Page from 'components/Layout/Page'
import { useFarmViewMode, ViewMode, useFarmsStakedOnly } from 'state/user'
import NoSSR from 'components/NoSSR'

import { useFarms } from 'state/farms/hook'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { getFarmApr } from 'utils/farmApr'
import { latinise } from 'utils/latinise'
import type { DeserializedFarm } from '@pancakeswap/farms'
import { FarmWithStakedValue } from '@pancakeswap/farms'
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
  const { chainId } = useActiveWeb3React()
  const cakePrice = usePriceCakeUsdc()
  const { pathname, query: urlQuery } = useRouter()
  const [viewMode, setViewMode] = useFarmViewMode()
  const [stakedOnly, setStakedOnly] = useFarmsStakedOnly()
  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const { data: farmsLP, userDataLoaded, poolLength, regularCakePerBlock } = useFarms()

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
    (farm) => farm.pid !== 0 && farm.multiplier !== '0X' && (!poolLength || poolLength > farm.pid),
  )
  const inactiveFarms = farmsLP?.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')
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
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay?.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(
              chainId,
              new BigNumber(farm.poolWeight ?? 0),
              cakePrice,
              totalLiquidity,
              farm.lpAddress,
              regularCakePerBlock ?? 0,
            )
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }

      return farmsToDisplayWithAPR
    },
    [query, isActive, chainId, cakePrice, regularCakePerBlock],
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
            <NoSSR>
              <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
              <ToggleWrapper>
                <Toggle
                  id="staked-only-farms"
                  scale="sm"
                  checked={stakedOnly}
                  onChange={() => setStakedOnly(!stakedOnly)}
                />
                <Text>{t('Staked only')}</Text>
              </ToggleWrapper>
            </NoSSR>
            <FarmUI.FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms?.length > 0} />
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
            <Table farms={chosenFarmsMemoized} cakePrice={cakePrice} userDataReady={userDataReady} />
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
