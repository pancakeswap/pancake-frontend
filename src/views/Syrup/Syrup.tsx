/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getContract } from '../../utils/erc20'
import useSushi from '../../hooks/useSushi'
import useI18n from '../../hooks/useI18n'
import useAllStakedValue from '../../hooks/useAllStakedValue'
import { getPools } from '../../sushi/utils'

import PoolCardv2 from './components/PoolCardv2'
import Coming from './components/Coming'
import { sousChefTeam } from '../../sushi/lib/constants'

interface SyrupRowProps {
  syrupAddress: string
  sousId: number
  tokenName: string
  projectLink: string
  harvest: boolean
  tokenPerBlock?: string
  cakePrice: BigNumber
  tokenPrice: BigNumber
  community?: boolean
}

const SyrupRow: React.FC<SyrupRowProps> = ({
  sousId,
  tokenName,
  projectLink,
  harvest,
  tokenPerBlock,
  cakePrice,
  tokenPrice,
  community
}) => {
  const { ethereum } = useWallet()
  const syrup = useMemo(() => {
    return getContract(
      ethereum as provider,
      '0x009cF7bC57584b7998236eff51b98A168DceA9B0',
    )
  }, [ethereum])

  return (
    <PoolCardv2
      syrup={syrup}
      cakePrice={cakePrice}
      tokenPrice={tokenPrice}
      tokenPerBlock={tokenPerBlock}
      {...{ sousId, tokenName, projectLink, harvest, community }}
    />
  )
}

const Farm: React.FC = () => {
  const sushi = useSushi()
  const TranslateString = useI18n()
  const stakedValue = useAllStakedValue()
  const pools = getPools(sushi) || sousChefTeam
  const renderPools = useMemo(() => {
    const stakedValueObj = stakedValue.reduce(
      (a, b) => ({
        ...a,
        [b.tokenSymbol]: b,
      }),
      {},
    )

    return pools.map((pool) => ({
      ...pool,
      cakePrice: stakedValueObj['CAKE']?.tokenPriceInWeth || new BigNumber(0),
      tokenPrice:
        stakedValueObj[pool.tokenName]?.tokenPriceInWeth || new BigNumber(0),
    }))
  }, [stakedValue, pools])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Page>
      <Hero>
        <div>
          <h1>{TranslateString(336, 'SYRUP Pool')}</h1>
          <ul>
            <li>{TranslateString(402, 'Stake SYRUP to earn new tokens.')}</li>
            <li>{TranslateString(404, 'You can unstake at any time.')}</li>
            <li>{TranslateString(406, 'Rewards are calculated per block.')}</li>
          </ul>
        </div>
        <div>
          <img src="/images/syrup.png" alt="SYRUP POOL icon" />
        </div>
      </Hero>
      <Pools>
        {renderPools.map((pool) => (
          <SyrupRow key={pool.tokenName} {...pool} />
        ))}
        <Coming />
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

  h1 {
    font-size: 64px;
    color: ${({ theme }) => theme.colors.secondary2};
    line-height: 1.1;
    margin: 0 0 32px 0;
  }

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
