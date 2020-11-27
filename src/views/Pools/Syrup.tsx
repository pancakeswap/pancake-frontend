import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Heading } from '@pancakeswap-libs/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import useSushi from 'hooks/useSushi'
import useI18n from 'hooks/useI18n'
import useAllStakedValue from 'hooks/useAllStakedValue'
import { getPools } from 'sushi/utils'
import Coming from './components/Coming'
import PoolCard from './components/PoolCard'

const Farm: React.FC = () => {
  const sushi = useSushi()
  const TranslateString = useI18n()
  const stakedValues = useAllStakedValue()

  const cakePrice = stakedValues.find((s) => s.tokenSymbol === 'CAKE')?.tokenPriceInWeth || new BigNumber(0)

  const pools = getPools(sushi).map((pool) => {
    const stakedValue = stakedValues.find((s) => s.tokenSymbol === pool.tokenName)
    return {
      ...pool,
      tokenPrice: stakedValue?.tokenPriceInWeth || new BigNumber(0),
      tokenPriceQuoteToken: stakedValue?.quoteToken,
      tokenDecimals: stakedValue?.tokenDecimals,
    }
  })

  const [finishedPools, openPools] = partition(pools, (pool) => pool.isFinished)

  return (
    <Page>
      <Hero>
        <div>
          <Heading as="h1" size="xxl" mb="16px">
            {TranslateString(282, 'SYRUP Pool')}
          </Heading>
          <ul>
            <li>{TranslateString(580, 'Stake CAKE to earn new tokens.')}</li>
            <li>{TranslateString(404, 'You can unstake at any time.')}</li>
            <li>{TranslateString(406, 'Rewards are calculated per block.')}</li>
          </ul>
        </div>
        <img src="/images/syrup.png" alt="SYRUP POOL icon" />
      </Hero>
      <Pools>
        {orderBy(openPools, ['sortOrder']).map((pool) => (
          <PoolCard key={pool.sousId} cakePrice={cakePrice} {...pool} />
        ))}
        <Coming />
        {orderBy(finishedPools, ['sortOrder']).map((pool) => (
          <PoolCard key={pool.sousId} cakePrice={cakePrice} {...pool} />
        ))}
      </Pools>
    </Page>
  )
}

const Hero = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-left: auto;
  margin-right: auto;
  max-width: 250px;
  padding: 48px 0;
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
  img {
    height: auto;
    max-width: 100%;
  }
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
    margin: 0;
    max-width: none;
  }
`

const Page = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 904px;
  padding-bottom: 48px;
  padding-left: 16px;
  padding-right: 16px;
  @media (min-width: 576px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (min-width: 968px) {
    padding-left: 32px;
    padding-right: 32px;
  }
`

const Pools = styled.div`
  align-items: start;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 16px;
  @media (min-width: 576px) {
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 24px;
  }
  @media (min-width: 852px) {
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 24px;
  }
  @media (min-width: 968px) {
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 32px;
  }
  & > div {
    grid-column: 2 / 8;
    @media (min-width: 576px) {
      grid-column: span 4;
    }
  }
`

export default Farm
