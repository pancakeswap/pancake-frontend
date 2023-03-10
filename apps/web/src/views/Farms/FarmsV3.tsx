import { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useAccount } from 'wagmi'
import {
  Image,
  Heading,
  Toggle,
  Text,
  Button,
  ArrowForwardIcon,
  Flex,
  Link,
  Box,
  Farm as FarmUI,
  Loading,
  SearchInput,
  Select,
  OptionProps,
  FlexLayout,
  PageHeader,
  NextLinkFromReactRouter,
  ToggleView,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useCakeVaultUserData } from 'state/pools/hooks'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import orderBy from 'lodash/orderBy'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import FarmV3MigrationBanner from 'views/Home/components/Banners/FarmV3MigrationBanner'
import _toLower from 'lodash/toLower'
import { useFarmsV3WithPositions } from 'state/farmsV3/hooks'
import { FarmV3DataWithPriceAndUserInfo, filterFarmsV3ByQuery } from '@pancakeswap/farms'
import { getFarmV3Apr } from 'utils/apr'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import Table from './components/FarmTable/V3/FarmTable'
import { BCakeBoosterCard } from './components/BCakeBoosterCard'
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
  padding-bottom: 32px;
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

const Farms: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname, query: urlQuery } = useRouter()
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const farmsV3: FarmV3DataWithPriceAndUserInfo[] = useFarmsV3WithPositions()

  const cakePrice = usePriceCakeBusd()

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

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && farmsV3.length > 0)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)

  const activeFarms = farmsV3.filter(
    (farm) => farm.pid !== 0 && farm.multiplier !== '0X' && (!farmsV3.length || farmsV3.length >= farm.pid),
  )

  const inactiveFarms = farmsV3.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')

  const archivedFarms = farmsV3

  const stakedOnlyFarms = activeFarms.filter((farm) => farm.stakedPositions.length > 0)

  const stakedInactiveFarms = inactiveFarms.filter((farm) => farm.stakedPositions.length > 0)

  const stakedArchivedFarms = archivedFarms.filter((farm) => farm.stakedPositions.length > 0)

  const farmsList = useCallback(
    (farmsToDisplay: FarmV3DataWithPriceAndUserInfo[]): FarmV3DataWithPriceAndUserInfo[] => {
      const farmsToDisplayWithAPR: any = farmsToDisplay.map((farm) => {
        if (!farm.quoteTokenAmountTotal || !farm.quoteTokenPriceBusd) {
          return farm
        }

        const { lpRewardsApr } = isActive ? getFarmV3Apr(chainId, farm.lpAddress) : { lpRewardsApr: 0 }

        return { ...farm, lpRewardsApr }
      })

      return filterFarmsV3ByQuery(farmsToDisplayWithAPR, query)
    },
    [query, isActive, chainId],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  const chosenFarms = useMemo(() => {
    let chosenFs = []
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
  ])

  const chosenFarmsMemoized = useMemo(() => {
    const sortFarms = (farms: FarmV3DataWithPriceAndUserInfo[]): FarmV3DataWithPriceAndUserInfo[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmV3DataWithPriceAndUserInfo) => farm.cakeApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmV3DataWithPriceAndUserInfo) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmV3DataWithPriceAndUserInfo) => {
              const totalEarned = Object.values(farm.pendingCakeByTokenIds)
                .reduce((a, b) => a.add(b), EthersBigNumber.from('0'))
                .toNumber()
              return account && farm.stakedPositions.length > 0 ? totalEarned : 0
            },
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmV3DataWithPriceAndUserInfo) => Number(farm.activeTvlUSD), 'desc')
        case 'latest':
          return orderBy(farms, (farm: FarmV3DataWithPriceAndUserInfo) => Number(farm.pid), 'desc')
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
        <Flex flexDirection="column">
          <Box m="24px 0">
            <FarmV3MigrationBanner />
          </Box>
          <FarmFlexWrapper justifyContent="space-between">
            <Box>
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
            {chainId === ChainId.BSC && (
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
            <FarmUI.FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
            <Flex mt="20px" ml="16px">
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
          <FinishedTextContainer>
            <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
              {t("Don't see the farm you are staking?")}
            </Text>
            <Flex>
              <FinishedTextLink href="/migration" fontSize={['16px', null, '20px']} color="failure">
                {t('Go to migration page')}
              </FinishedTextLink>
              <Text fontSize={['16px', null, '20px']} color="failure" padding="0px 4px">
                or
              </Text>
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
        {viewMode === ViewMode.TABLE ? (
          <Table farms={chosenFarmsMemoized} cakePrice={cakePrice} userDataReady={userDataReady} />
        ) : (
          <FlexLayout>{children}</FlexLayout>
        )}
        {account && farmsV3.length === 0 && stakedOnly && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        {farmsV3.length > 0 && <div ref={observerRef} />}
        <StyledImage src="/images/decorations/3dpan.png" alt="Pancake illustration" width={120} height={103} />
      </Page>
    </FarmsV3Context.Provider>
  )
}

export default Farms
