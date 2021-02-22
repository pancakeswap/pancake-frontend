import React, { useEffect, useCallback, useState, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Image, Heading, RowType, useMatchBreakpoints, Toggle, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd, usePriceEthBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import { provider } from 'web3-core'

import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import Table from './components/Table/Table'
import FarmTabButtons from './components/FarmTabButtons'
import SearchInput from './components/SearchInput'
import { RowData } from './components/Table/Row'
import ToggleView from './components/ToggleView/ToggleView'
import { DesktopColumnSchema, MobileColumnSchema, ViewMode } from './components/types'
import Select, { OptionProps } from './components/Select/Select'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  border-radius: 32px 32px 0px 0px;
  height: 125px;
  padding: 0px 16px;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0px 32px;
  }

  > div {
    display: flex;
    align-items: center;
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

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState(ViewMode.TABLE)
  const ethPriceUsd = usePriceEthBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stackedOnly, setStackedOnly] = useState(false)

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')

  const tableRef = useRef(null)

  const stackedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay): FarmWithStakedValue[] => {
      const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
        }
        const cakeRewardPerBlock = CAKE_PER_BLOCK.times(farm.poolWeight)
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        // cakePriceInQuote * cakeRewardPerYear / lpTotalInQuoteToken
        let apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)

        if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.UST) {
          apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken).times(bnbPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          apy = cakePrice.div(ethPriceUsd).times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
          apy = cakeRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.dual) {
          const cakeApy =
            farm && cakePriceVsBNB.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken)

          apy = cakeApy && dualApy && cakeApy.plus(dualApy)
        }

        return { ...farm, apy }
      })

      if (query) {
        const lowercaseQuery = query.toLowerCase()
        farmsToDisplayWithAPY = farmsToDisplayWithAPY.filter((farm: FarmWithStakedValue) => {
          if (farm.lpSymbol.toLowerCase().includes(lowercaseQuery)) {
            return true
          }

          return false
        })
      }
      return farmsToDisplayWithAPY
    },
    [bnbPrice, farmsLP, query, cakePrice, ethPriceUsd],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const isActive = !pathname.includes('history')
  let farmsStaked = []
  if (isActive) {
    farmsStaked = stackedOnly ? farmsList(stackedOnlyFarms) : farmsList(activeFarms)
  } else {
    farmsStaked = farmsList(inactiveFarms)
  }

  const rowData = farmsStaked.map((farm) => {
    let totalValue = farm.lpTotalInQuoteToken

    if (!farm.lpTotalInQuoteToken) {
      totalValue = null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      totalValue = bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
      totalValue = cakePrice.times(farm.lpTotalInQuoteToken)
    }

    const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
    const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')

    const row: RowData = {
      apr: {
        value: farm.apy
          ? Number(`${farm.apy.times(new BigNumber(100)).toNumber().toLocaleString('en-US').slice(0, -1)}`)
          : null,
        multiplier: farm.multiplier,
        lpLabel,
        quoteTokenAdresses,
        quoteTokenSymbol,
        tokenAddresses,
        cakePrice,
        originalValue: farm.apy,
      },
      farm: {
        image: farm.lpSymbol.split(' ')[0].toLocaleLowerCase(),
        label: lpLabel,
        pid: farm.pid,
      },
      earned: {
        earnings: farm.userData ? getBalanceNumber(new BigNumber(farm.userData.earnings)) : null,
        pid: farm.pid,
      },
      liquidity: {
        liquidity: Number(totalValue),
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      details: farm,
    }

    return row
  })

  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
      const columnSchema = isMobile ? MobileColumnSchema : DesktopColumnSchema

      const columns = columnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.normal,
        sort: (a: RowType<RowData>, b: RowType<RowData>) => {
          switch (column.name) {
            case 'farm':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }

              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      }))

      return <Table data={rowData} ref={tableRef} columns={columns} />
    }

    return (
      <div>
        <FlexLayout>
          <Route exact path={`${path}`}>
            {farmsStaked.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                bnbPrice={bnbPrice}
                cakePrice={cakePrice}
                ethPrice={ethPriceUsd}
                ethereum={ethereum}
                account={account}
                removed={false}
              />
            ))}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsStaked.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                bnbPrice={bnbPrice}
                cakePrice={cakePrice}
                ethPrice={ethPriceUsd}
                ethereum={ethereum}
                account={account}
                removed
              />
            ))}
          </Route>
        </FlexLayout>
      </div>
    )
  }

  return (
    <Page>
      <Heading as="h1" size="lg" color="secondary" mb="50px" style={{ textAlign: 'center' }}>
        {TranslateString(696, 'Stake LP tokens to earn CAKE')}
      </Heading>
      <ControlContainer>
        <div>
          <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
          <ToggleWrapper>
            <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} scale="sm" />
            <Text> {TranslateString(1116, 'Staked only')}</Text>
          </ToggleWrapper>
          <FarmTabButtons />
        </div>
        <div>
          <LabelWrapper>
            <Text>SORT BY</Text>
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
                  label: 'Multiplier',
                  value: 'multiplier',
                },
                {
                  label: 'Earned',
                  value: 'earned',
                },
                {
                  label: 'Liquidity',
                  value: 'liquidity',
                },
              ]}
            />
          </LabelWrapper>
          <LabelWrapper style={{ marginLeft: 16 }}>
            <Text>SEARCH</Text>
            <SearchInput onChange={handleChangeQuery} value={query} />
          </LabelWrapper>
        </div>
      </ControlContainer>
      {renderContent()}
      <Image src="/images/cakecat.png" alt="Pancake illustration" width={949} height={384} responsive />
    </Page>
  )
}

export default Farms
