// @ts-nocheck
import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Button, Flex } from '@pancakeswap-libs/uikit'
import { communityFarms, contractAddresses } from 'sushi/lib/constants'
import { Farm } from 'contexts/Farms'
import { useTokenBalance2, useBnbPriceUSD, useCakePriceUSD } from 'hooks/useTokenBalance'
import useSushi from 'hooks/useSushi'
import useI18n from 'hooks/useI18n'
import { StakedValue } from 'hooks/useAllStakedValue'
import { getEarned, getMasterChefContract } from 'sushi/utils'
import { bnToDec } from 'utils'
import { CommunityTag, CoreTag } from 'components/Tags'
import UnlockButton from 'components/UnlockButton'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
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

const CAKE_TOKEN_ADDRESS = contractAddresses.sushi[56]
const BUSD_TOKEN_ADDRESS = '0x55d398326f99059ff775485246999027b3197955'
const WBNB_TOKEN_ADDRESS = contractAddresses.weth[56]

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed }) => {
  const TranslateString = useI18n()
  const cakePrice = useCakePriceUSD()
  const totalValueBUSDPool = useTokenBalance2(BUSD_TOKEN_ADDRESS, farm.lpTokenAddress) * 2
  const totalValueCakePool = useTokenBalance2(CAKE_TOKEN_ADDRESS, farm.lpTokenAddress) * cakePrice * 2
  const totalValueBNBPool = useTokenBalance2(WBNB_TOKEN_ADDRESS, farm.lpTokenAddress) * useBnbPriceUSD() * 2

  const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)

  let totalValue = totalValueBNBPool
  if (farm.pid === 11) {
    totalValue = totalValueBUSDPool
  }
  if (isCommunityFarm && farm.pid !== 37) {
    totalValue = totalValueCakePool
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

const FarmCardOffline: React.FC<FarmCardProps> = ({ pool }) => {
  const TranslateString = useI18n()

  return (
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
  )
}

export { FarmCard, FarmCardOffline }
