// @ts-nocheck
import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Button, Flex } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, HARD_REWARD_PER_BLOCK, CAKE_POOL_PID } from 'config'
import { communityFarms, farmsConfig } from 'sushi/lib/constants'
import { Farm } from 'contexts/Farms'
import { useTokenBalance2, useBnbPrice, useCakePrice } from 'hooks/useTokenBalance'
import useFarms from 'hooks/useFarms'
import useSushi from 'hooks/useSushi'
import useI18n from 'hooks/useI18n'
import useAllStakedValue, { StakedValue } from 'hooks/useAllStakedValue'
import { getEarned, getMasterChefContract } from 'sushi/utils'
import { bnToDec } from 'utils'
import UnlockButton from 'components/UnlockButton'
import Page from 'components/layout/Page'
import Grid from 'components/layout/Grid'
import { CommunityTag, CoreTag } from 'components/Tags'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}

interface FarmCardsProps {
  removed: boolean
}

const FarmCards: React.FC<FarmCardsProps> = ({ removed }) => {
  const [farms] = useFarms()
  const stakedValue = useAllStakedValue()
  const TranslateString = useI18n()
  const stakedValueById = stakedValue.reduce((accum, value) => {
    return {
      ...accum,
      [value.pid]: value,
    }
  }, {})

  const cakePrice = stakedValueById[CAKE_POOL_PID] ? stakedValueById[CAKE_POOL_PID].tokenPriceInWeth : new BigNumber(0)

  const realFarms = !removed
    ? farms.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
    : farms.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')
  const bnbPrice = useBnbPrice()

  // temp fix
  const staxBalance = useTokenBalance2(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    '0x7cd05f8b960ba071fdf69c750c0e5a57c8366500',
  )
  const narBalance = useTokenBalance2(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    '0x745c4fd226e169d6da959283275a8e0ecdd7f312',
  )
  const nyaBalance = useTokenBalance2(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    '0x2730bf486d658838464a4ef077880998d944252d',
  )
  const bROOBEEBalance = useTokenBalance2(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    '0x970858016C963b780E06f7DCfdEf8e809919BcE8',
  )

  const rows = realFarms.reduce<FarmWithStakedValue[][]>((accum, farm) => {
    const stakedValueItem = stakedValueById[farm.pid]

    const cakeRewardPerBlock = stakedValueItem && CAKE_PER_BLOCK.times(stakedValueItem.poolWeight)

    const calculateCommunityApy = (balance: BigNumber) => {
      if (!stakedValueItem) {
        return null
      }

      return cakeRewardPerBlock.times(BLOCKS_PER_YEAR).div(balance).div(2)
    }

    let apy

    if (farm.pid === 11) {
      apy = stakedValueItem
        ? cakePrice
            .times(cakeRewardPerBlock)
            .times(BLOCKS_PER_YEAR)
            .div(stakedValueItem.tokenAmount)
            .div(2)
            .times(bnbPrice)
        : null
    } else if (farm.tokenSymbol === 'STAX') {
      apy = calculateCommunityApy(staxBalance)
    } else if (farm.tokenSymbol === 'NAR') {
      apy = calculateCommunityApy(narBalance)
    } else if (farm.tokenSymbol === 'NYA') {
      apy = calculateCommunityApy(nyaBalance)
    } else if (farm.tokenSymbol === 'bROOBEE') {
      apy = calculateCommunityApy(bROOBEEBalance)
    } else if (farm.tokenSymbol === 'HARD') {
      // TODO: Refactor APY for dual farm
      const cakeApy =
        stakedValueItem &&
        cakePrice.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(stakedValueItem.totalWethValue)
      const hardApy =
        stakedValueItem &&
        stakedValueItem.tokenPriceInWeth
          .times(HARD_REWARD_PER_BLOCK)
          .times(BLOCKS_PER_YEAR)
          .div(stakedValueItem.totalWethValue)

      apy = cakeApy && hardApy && cakeApy.plus(hardApy)
    } else {
      apy =
        stakedValueItem && !removed
          ? cakePrice.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(stakedValueItem.totalWethValue)
          : null
    }

    return [
      ...accum,
      {
        ...farm,
        ...stakedValueItem,
        apy,
      },
    ]
  }, [])

  return (
    <Page>
      <Grid>
        {rows.length > 0
          ? rows.map((farm) => (
              <FarmCard farm={farm} stakedValue={stakedValueById[farm.tokenSymbol]} removed={removed} />
            ))
          : farmsConfig
              .filter((f) => f.pid !== 0)
              .map((pool) => (
                <FCard key={pool.pid + pool.symbol}>
                  <CardImage>
                    <Flex flexDirection="column" alignItems="flex-start">
                      <Multiplier>{pool.multiplier}</Multiplier>
                      {pool.isCommunity ? <CommunityTag /> : <CoreTag />}
                    </Flex>
                    <img src={`/images/tokens/category-${pool.tokenSymbol}.png`} alt={pool.tokenSymbol} />
                  </CardImage>
                  <Label>
                    <span>{TranslateString(316, 'Deposit')}</span>
                    <span className="right">{pool.symbol}</span>
                  </Label>
                  <Label>
                    <span>{TranslateString(318, 'Earn')}</span>
                    <span className="right">CAKE</span>
                  </Label>
                  <Action>
                    <UnlockButton fullWidth />
                  </Action>
                </FCard>
              ))}
      </Grid>
    </Page>
  )
}

