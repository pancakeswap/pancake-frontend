/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import styled from 'styled-components';
import { BalanceInput, Button, Flex, Modal, Slider, Text } from '@rug-zombie-libs/uikit';
import useTheme from 'hooks/useTheme';
import { useDrFrankenstein } from 'hooks/useContract';
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { BIG_ZERO } from '../../../utils/bigNumber'

interface Result {
    paidUnlockFee: boolean,
    rugDeposited: number,
    tokenWithdrawalDate: any,
    amount: any
}

interface WithdrawLpModalProps {
    details: {
        id: number,
        pid: number,
        name: string,
        withdrawalCooldown: string,
        artist?: any,
        stakingToken: any,
        result: Result
    },
    lpTokenBalance: BigNumber,
    poolInfo: any,
    updateResult:any,
    onDismiss?: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const WithdrawLpModal: React.FC<WithdrawLpModalProps> = ({ details: { pid, result, name }, updateResult, onDismiss }) => {
    const currentDate = Math.floor(Date.now() / 1000);

    const drFrankenstein = useDrFrankenstein();
    const { account } = useWeb3React();

    const lpStaked = new BigNumber(result.amount);

    const { theme } = useTheme();
    const [stakeAmount, setStakeAmount] = useState(BIG_ZERO);
    const [percent, setPercent] = useState(0)

    const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value || '0'
        setStakeAmount(getDecimalAmount(new BigNumber(inputValue)));
    }

    const handleChangePercent = (sliderPercent: number) => {
        const percentageOfStakingMax = lpStaked.multipliedBy(sliderPercent).dividedBy(100)
        const amountToStake = percentageOfStakingMax
        setStakeAmount(amountToStake)
        setPercent(sliderPercent)
    }

    let formattedAmount = stakeAmount.toString()
    const index = stakeAmount.toString().indexOf(".");
    if (index >= 0) {
        formattedAmount = formattedAmount.substring(0, index)
    }

    const handleWithDrawEarly = () => {
        drFrankenstein.methods.withdrawEarly(pid, formattedAmount)
            .send({ from: account }).then(() => {
                updateResult(pid);
                onDismiss()
            })
    }

    const handleWithDraw = () => {
        drFrankenstein.methods.withdraw(pid, formattedAmount)
            .send({ from: account }).then(()=>{
                updateResult(pid);
                onDismiss()
            })
    }

    let isDisabled = false
    let withdrawDetails = ''
    if(new BigNumber(formattedAmount).gt(result.amount)) {
        isDisabled = true
        withdrawDetails = "Invalid Withdrawal: Insufficient ZMBE Staked"
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
            Balance: {getFullDisplayBalance(lpStaked, 18, 4)}
        </Text>
        <Text mt="8px" ml="auto" color="tertiary" fontSize="12px" mb="8px">
            {withdrawDetails}
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
        {currentDate >= parseInt(result.tokenWithdrawalDate) ?
            <Button mt="8px" as="a" onClick={handleWithDraw} disabled={isDisabled} variant="secondary">
                Withdraw {name}
            </Button> :
            <Button onClick={handleWithDrawEarly} disabled={isDisabled} mt="8px" as="a" variant="secondary">
                Withdraw Early
            </Button>
        }
    </Modal>
}

export default WithdrawLpModal
