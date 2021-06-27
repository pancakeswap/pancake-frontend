/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
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
    poolInfo: any
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const WithdrawLpModal: React.FC<WithdrawLpModalProps> = ({ details: { pid, result, name }, poolInfo }) => {

    const currentDate = Math.floor(Date.now() / 1000);

    const drFrankenstein = useDrFrankenstein();
    const { account } = useWeb3React();

    const lpStaked = new BigNumber(result.amount);

    const { theme } = useTheme();
    const [stakeAmount, setStakeAmount] = useState('');
    const [percent, setPercent] = useState(0)

    const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value || '0'
        setStakeAmount(inputValue);
    }

    const handleChangePercent = (sliderPercent: number) => {
        const percentageOfStakingMax = lpStaked.dividedBy(100).multipliedBy(sliderPercent)
        const amountToStake = getFullDisplayBalance(percentageOfStakingMax, 18, 18)
        setStakeAmount(amountToStake)
        setPercent(sliderPercent)
    }

    const handleWithDrawEarly = () => {
        const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), 18);

        drFrankenstein.methods.withdrawEarly(pid, convertedStakeAmount)
            .send({ from: account })
    }

    const handleWithDraw = () => {
        const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), 18);
        drFrankenstein.methods.withdraw(pid, convertedStakeAmount)
            .send({ from: account })
    }

    return <Modal title='Withdraw LP Tokens' headerBackground={theme.colors.gradients.cardHeader}>
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
            <Text bold>Stake</Text>
            <Flex alignItems="center" minWidth="70px">
                <Text ml="4px" bold>
                    {name}
                </Text>
            </Flex>
        </Flex>
        <BalanceInput
            value={stakeAmount}
            onChange={handleStakeInputChange}
            currencyValue='0 USD'
        />
        <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
            Balance: {getFullDisplayBalance(lpStaked, 18, 4)}
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
            <Button mt="8px" as="a" onClick={handleWithDraw} variant="secondary">
                Withdraw {name}
            </Button> :
            <Button onClick={handleWithDrawEarly} mt="8px" as="a" variant="secondary">
                Withdraw Early
            </Button>
        }
    </Modal>
}

export default WithdrawLpModal
