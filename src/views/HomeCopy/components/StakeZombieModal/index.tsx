/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BalanceInput, Button, Flex, Image, Modal, Slider, Text } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useDrFrankenstein, useERC20 } from 'hooks/useContract'
import { BASE_EXCHANGE_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import tokens from 'config/constants/tokens'

interface Result {
  paidUnlockFee: boolean,
  rugDeposited: number
}

interface StakeZombieModalProps {
  details: {
    id: number,
    pid: number,
    name: string,
    path?: string,
    type?: string,
    withdrawalCooldown: string,
    nftRevivalTime?: string,
    rug?: any,
    artist?: any,
    stakingToken: any,
    result: Result
  },
  zombieBalance: BigNumber,
  poolInfo: any
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const StakeZombieModal: React.FC<StakeZombieModalProps> = ({ details: { rug, pid }, zombieBalance, poolInfo }) => {

  const drFrankenstein = useDrFrankenstein();
  const { account } = useWeb3React();

  console.log(poolInfo)

  const { theme } = useTheme();
  const [minStake, setMinStake] = useState(getFullDisplayBalance(new BigNumber(poolInfo.minimumStake), tokens.zmbe.decimals, 4));
  const [maxZombieBal, setMaxZombieBal] = useState(getFullDisplayBalance(zombieBalance, tokens.zmbe.decimals, 4));
  const [minPercentage, setMinPercentage] = useState(Math.round((parseFloat(minStake)/parseFloat(maxZombieBal))*100))
  const [percent, setPercent] = useState(minPercentage);
  const [stakeAmount, setStakeAmount] = useState(minStake);

  console.log(minPercentage)

  const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value || '0'
    setStakeAmount(inputValue);
    // const convertedInput = new BigNumber(inputValue).multipliedBy(new BigNumber(10).pow(tokens.zmbe.decimals))
    // const percentage = Math.floor(convertedInput.dividedBy().multipliedBy(100).toNumber())
    setStakeAmount(inputValue)
    // setPercent(percentage > 100 ? 100 : percentage)
  }

  const handleChangePercent = (sliderPercent: number) => {
    const percentageOfStakingMax = zombieBalance.dividedBy(100).multipliedBy(sliderPercent)
    const amountToStake = getFullDisplayBalance(percentageOfStakingMax, tokens.zmbe.decimals, tokens.zmbe.decimals)
    setStakeAmount(amountToStake)
    setPercent(sliderPercent)
  }

 

  const handleStakeZmbe = () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), tokens.zmbe.decimals);
      if(pid === 0){
        drFrankenstein.methods.enterStaking(convertedStakeAmount)
        .send({ from: account })
      }else{
        drFrankenstein.methods.deposit(pid, convertedStakeAmount)
        .send({ from: account })
      }
  }


  return <Modal title="Stake ZMBE" headerBackground={theme.colors.gradients.cardHeader}>
    <Flex alignItems="center" justifyContent="space-between" mb="8px">
      <Text bold>Stake</Text>
      <Flex alignItems="center" minWidth="70px">
        <Image src='/images/rugZombie/BasicZombie.png' width={24} height={24} alt='ZMBE' />
        <Text ml="4px" bold>
          ZMBE
        </Text>
      </Flex>
    </Flex>
    <BalanceInput
      value={stakeAmount}
      onChange={handleStakeInputChange}
      currencyValue='0 USD'
    />
    <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
      Balance: {getFullDisplayBalance(zombieBalance, tokens.zmbe.decimals, 4)}
    </Text>
    <Slider
      min={minPercentage}
      max={100}
      value={percent}
      onValueChanged={handleChangePercent}
      name="stake"
      valueLabel={`${percent}%`}
      step={1}
    />
    <Flex alignItems="center" justifyContent="space-between" mt="8px">
      <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(25)}>
        25%
        </StyledButton>
      <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(50)}>
        50%
        </StyledButton>
      <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(75)}>
        75%
        </StyledButton>
      <StyledButton scale="xs" mx="2px" p="4px 16px" varian="tertiary" onClick={() => handleChangePercent(100)}>
        MAX
        </StyledButton>
    </Flex>
    {zombieBalance.toString() === '0' ?
       <Button mt="8px" as="a" external href={`${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${getAddress(tokens.zmbe.address)}`} variant="secondary">
       Get ZMBE
     </Button> :
      <Button onClick={handleStakeZmbe} mt="8px" as="a" variant="secondary">
        Deposit ZMBE
      </Button>}
  </Modal>
}

export default StakeZombieModal
