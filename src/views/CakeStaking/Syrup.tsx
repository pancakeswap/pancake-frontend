/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import orderBy from 'lodash/orderBy'
import { getContract } from 'utils/erc20'
import useSushi from 'hooks/useSushi'
import useI18n from 'hooks/useI18n'
import useAllStakedValue from 'hooks/useAllStakedValue'
import { useTokenBalance2 } from 'hooks/useTokenBalance'
import { getPools } from 'sushi/utils'

import PoolCardv2 from './components/PoolCardv2'
import Coming from './components/Coming'
import SyrupWarning from './components/SyrupWarning'
import { sousChefTeam } from 'sushi/lib/constants'

const CAKE_ADDRESS = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
const COMMUNITY_ADDR = {
  STAX: {
    lp: '0x7cd05f8b960ba071fdf69c750c0e5a57c8366500',
    token: '0x0Da6Ed8B13214Ff28e9Ca979Dd37439e8a88F6c4',
  },
  NAR: {
    lp: '0x745c4fd226e169d6da959283275a8e0ecdd7f312',
    token: '0xa1303e6199b319a891b79685f0537d289af1fc83',
  },
  NYA: {
    lp: '0x2730bf486d658838464a4ef077880998d944252d',
    token: '0xbfa0841f7a90c4ce6643f651756ee340991f99d5',
  },
  bROOBEE: {
    lp: '0x970858016C963b780E06f7DCfdEf8e809919BcE8',
    token: '0xe64f5cb844946c1f102bd25bbd87a5ab4ae89fbe',
  },
}

interface SyrupRowProps {
  syrupAddress: string
  sousId: number
  tokenName: string
  projectLink: string
  harvest: boolean
  tokenPerBlock?: string
  cakePrice: BigNumber
  tokenPrice: BigNumber
  isCommunity?: boolean
  isFinished?: boolean
}

const SyrupRow: React.FC<SyrupRowProps> = ({
  sousId,
  tokenName,
  projectLink,
  harvest,
  tokenPerBlock,
  cakePrice,
  tokenPrice,
  isCommunity,
  isFinished,
}) => {
  const { ethereum } = useWallet()
  const syrup = useMemo(() => {
    return getContract(ethereum as provider, '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
  }, [ethereum])

  // /!\ Dirty fix
  // The community LP are all against CAKE instead of BNB. Thus, the usual function for price computation didn't work.
  // This quick fix aim to properly compute the price of CAKE pools in order to get the correct APY.
  // This fix will need to be cleaned, by using config files instead of the COMMUNITY_ADDR,
  // and factorise the price computation logic.

  const cakeBalanceOnLP = useTokenBalance2(CAKE_ADDRESS, COMMUNITY_ADDR[tokenName]?.lp)
  const tokenBalanceOnLP = useTokenBalance2(COMMUNITY_ADDR[tokenName]?.token, COMMUNITY_ADDR[tokenName]?.lp)

  const price = (() => {
    if (isCommunity) {
      if (cakeBalanceOnLP === 0 || tokenBalanceOnLP === 0) return new BigNumber(0)
      const tokenBalanceOnLP_BN = new BigNumber(tokenBalanceOnLP)
      const cakeBalanceOnLP_BN = new BigNumber(cakeBalanceOnLP)
      const ratio = cakeBalanceOnLP_BN.div(tokenBalanceOnLP_BN)
      return ratio.times(cakePrice)
    }
    return tokenPrice
  })()

  return (
    <PoolCardv2
      syrup={syrup}
      cakePrice={cakePrice}
      tokenPrice={price}
      tokenPerBlock={tokenPerBlock}
      {...{ sousId, tokenName, projectLink, harvest, isCommunity, isFinished }}
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

    return pools.map((pool) => {
      const cakePrice = stakedValueObj['CAKE']?.tokenPriceInWeth || new BigNumber(0)
      const tokenPrice = stakedValueObj[pool.tokenName]?.tokenPriceInWeth || new BigNumber(0)
      return {
        ...pool,
        cakePrice,
        tokenPrice,
      }
    })
  }, [stakedValue, pools])

  // Separate active pools from finished pools so we can inject the callout
  const { openPools, finishedPools } = renderPools.reduce(
    (accum, pool) => {
      if (pool.isFinished) {
        return {
          ...accum,
          finishedPools: [...accum.finishedPools, pool],
        }
      }

      return {
        ...accum,
        openPools: [...accum.openPools, pool],
      }
    },
    { openPools: [], finishedPools: [] },
  )

  return (
    <Page>
      <SyrupWarning />
      <Hero>
        <div>
          <h1>Staking Pools</h1>
          <ul>
            <li>Stake CAKE to earn new tokens.</li>
            <li>{TranslateString(404, 'You can unstake at any time.')}</li>
            <li>{TranslateString(406, 'Rewards are calculated per block.')}</li>
          </ul>
        </div>
        <div>
          <img src="/images/syrup.png" alt="SYRUP POOL icon" />
        </div>
      </Hero>
      <Pools>
        {orderBy(openPools, ['sortOrder', 'isCommunity']).map((pool) => (
          <SyrupRow key={pool.sousId} {...pool} />
        ))}
        <Coming />
        {orderBy(finishedPools, ['sortOrder', 'isCommunity']).map((pool) => (
          <SyrupRow key={pool.sousId} {...pool} />
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
