// @ts-nocheck
import BigNumber from 'bignumber.js'
import React, { useEffect, useState, useCallback } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Farm } from '../../../contexts/Farms'
import { useTokenBalance2, useBnbPrice } from '../../../hooks/useTokenBalance'
import useFarms from '../../../hooks/useFarms'
import useSushi from '../../../hooks/useSushi'
import useAllStakedValue, {
  StakedValue,
} from '../../../hooks/useAllStakedValue'
import { getEarned, getMasterChefContract } from '../../../sushi/utils'
import { bnToDec } from '../../../utils'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { forShowPools, BLOCKS_PER_YEAR } from  '../../../sushi/lib/constants'

import useModal from '../../../hooks/useModal'
import AccountModal from '../../../components/TopBar/components/AccountModal.tsx'
import WalletProviderModal from '../../../components/WalletProviderModal'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}

interface FarmCardsProps {
  removed: boolean
}

const FarmCards: React.FC<FarmCardsProps> = ({removed}) => {
  const [farms] = useFarms()
  const { account } = useWallet()
  const stakedValue = useAllStakedValue()

  const sushiIndex = farms.findIndex(
    ({ tokenSymbol }) => tokenSymbol === 'CAKE',
  )

  const sushiPrice =
    sushiIndex >= 0 && stakedValue[sushiIndex]
      ? stakedValue[sushiIndex].tokenPriceInWeth
      : new BigNumber(0)

  // console.log(sushiPrice, stakedValue)
  const SUSHI_PER_BLOCK = new BigNumber(40)


  const [onPresentAccountModal] = useModal(<AccountModal />)
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  const realFarms =!removed ? farms.filter(farm => farm.pid !== 0 && farm.multiplier != '0X')
                    : farms.filter(farm => farm.pid !== 0 && farm.multiplier == '0X')
  const realStakedValue = stakedValue.slice(1)
  const bnbPrice = useBnbPrice()
  // console.log(bnbPrice)

  const rows = realFarms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      let apy
      // if(farm.pid==8) {
      //   console.log(realStakedValue[i].poolWeight)
      // }
      if(farm.pid == 11) {
        apy = realStakedValue[i] ? sushiPrice
              .times(SUSHI_PER_BLOCK)
              .times(BLOCKS_PER_YEAR)
              .times(realStakedValue[i].poolWeight)
              .div(realStakedValue[i].tokenAmount)
              .div(2)
              .times(bnbPrice) : null
      }
      else {
        apy = realStakedValue[i]  && !removed ? sushiPrice
              .times(SUSHI_PER_BLOCK)
              .times(BLOCKS_PER_YEAR)
              .times(realStakedValue[i].poolWeight)
              .div(realStakedValue[i].totalWethValue) : null

      }
      const farmWithStakedValue = {
        ...farm,
        ...realStakedValue[i],
        apy: apy
      }
      const newFarmRows = [...farmRows]
      if (newFarmRows[newFarmRows.length - 1].length === 3) {
        newFarmRows.push([farmWithStakedValue])
      } else {
        newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      }
      return newFarmRows
    },
    [[]],
  )


  return (
    <StyledCards>
      {!!rows[0].length ? (
        rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} stakedValue={realStakedValue[j]}  removed={removed}/>
                {(j === 0 || j === 1) && <StyledSpacer />}
              </React.Fragment>
            ))}
          </StyledRow>
        ))
      ) : (
        <StyledLoadingWrapper>
          <FContent>
          {
            forShowPools.map((pool, index) =>
              <FCard key={index}>
                <CardImage>
                <Multiplier>{pool.multiplier}</Multiplier>
                <img src={require(`../../../assets/img/category-${pool.tokenSymbol}.png`)} alt="" />
                </CardImage>
                <Lable><span>Deposit</span><span  className="right">{pool.symbol}</span></Lable>
                <Lable><span>Earn</span><span  className="right">CAKE</span></Lable>

                <Button onClick={handleUnlockClick} size="md" text="Unlock Wallet" />
              </FCard>)
          }
          </FContent>
        </StyledLoadingWrapper>
      )}
    </StyledCards>
  )
}

const FContent= styled.div`
  display: flex;
  margin-bottom: 24px;
  flex-wrap: wrap;
  @media (max-width: 500px) {
    justify-content: center;
  }
`

