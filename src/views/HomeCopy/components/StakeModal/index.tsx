/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import styled from 'styled-components'
import { BalanceInput, Button, Flex, Image, Modal, Slider, Text } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useERC20 } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { BIG_ZERO } from 'utils/bigNumber'

interface Result {
  paidUnlockFee: boolean,
  rugDeposited: number
}

interface StakeModalProps {
  details: {
    id: number,
    pid: number,
    name: string,
    path: string,
    type: string,
    withdrawalCooldown: string,
    nftRevivalTime: string,
    rug: any,
    artist?: any,
    stakingToken: any,
    result: Result
  },
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const StakeModal: React.FC<StakeModalProps> = ({details, details: { rug, pid }}) => {
  console.log(details,rug)
  
  let rugTokenBalance = BIG_ZERO;

  if(pid !==0 ){
    rugTokenBalance = useTokenBalance(getAddress(rug.address));
  }

  const { theme } = useTheme();
  const [stakeAmount, setStakeAmount] = useState('');
  const [percent, setPercent] = useState(0)

  const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value || '0'
    setStakeAmount(inputValue);
  }

  const handleChangePercent = (sliderPercent: number) => {
    const amountToStake = '0'
    setStakeAmount(amountToStake)
    setPercent(sliderPercent)
  }

  const handleWithdrawal = () => {
    console.log('withdrawal')
  }

  const handleDeposit = () => {
    console.log('deposit')
  }

  const handleConfirmClick = () => {
    console.log('confirm')
  }



  return <Modal title={details.rug === '' ? "Stake $Zmbe" : `Stake ${rug.symbol}`} headerBackground={theme.colors.gradients.cardHeader}>
    <Flex alignItems="center" justifyContent="space-between" mb="8px">
      <Text bold>Stake</Text>
      <Flex alignItems="center" minWidth="70px">
        <Image src={`/images/tokens/${rug.symbol}.png`} width={24} height={24} alt='ZMBE' />
        <Text ml="4px" bold>
          {rug.symbol}
          </Text>
      </Flex>
    </Flex>
    <BalanceInput
      value={stakeAmount}
      onChange={handleStakeInputChange}
      currencyValue='0 USD'
    />
    <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
      Balance: {rugTokenBalance.toString()}
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

    <Button mt="8px" as="a" variant="secondary">
      Get {rug.symbol}
        </Button>
  </Modal>
}

export default StakeModal