const CardImage = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 16px;
`

const Label = styled.div`
  line-height: 1.5rem;
  color: ${(props) => props.theme.colors.secondary};
  > span {
    float: left;
  }
  .right {
    float: right;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 900;
  }
`

const FCard = styled.div`
  align-self: stretch;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
  img {
    height: 80px;
    width: 80px;
  }
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: number
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed }) => {
  const TranslateString = useI18n()
  const totalValue1 = useTokenBalance2('0x55d398326f99059ff775485246999027b3197955', farm.lpTokenAddress) * 2
  let totalValue =
    useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', farm.lpTokenAddress) * useBnbPrice() * 2

  const cakePrice = useCakePrice()
  const totalValue2 =
    useTokenBalance2('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', farm.lpTokenAddress) * cakePrice * 2

  const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)

  if (farm.pid === 11) {
    totalValue = totalValue1
  }
  if (isCommunityFarm) {
    totalValue = totalValue2
  }

  const [, setHarvestable] = useState(0)

  const { account } = useWallet()
  const { lpTokenAddress } = farm
  const sushi = useSushi()

  useEffect(() => {
    async function fetchEarned() {
      if (sushi) return
      const earned = await getEarned(getMasterChefContract(sushi), lpTokenAddress, account)
      setHarvestable(bnToDec(earned))
    }
    if (sushi && account) {
      fetchEarned()
    }
  }, [sushi, lpTokenAddress, account, setHarvestable])

  return (
    <FCard>
      {farm.tokenSymbol === 'CAKE' && <StyledCardAccent />}
      <CardImage>
        <Flex flexDirection="column" alignItems="flex-start">
          <Multiplier>{farm.multiplier}</Multiplier>
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
        </Flex>
        <img src={`/images/tokens/category-${farm.tokenSymbol}.png`} alt={farm.tokenSymbol} />
      </CardImage>
      <Label>
        <span>{TranslateString(316, 'Deposit')}</span>
        <span className="right">{farm.lpToken && farm.lpToken.toUpperCase().replace('PANCAKE', '')}</span>
      </Label>
      <Label>
        <span>{TranslateString(318, 'Earn')}</span>
        <span className="right">{farm.tokenSymbol === 'HARD' ? 'CAKE & HARD' : 'CAKE'}</span>
      </Label>
      {!removed && (
        <Label>
          <span>{TranslateString(352, 'APY')}</span>
          <span className="right">
            {farm.apy
              ? `${farm.apy.times(new BigNumber(100)).toNumber().toLocaleString('en-US').slice(0, -1)}%`
              : 'Loading ...'}
          </span>
        </Label>
      )}
      <Action>
        <Button as={ReactRouterLink} to={`/farms/${farm.id}`} fullWidth>
          {TranslateString(999, 'Select')}
        </Button>
      </Action>
      {!removed && (
        <Label>
          <span>{TranslateString(23, 'Total Liquidity')}</span>
          <span className="right">
            {farm.lpToken !== 'BAKE-BNB Bakery LP' ? `$${parseInt(totalValue).toLocaleString()}` : '-'}
          </span>
        </Label>
      )}
      <ViewMore>
        <Link href={`https://bscscan.com/address/${farm.lpTokenAddress}`} target="_blank">
          {TranslateString(356, 'View on BscScan')} &gt;
        </Link>
      </ViewMore>
    </FCard>
  )
}

const Action = styled.div`
  padding: 16px 0;
`

const ViewMore = styled.div`
  padding-top: 16px;
`

const Link = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.colors.secondary};
`

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const Multiplier = styled.div`
  line-height: 25px;
  padding: 0 8px;
  background: #25beca;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.background};
  font-weight: 900;
  margin-bottom: 8px;
  display: inline-block;
`

export default FarmCards
