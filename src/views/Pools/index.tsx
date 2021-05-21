import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { usePools, useFetchCakeVault, useFetchPublicPoolsData, usePollFarmsData, useCakeVault } from 'state/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { Pool } from 'state/types'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView/ToggleView'

const CardLayout = styled(FlexLayout)`
  justify-content: space-around;
`

const PoolControls = styled(Flex)`
  flex-direction: column;
  margin-bottom: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const SearchSortContainer = styled(Flex)`
  gap: 10px;
  justify-content: space-between;
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, 'pancake_farm_view')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const {
    userData: { userShares },
  } = useCakeVault()
  const accountHasVaultShares = userShares && userShares.gt(0)

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () => finishedPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  // This pool is passed explicitly to the cake vault
  const cakePoolData = useMemo(() => openPools.find((pool) => pool.sousId === 0), [openPools])

  useFetchCakeVault()
  useFetchPublicPoolsData()
  usePollFarmsData()

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const showFinishedPools = location.pathname.includes('history')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      // TODO: At the moment sorting by APR would be incredibly expensive due to the fact that we
      // would need to calculate APR for each pool here and then it will be recalculated in the pool
      // card or table row. APR handling should be refactored to pre-populate APR for each pool beforehand
      // instead of doing it ad-hoc in the pool card/row.
      // case 'apr':
      //   return orderBy(poolsToSort, (pool: Pool) => pool.apr, 'desc')

      // TODO: Sorting by earned is also not possible with current data architecture
      // We have hooks to retrieve price like useBusdPriceFromToken, but they are hooks, its not possible
      // to use them in the sorting function. Until we calculate all prices and put them in redux pool data
      // the only way to do that is to put hook for each pool in this component, which is obviously
      // not a proper way to handle this.
      case 'apr':
        return orderBy(poolsToSort, 'apr', 'desc')
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.userData ? pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber() : 0),
          'desc',
        )
      case 'totalStaked':
        return orderBy(poolsToSort, (pool: Pool) => Number(pool.totalStaked), 'desc')
      default:
        return poolsToSort
    }
  }

  const poolsToShow = () => {
    let chosenPools = []
    if (showFinishedPools) {
      chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
    } else {
      chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
    }

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      chosenPools = chosenPools.filter((pool) =>
        latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
      )
    }

    return sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  }

  const hideUnstakedCakeVault = stakedOnly && !accountHasVaultShares
  const cakeVaultNotInSearchQuery = searchQuery && !'cake'.includes(searchQuery.toLowerCase())
  const hideCakeVault = hideUnstakedCakeVault || cakeVaultNotInSearchQuery

  const cardLayout = (
    <CardLayout>
      {!showFinishedPools && !hideCakeVault && <CakeVaultCard pool={cakePoolData} showStakedOnly={stakedOnly} />}
      {poolsToShow().map((pool) => (
        <PoolCard key={pool.sousId} pool={pool} account={account} />
      ))}
    </CardLayout>
  )

  const tableLayout = (
    <PoolsTable
      pools={poolsToShow()}
      cakeVault={hideCakeVault ? null : cakePoolData}
      account={account}
      userDataLoaded={userDataLoaded}
      showFinishedPools={showFinishedPools}
    />
  )

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, 'row']}>
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Syrup Pools')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Just stake some tokens to earn.')}
            </Heading>
            <Heading scale="md" color="text">
              {t('High APR, low risk.')}
            </Heading>
          </Flex>
          <Flex height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <HelpButton />
            <BountyCard />
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls justifyContent="space-between">
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <SearchSortContainer>
            <Flex flexDirection="column" width="50%">
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('SORT BY')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: 'Hot',
                      value: 'hot',
                    },
                    {
                      label: 'APR',
                      value: 'apr',
                    },
                    {
                      label: 'Earned',
                      value: 'earned',
                    },
                    {
                      label: 'Total staked',
                      value: 'totalStaked',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </ControlStretch>
            </Flex>
            <Flex flexDirection="column" width="50%">
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Search')}
              </Text>
              <ControlStretch>
                <SearchInput onChange={handleChangeSearchQuery} placeholder="Search pools" />
              </ControlStretch>
            </Flex>
          </SearchSortContainer>
        </PoolControls>
        {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
        <div ref={loadMoreRef} />
        <Image
          mx="auto"
          mt="12px"
          src="/images/3d-syrup-bunnies.png"
          alt="Pancake illustration"
          width={192}
          height={184.5}
        />
      </Page>
    </>
  )
}

export default Pools
