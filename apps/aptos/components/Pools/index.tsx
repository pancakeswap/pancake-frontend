import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Heading,
  Flex,
  PageHeader,
  ScrollToTopButtonV2,
  Text,
  Select,
  SearchInput,
  OptionProps,
  Image,
  Loading,
  Link,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import Portal from 'components/Portal'
import { usePoolsStakedOnly, usePoolsViewMode, ViewMode } from 'state/user'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { latinise } from 'utils/latinise'
import partition from 'lodash/partition'
import BigNumber from 'bignumber.js'
import orderBy from 'lodash/orderBy'
import * as data from './data'
import PoolTabButtons from './components/PoolTabButtons'
import NoSSR from '../NoSSR'

const BSC_BLOCK_TIME = 3

const PoolControls = styled.div`
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

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`
const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
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

const NUMBER_OF_POOLS_VISIBLE = 12

const POOL_START_BLOCK_THRESHOLD = (60 / BSC_BLOCK_TIME) * 4

const sortPools = (sortOption: string, pools: any[], poolsToSort: any[]) => {
  switch (sortOption) {
    case 'apr':
      // Ternary is needed to prevent pools without APR (like MIX) getting top spot
      return orderBy(poolsToSort, (pool) => (pool.apr ? pool.apr : 0), 'desc')
    case 'latest':
      return orderBy(poolsToSort, (pool) => Number(pool.sousId), 'desc')
    default:
      return poolsToSort
  }
}

const PoolsPage: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [viewMode, setViewMode] = usePoolsViewMode()
  const [stakedOnly, setStakedOnly] = usePoolsStakedOnly()
  const [sortOption, setSortOption] = useState('hot')
  const [_searchQuery, setSearchQuery] = useState('')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const chosenPoolsLength = useRef(0)
  // todo
  const userDataLoaded = true
  const initialBlock = 0

  const pools = data.pools as any

  const normalizedUrlSearch = useMemo(
    () => (typeof router?.query?.search === 'string' ? router.query.search : ''),
    [router.query],
  )
  const searchQuery = normalizedUrlSearch && !_searchQuery ? normalizedUrlSearch : _searchQuery
  const showFinishedPools = router.pathname.includes('history')

  const handleSortOptionChange = useCallback((option: OptionProps) => setSortOption(option.value), [])

  const handleChangeSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value),
    [],
  )

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const openPoolsWithStartBlockFilter = useMemo(
    () =>
      openPools.filter((pool) =>
        initialBlock > 0 && pool.startBlock
          ? Number(pool.startBlock) < initialBlock + POOL_START_BLOCK_THRESHOLD
          : true,
      ),
    [initialBlock, openPools],
  )
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.vaultKey) {
          const vault = pool
          return vault.userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useCallback(() => {
    return openPoolsWithStartBlockFilter.filter((pool) => {
      if (pool.vaultKey) {
        const vault = pool
        return vault.userData.userShares.gt(0)
      }
      return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
    })
  }, [openPoolsWithStartBlockFilter])

  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
        if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
          return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        }
        return poolsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools() : openPoolsWithStartBlockFilter
  }

  chosenPools = useMemo(() => {
    const sortedPools = sortPools(sortOption, pools, chosenPools).slice(0, numberOfPoolsVisible)

    console.log('sortedPools', sortedPools)

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      return sortedPools.filter((pool) => latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery))
    }
    return sortedPools
  }, [sortOption, pools, chosenPools, numberOfPoolsVisible, searchQuery])

  chosenPoolsLength.current = chosenPools.length

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
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
        </Flex>
      </PageHeader>
      <Page>
        <NoSSR>
          <PoolControls>
            <PoolTabButtons
              stakedOnly={stakedOnly}
              setStakedOnly={setStakedOnly}
              hasStakeInFinishedPools={hasStakeInFinishedPools}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <FilterContainer>
              <LabelWrapper>
                <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                  {t('Sort by')}
                </Text>
                <ControlStretch>
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
                        label: t('Earned'),
                        value: 'earned',
                      },
                      {
                        label: t('Total staked'),
                        value: 'totalStaked',
                      },
                      {
                        label: t('Latest'),
                        value: 'latest',
                      },
                    ]}
                    onOptionChange={handleSortOptionChange}
                  />
                </ControlStretch>
              </LabelWrapper>
              <LabelWrapper style={{ marginLeft: 16 }}>
                <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                  {t('Search')}
                </Text>
                <SearchInput initialValue={searchQuery} onChange={handleChangeSearchQuery} placeholder="Search Pools" />
              </LabelWrapper>
            </FilterContainer>
          </PoolControls>
        </NoSSR>
        {showFinishedPools && (
          <FinishedTextContainer>
            <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
              {t('Looking for v1 CAKE syrup pools?')}
            </Text>
            <FinishedTextLink href="/migration" fontSize={['16px', null, '20px']} color="failure">
              {t('Go to migration page')}.
            </FinishedTextLink>
          </FinishedTextContainer>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}
        {/* pools list */}
        <NoSSR>
          {viewMode}
          {chosenPools.map((pool) => {
            return (
              <Flex key={pool.sousId} py={2}>
                <Flex mr={2}>StakingToken: {pool.stakingToken.symbol}</Flex>
                <Flex mr={2}>EarningToken: {pool.earningToken.symbol}</Flex>
                <Flex mr={2}>APR: {pool.apr}</Flex>
              </Flex>
            )
          })}
        </NoSSR>
        <div ref={observerRef} />
        <Image
          mx="auto"
          mt="12px"
          src="/decorations/3d-syrup-bunnies.png"
          alt="Pancake illustration"
          width={192}
          height={184.5}
        />
      </Page>
      <Portal>
        <ScrollToTopButtonV2 />
      </Portal>
    </>
  )
}

export default PoolsPage
