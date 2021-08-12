/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import styled from 'styled-components'
import { BalanceInput, Button, Flex, Image, Modal, Slider, Text } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useDrFrankenstein } from 'hooks/useContract'
import { BASE_EXCHANGE_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { Grave } from '../../../../redux/types'
import { grave } from '../../../../redux/get'

interface StakeZombieModalProps {
  pid: number,
  zombieBalance: BigNumber,
  zombieUsdPrice: number,
  updateResult: any,
  onDismiss?: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const StakeZombieModal: React.FC<StakeZombieModalProps> = ({pid, zombieUsdPrice, zombieBalance, updateResult, onDismiss }) => {
  const {userInfo: {amount}, poolInfo} = grave(pid)
  const drFrankenstein = useDrFrankenstein();
  const { account } = useWeb3React();
  
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  
  const { theme } = useTheme();
  const [percent, setPercent] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(new BigNumber(poolInfo.minimumStake));

  const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value || '0'
    setStakeAmount(getDecimalAmount(new BigNumber(inputValue)));
  }

  const handleChangePercent = (sliderPercent: number) => {
    let percentageOfStakingMax
    let amountToStake
    if(amount.toString() === '0') {
      percentageOfStakingMax = zombieBalance.minus(poolInfo.minimumStake).dividedBy(100).multipliedBy(sliderPercent)
      amountToStake = percentageOfStakingMax.plus(poolInfo.minimumStake).toString()
    } else {
      percentageOfStakingMax = zombieBalance.multipliedBy(sliderPercent).dividedBy(100)
      amountToStake = percentageOfStakingMax.toString()
    }

    setStakeAmount(amountToStake)
    setPercent(sliderPercent)
  }

  const handleStakeZmbe = () => {
    let formattedAmount = stakeAmount.toString()
    const index = stakeAmount.toString().indexOf(".");
    if (index >= 0) {
      formattedAmount = formattedAmount.substring(0, index)
    }

      if(pid === 0){
        drFrankenstein.methods.enterStaking(formattedAmount)
        .send({ from: account }).then(()=>{
          updateResult(pid);
          toastSuccess(t('Staked ZMBE'))
          onDismiss();
        })
      } else {
        drFrankenstein.methods.deposit(pid, formattedAmount)
        .send({ from: account }).then(()=>{
          updateResult(pid)
          toastSuccess(t('Staked ZMBE'))
          onDismiss();
        })
      }
  }

  let stakingDetails = ''
  let isDisabled = false
  const bigStakeAmount = new BigNumber(stakeAmount)
  if(bigStakeAmount.gt(zombieBalance)) {
    isDisabled = true
    stakingDetails = "Invalid Stake: Insufficient ZMBE Balance"
  } else if(bigStakeAmount.plus(amount).lt(poolInfo.minimumStake)) {
    isDisabled = true
    stakingDetails = `Invalid Stake: Minimum ${getBalanceAmount(poolInfo.minimumStake).toString()} ZMBE`
  }

  return <Modal  onDismiss={onDismiss} title="Stake ZMBE" headerBackground={theme.colors.gradients.cardHeader}>
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
      value={Math.round(getBalanceAmount(stakeAmount).times(100).toNumber()) / 100}
      onChange={handleStakeInputChange}
      currencyValue={`${Math.round(getBalanceAmount(stakeAmount).times(zombieUsdPrice).times(100).toNumber()) / 100} USD`}
    />
    <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
      Balance: {getFullDisplayBalance(zombieBalance, tokens.zmbe.decimals, 4)}
    </Text>
    <Text mt="8px" ml="auto" color="tertiary" fontSize="12px" mb="8px">
      {stakingDetails}
    </Text>
    <Slider
      min={0}
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
       <Button mt="8px" as="a" external href={`${BASE_EXCHANGE_URL}/swap?outputCurrency=${getAddress(tokens.zmbe.address)}`} variant="secondary">
       Get ZMBE
     </Button> :
      <Button onClick={handleStakeZmbe} disabled={isDisabled} mt="8px" as="a" variant="secondary">
        Deposit ZMBE
      </Button>}
  </Modal>
}

export default StakeZombieModal
