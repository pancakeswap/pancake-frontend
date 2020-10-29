// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import { CAKE_PER_BLOCK, HARD_REWARD_PER_BLOCK, CAKE_POOL_PID, forShowPools } from 'config'
import { COMMUNITY_FARMS } from 'sushi/lib/constants'
import Button from 'components/Button'
import { Farm } from 'contexts/Farms'
import { useTokenBalance2, useBnbPrice, useCakePrice } from 'hooks/useTokenBalance'
import useFarms from 'hooks/useFarms'
import useSushi from 'hooks/useSushi'
import useAllStakedValue, { StakedValue } from 'hooks/useAllStakedValue'
import { getEarned, getMasterChefContract } from 'sushi/utils'
import { bnToDec } from 'utils'
import useModal from 'hooks/useModal'
import WalletProviderModal from 'components/WalletProviderModal'
import Page from 'components/layout/Page'
import Grid from 'components/layout/Grid'
import CommunityIcon from 'components/icons/CommunityIcon'
import CoreIcon from 'components/icons/CoreIcon'
import Tag from './Tag'
import useI18n from 'hooks/useI18n'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}

interface FarmCardsProps {
  removed: boolean
}

const FarmCards: React.FC<FarmCardsProps> = ({ removed }) => {
  const TranslateString = useI18n()
  const [farms] = useFarms()
  const stakedValue = useAllStakedValue()
  const stakedValueById = stakedValue.reduce((accum, value) => {
    return {
      ...accum,
      [value.pid]: value,
    }
  }, {})

  const cakePrice = stakedValueById[CAKE_POOL_PID] ? stakedValueById[CAKE_POOL_PID].tokenPriceInWeth : new BigNumber(0)

  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />, 'provider')

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

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
        apy: apy,
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
          : forShowPools.map((pool, index) => (
              <FCard key={index}>
                <CardImage>
                  <div style={{ textAlign: 'left' }}>
                    <Multiplier>{pool.multiplier}</Multiplier>
                    <div>
                      <Tag variant={pool.isCommunity ? 'pink' : 'purple'}>
                        {pool.isCommunity ? <CommunityIcon /> : <CoreIcon />}
                        <span style={{ marginLeft: '4px' }}>
                          {pool.isCommunity ? TranslateString(999, 'Community') : TranslateString(999, 'Core')}
                        </span>
                      </Tag>
                    </div>
                  </div>
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

                <Button onClick={handleUnlockClick}>{TranslateString(292, 'Unlock Wallet')}</Button>
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
  position: relative;
  background: ${(props) => props.theme.card.background};
  box-shadow: 0px 2px 10px rgba(171, 133, 115, 0.16);
  border-radius: 32px;
  flex: 1 0 30%;
  height: 309px;
  padding: 24px;
  justify-content: center;
  flex-direction: column;
  justify-content: space-around;
  display: flex;
  width: 100%;
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
  let totalValue2 = useTokenBalance2('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', farm.lpTokenAddress) * cakePrice * 2

  if (farm.pid === 11) {
    totalValue = totalValue1
  }
  if (COMMUNITY_FARMS.includes(farm.tokenSymbol)) {
    totalValue = totalValue2
  }

  const [startTime] = useState(1600783200)
  const [, setHarvestable] = useState(0)

  const { account } = useWallet()
  const { lpTokenAddress } = farm
  const sushi = useSushi()

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    const paddedDays = days < 10 ? `${days}` : days
    return (
      <span style={{ width: '100%' }}>
        {paddedDays} days {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

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

  const poolActive = true // startTime * 1000 - Date.now() <= 0
  const isCommunityFarm = COMMUNITY_FARMS.includes(farm.tokenSymbol)
  const TokenIcon = isCommunityFarm ? CommunityIcon : CoreIcon
  const tokenText = isCommunityFarm ? TranslateString(999, 'Community') : TranslateString(999, 'Core')

  return (
    <FCard>
      {farm.tokenSymbol === 'CAKE' && <StyledCardAccent />}
      <CardImage>
        <div style={{ textAlign: 'left' }}>
          <Multiplier>{farm.multiplier}</Multiplier>
          <div>
            <Tag variant={isCommunityFarm ? 'pink' : 'purple'}>
              <TokenIcon />
              <span style={{ marginLeft: '4px' }}>{tokenText}</span>
            </Tag>
          </div>
        </div>
        <img src={`/images/tokens/category-${farm.tokenSymbol}.png`} alt={farm.tokenSymbol} />
      </CardImage>
      <Label>
        <span>{TranslateString(316, 'Deposit')}</span>
        <span className="right">{farm.lpToken.toUpperCase().replace('PANCAKE', '')}</span>
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
        <Button disabled={!poolActive} text={poolActive ? 'Select' : undefined} to={`/farms/${farm.id}`}>
          {!poolActive && <Countdown date={new Date(startTime * 1000)} renderer={renderer} />}
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
  right: -4px;
  bottom: -2px;
  left: -4px;
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
