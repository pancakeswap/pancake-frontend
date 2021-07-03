/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import styled from 'styled-components'
import { BalanceInput, Button, Flex, Image, Modal, Slider, Text, useModal } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useDrFrankenstein } from 'hooks/useContract'
import { BASE_EXCHANGE_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import WarningModal from '../WarningModal'

interface Result {
  paidUnlockFee: boolean,
  rugDeposited: number
}

interface StakeModalProps {
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
  updateResult:any,
  onDismiss?: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const StakeModal: React.FC<StakeModalProps> = ({ details, details: { rug, pid }, updateResult, onDismiss }) => {

  let rugTokenBalance = BIG_ZERO;

  if (pid !== 0) {
    rugTokenBalance = useTokenBalance(getAddress(rug.address));
  }

  const drFrankenstein = useDrFrankenstein();
  const { account } = useWeb3React();

  const { theme } = useTheme();
  const [stakeAmount, setStakeAmount] = useState('');
  const [percent, setPercent] = useState(0)

  const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value || '0'
    setStakeAmount(inputValue);
  }

  const handleChangePercent = (sliderPercent: number) => {
    const percentageOfStakingMax = rugTokenBalance.dividedBy(100).multipliedBy(sliderPercent)
    const amountToStake = getFullDisplayBalance(percentageOfStakingMax, rug.decimals, rug.decimals)
    setStakeAmount(amountToStake)
    setPercent(sliderPercent)
  }

  const [onGetTokenClick] = useModal(
    <WarningModal
    url={`${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${getAddress(rug.address)}`} />,
  )

  const handleWithdrawal = () => {
    console.log('withdrawal')
  }

  const handleDepositRug = () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), rug.decimals);
    drFrankenstein.methods.depositRug(pid, convertedStakeAmount)
      .send({ from: account }).then(()=>{
        updateResult(pid);
        onDismiss();
      })
  }



  return <Modal  onDismiss={onDismiss} title={details.rug === '' ? "Stake $Zmbe" : `Stake ${rug.symbol}`} headerBackground={theme.colors.gradients.cardHeader}>
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
      Balance: {getFullDisplayBalance(rugTokenBalance, rug.decimals, 4)}
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
    {rugTokenBalance.toString() === '0' ?
       <Button mt="8px" as="a" onClick={onGetTokenClick} variant="secondary">
       Get {rug.symbol}
       {/* external href={`${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${getAddress(rug.address)}`} */}
     </Button> :
      <Button onClick={handleDepositRug} mt="8px" as="a" variant="secondary">
        Deposit {rug.symbol}
      </Button>}
  </Modal>
}

export default StakeModal