const CardImage = styled.div`
  text-align: center;
`

const Lable = styled.div`
line-height: 1.5rem;
color: ${(props) => props.theme.colors.secondary};
  >span {
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
  background: ${(props) => props.theme.colors.cardBg};
  box-shadow: 0px 2px 10px rgba(171, 133, 115, 0.16);
  border-radius: 20px;
  height: 309px;
  padding: 20px;
  justify-content: center;
  flex-direction:column;
  justify-content:space-around;
  display: flex;
  width: 240px;
  text-align: center;
  margin: 6px;
  img {
    height: 80px;
    width: 80px;
  }
  @media (max-width: 500px) {
    margin: 10px;
  }

`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, stakedValue, removed }) => {
  const totalValue1 = useTokenBalance2('0x55d398326f99059ff775485246999027b3197955', farm.lpTokenAddress) *2
  let totalValue = useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', farm.lpTokenAddress) * useBnbPrice() *2

  if(farm.pid == 11) {
    totalValue = totalValue1
  }

  const [startTime, setStartTime] = useState(1600783200)
  const [harvestable, setHarvestable] = useState(0)

  // setStartTime(1600695000)

  const { account } = useWallet()
  const { lpTokenAddress } = farm
  const sushi = useSushi()

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { days,  hours, minutes, seconds } = countdownProps
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
      const earned = await getEarned(
        getMasterChefContract(sushi),
        lpTokenAddress,
        account,
      )
      setHarvestable(bnToDec(earned))
    }
    if (sushi && account) {
      fetchEarned()
    }
  }, [sushi, lpTokenAddress, account, setHarvestable])

  const poolActive = true // startTime * 1000 - Date.now() <= 0

  return (
    <StyledCardWrapper>
      {farm.tokenSymbol === 'CAKE' && <StyledCardAccent />}

          <StyledContent>
            <FCard>
            <CardImage>
              <Multiplier>{farm.multiplier}</Multiplier>
              <img src={require(`../../../assets/img/category-${farm.tokenSymbol}.png`)} alt="" />
            </CardImage>
            <Lable><span>Deposit</span><span  className="right">{farm.lpToken.toUpperCase().replace("PANCAKE", "")}</span></Lable>
            <Lable><span>Earn</span><span  className="right">CAKE</span></Lable>
            { !removed &&
            <Lable>
              <span>APY</span>
              <span className="right">
                {farm.apy
                  ? `${farm.apy
                      .times(new BigNumber(100))
                      .toNumber()
                      .toLocaleString('en-US')
                      .slice(0, -1)}%`
                  : 'Loading ...'}
              </span>
            </Lable>
            }


            <Button
              disabled={!poolActive}
              text={poolActive ? 'Select' : undefined}
              to={`/farms/${farm.id}`}
            >
              {!poolActive && (
                <Countdown
                  date={new Date(startTime * 1000)}
                  renderer={renderer}
                />
              )}
            </Button>
            <StyledSpacer2 />
            {!removed &&
            <Lable><span>Total Liquidity</span><span  className="right">{farm.lpToken !== 'BAKE-BNB Bakery LP' ? `$${parseInt(totalValue).toLocaleString()}`: '-'}</span></Lable>
            }
            <Link href={`https://bscscan.com/address/${farm.lpTokenAddress}`} target="_blank">View on BscScan &gt;</Link>
            </FCard>
          </StyledContent>

    </StyledCardWrapper>
  )
}


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
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.colors.primary};
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

const StyledContent = styled.div`
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const Multiplier = styled.div`
  position: absolute;
  line-height: 25px;
  padding: 0 12px;
  background: ${(props) => props.theme.colors.blue[100]};
  border-radius: 10px;
  color: ${(props) => props.theme.colors.bg};
  font-weight: 900;
  left: 20px;
  top: 20px;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledSpacer2 = styled.div`
  height: ${(props) => props.theme.spacing[1]}px;
  width: ${(props) => props.theme.spacing[1]}px;
`

const StyledDetails = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
`

const StyledDetail = styled.div`
  color: ${(props) => props.theme.colors.grey[500]};
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: #fffdfa;
  color: #aa9584;
  width: 100%;
  margin-top: 12px;
  line-height: 32px;
  font-size: 13px;
  border: 1px solid #e6dcd5;
  text-align: center;
  padding: 0 12px;
`

export default FarmCards
