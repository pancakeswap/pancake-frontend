import { useCallback, useEffect, useMemo, useRef, useState, ReactElement } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Flex, Text, SearchInput, Select, OptionProps, PoolHelpers } from '@pancakeswap/uikit'
import partition from 'lodash/partition'
import { useTranslation } from '@pancakeswap/localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { latinise } from 'utils/latinise'
import { DeserializedPool, DeserializedPoolVault } from 'state/types'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import { useInitialBlock } from 'state/block/hooks'
import { BSC_BLOCK_TIME } from 'config'
import { Token } from '@pancakeswap/sdk'

import PoolTabButtons from '../PoolTabButtons'

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
  padding: 8px 0px;

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

const NUMBER_OF_POOLS_VISIBLE = 12

const POOL_START_BLOCK_THRESHOLD = (60 / BSC_BLOCK_TIME) * 4

interface ChildrenReturn {
  chosenPools: DeserializedPool[]
  viewMode: ViewMode
  stakedOnly: boolean
  showFinishedPools: boolean
  normalizedUrlSearch: string
}

const PoolControlsView: React.FC<{
  pools: DeserializedPool[]
  children: (childrenReturn: ChildrenReturn) => ReactElement
}> = ({ pools, children }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [stakedOnly, setStakedOnly] = useUserPoolStakedOnly()
  const [viewMode, setViewMode] = useUserPoolsViewMode()
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const normalizedUrlSearch = useMemo(
    () => (typeof router?.query?.search === 'string' ? router.query.search : ''),
    [router.query],
  )
  const [_searchQuery, setSearchQuery] = useState('')
  const searchQuery = normalizedUrlSearch && !_searchQuery ? normalizedUrlSearch : _searchQuery
  const [sortOption, setSortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)
  const initialBlock = useInitialBlock()

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
          const vault = pool as DeserializedPoolVault
          return vault.userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useCallback(() => {
    return openPoolsWithStartBlockFilter.filter((pool) => {
      if (pool.vaultKey) {
        const vault = pool as DeserializedPoolVault
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
  const showFinishedPools = router.pathname.includes('history')

  const handleChangeSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value),
    [],
  )

  const handleSortOptionChange = useCallback((option: OptionProps) => setSortOption(option.value), [])

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools() : openPoolsWithStartBlockFilter
  }

  chosenPools = useMemo(() => {
    const sortedPools = PoolHelpers.sortPools<Token>(account, sortOption, chosenPools).slice(0, numberOfPoolsVisible)

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      return sortedPools.filter((pool) => latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery))
    }
    return sortedPools
  }, [account, sortOption, chosenPools, numberOfPoolsVisible, searchQuery])

  chosenPoolsLength.current = chosenPools.length

  const childrenReturn: ChildrenReturn = useMemo(
    () => ({ chosenPools, stakedOnly, viewMode, normalizedUrlSearch, showFinishedPools }),
    [chosenPools, normalizedUrlSearch, showFinishedPools, stakedOnly, viewMode],
  )

  return (
    <>
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
      {children(childrenReturn)}
      <div ref={observerRef} />
    </>
  )
}

export default PoolControlsView
