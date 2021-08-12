/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import styled from 'styled-components';
import { BalanceInput, Button, Flex, LinkExternal, Modal, Slider, Text } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme';
import { useDrFrankenstein } from 'hooks/useContract';
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { BIG_ZERO } from '../../../utils/bigNumber'
import { tombByPid } from '../../../redux/get'

interface WithdrawLpModalProps {
    pid: number,
    lpTokenBalance: BigNumber,
    updateResult:any,
    onDismiss?: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const WithdrawLpModal: React.FC<WithdrawLpModalProps> = ({ pid, updateResult, onDismiss }) => {
    const currentDate = Math.floor(Date.now() / 1000);

    const drFrankenstein = useDrFrankenstein();
    const { account } = useWeb3React();
    const tomb = tombByPid(pid)
    const { name, notNativeDex, exchange, poolInfo: {lpTotalSupply}, userInfo: { amount, tokenWithdrawalDate } } = tomb
    const { theme } = useTheme();
    let defaultAmount
    if(notNativeDex) {
      if(currentDate >= tokenWithdrawalDate) {
        defaultAmount = BIG_ZERO
      } else {
        defaultAmount = amount
      }
    } else {
      defaultAmount = BIG_ZERO
    }

    const [stakeAmount, setStakeAmount] = useState(defaultAmount);
  const hasEarlyWithdrawFee = tokenWithdrawalDate > currentDate
  const hasWhaleTax = stakeAmount.div(lpTotalSupply).gte(0.05)

  const [percent, setPercent] = useState(notNativeDex && hasEarlyWithdrawFee ? 100 : 0)

    const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value || '0'
        setStakeAmount(getDecimalAmount(new BigNumber(inputValue)));
    }


  let isDisabled = false
  let withdrawDetails = ''
  let additionalDetails = ''
  let learnMore = false
  const handleChangePercent = (sliderPercent: number) => {
    const percentageOfStakingMax = amount.multipliedBy(sliderPercent).dividedBy(100)
    const amountToStake = percentageOfStakingMax
    if (notNativeDex && hasEarlyWithdrawFee) {
      setStakeAmount(amount)
    } else {
      setStakeAmount(amountToStake)
    }
    setPercent(sliderPercent)
  }

  let formattedAmount = stakeAmount.toString()
  const index = stakeAmount.toString().indexOf('.')
  if (index >= 0) {
    formattedAmount = formattedAmount.substring(0, index)
  }

  const handleWithDrawEarly = () => {
    if (!isDisabled) {
      drFrankenstein.methods.withdrawEarly(pid, formattedAmount)
        .send({ from: account }).then(() => {
        updateResult(pid)
        onDismiss()
      })
    }
  }

  const handleWithDraw = () => {
    if (!isDisabled) {
      drFrankenstein.methods.withdraw(pid, formattedAmount)
        .send({ from: account }).then(() => {
        updateResult(pid)
        onDismiss()
      })
    }
  }

  const handleHarvestAndWithdrawAll = () => {
    if (!isDisabled) {
      drFrankenstein.methods.withdraw(pid, 0)
        .send({ from: account }).then(() => {
        updateResult(pid)
        drFrankenstein.methods.emergencyWithdraw(pid)
          .send({ from: account }).then(() => {
          updateResult(pid)
          onDismiss()
        })
      })
    }
  }

  if(new BigNumber(formattedAmount).gt(amount)) {
        isDisabled = true
        withdrawDetails = "Invalid Withdrawal: Insufficient ZMBE Staked"
    } else if(notNativeDex && hasEarlyWithdrawFee) {
        if (!amount.eq(formattedAmount)) {
          isDisabled = true
          withdrawDetails = `Partial Early Withdrawal's aren't supported on ${exchange} tombs.`
          additionalDetails = "You must withdraw max on early withdrawals during the migration."
          learnMore = true
          setPercent(100)
        }
    } else if(hasWhaleTax) {
    isDisabled = true
    withdrawDetails = `8% whale tax is enabled.`
    learnMore = true
  }

    return <Modal onDismiss={onDismiss} title='Withdraw LP Tokens' headerBackground={theme.colors.gradients.cardHeader}>
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
            <Text bold>Stake</Text>
            <Flex alignItems="center" minWidth="70px">
                <Text ml="4px" bold>
                    {name}
                </Text>
            </Flex>
        </Flex>
        <BalanceInput
            value={Math.round(getBalanceAmount(stakeAmount).times(10000).toNumber()) / 10000}
            onChange={handleStakeInputChange}
        />
        <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
            Balance: {getFullDisplayBalance(amount, 18, 4)}
        </Text>
        <Text mt="8px" ml="auto" color="tertiary" fontSize="12px" mb="8px">
            {withdrawDetails}
          <br/>
            {additionalDetails}
          {learnMore ? <LinkExternal>
            Learn More
          </LinkExternal> : null}
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
        {/* eslint-disable-next-line no-nested-ternary */}
        {currentDate >= tokenWithdrawalDate ?
            <Button mt="8px" as="a" onClick={handleWithDraw} disabled={isDisabled} variant="secondary">
                Withdraw {name}
            </Button> : notNativeDex ?
            <Button onClick={handleHarvestAndWithdrawAll} disabled={isDisabled} mt="8px" as="a" variant="secondary">
                Harvest & Withdraw Early
            </Button> :
            <Button onClick={handleWithDrawEarly} disabled={isDisabled} mt="8px" as="a" variant="secondary">
                Withdraw Early
            </Button>
        }
    </Modal>
}

export default WithdrawLpModal
