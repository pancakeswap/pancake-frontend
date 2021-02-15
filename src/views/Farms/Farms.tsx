import React, { useEffect, useCallback, useState, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading } from '@pancakeswap-libs/uikit'
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
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import Table from './components/Table/Table'
import FarmTabButtons from './components/FarmTabButtons'
import SearchInput from './components/SearchInput'
import { RowData } from './components/Table/Row'
import ToggleView from './components/ToggleView/ToggleView'
import { ViewMode } from './components/types'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0;
  position: relative;
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
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const ethPriceUsd = usePriceEthBusd()

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
        const lowered = query.toLowerCase()
        farmsToDisplayWithAPY = farmsToDisplayWithAPY.filter((farm: FarmWithStakedValue) => {
          if (farm.lpSymbol.toLowerCase().includes(lowered)) {
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
      icon: {
        image: farm.lpSymbol.split(' ')[0].toLocaleLowerCase(),
      },
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
        label: lpLabel,
        pid: farm.pid,
      },
      earned: {
        earnings: farm.userData ? getBalanceNumber(new BigNumber(farm.userData.earnings)) : null,
        pid: farm.pid,
      },
      staked: farm,
      details: {
        liquidity: Number(totalValue),
        lpName: farm.lpSymbol.toUpperCase(),
        liquidityUrlPathParts: getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses }),
      },
      links: {
        bsc: `https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`,
        info: `https://pancakeswap.info/pair/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`,
      },
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
      return <Table data={rowData} ref={tableRef} />
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
        <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
        <FarmTabButtons stackedOnly={stackedOnly} setStackedOnly={setStackedOnly} />
        <SearchInput onChange={handleChangeQuery} value={query} />
      </ControlContainer>
      {renderContent()}
      <Image src="/images/cakecat.png" alt="Pancake illustration" width={949} height={384} responsive />
    </Page>
  )
}

export default Farms
