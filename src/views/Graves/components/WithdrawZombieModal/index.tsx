/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import styled from 'styled-components'
import { BalanceInput, Button, Flex, Image, Modal, Slider, Text } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useDrFrankenstein } from 'hooks/useContract'
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import tokens from 'config/constants/tokens'
import { BIG_TEN, BIG_ZERO } from '../../../../utils/bigNumber'

interface Result {
    paidUnlockFee: boolean,
    rugDeposited: number,
    tokenWithdrawalDate: any,
    amount: any
}

interface WithdrawZombieModalProps {
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
    zombieUsdPrice: number,
    poolInfo: any,
    updateResult: any,
    onDismiss?: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const WithdrawZombieModal: React.FC<WithdrawZombieModalProps> = ({ details: { pid, result }, poolInfo, zombieUsdPrice, updateResult, onDismiss }) => {
    const currentDate = Math.floor(Date.now() / 1000);

    const drFrankenstein = useDrFrankenstein();
    const { account } = useWeb3React();

    const zombieStaked = new BigNumber(result.amount);

    const { theme } = useTheme();
    const [stakeAmount, setStakeAmount] = useState(BIG_ZERO);
    const [percent, setPercent] = useState(0)

    let withdrawalDetails = <div />
    let isDisabled = false
    const remainingAmount = new BigNumber(result.amount).minus(stakeAmount)
    const maxPartialAmount = new BigNumber(result.amount).minus(poolInfo.minimumStake)

    const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const ether = BIG_TEN.pow(18)
        const inputValue = event.target.value || '0'
        let bigInputValue = getDecimalAmount(new BigNumber(inputValue))
        const distanceFromPartialMax = Math.abs(maxPartialAmount.minus(bigInputValue).toNumber())
        const distanceFromMax = Math.abs(bigInputValue.minus(result.amount).toNumber())

        if(distanceFromPartialMax  < ether.toNumber()) {
            bigInputValue = maxPartialAmount
        }

        if(distanceFromMax  < ether.toNumber()) {
          bigInputValue = new BigNumber(result.amount)
        }
        setStakeAmount(bigInputValue);
    }

    const handleChangePercent = (sliderPercent: number) => {
        const percentageOfStakingMax = zombieStaked.dividedBy(100).multipliedBy(sliderPercent)
        let amountToStake
        if (sliderPercent !== 100) {
            if (zombieStaked.minus(percentageOfStakingMax).lt(poolInfo.minimumStake)) {
                amountToStake = zombieStaked.minus(poolInfo.minimumStake)
            } else {
                amountToStake = percentageOfStakingMax
            }
        } else {
            amountToStake = new BigNumber(zombieStaked)
        }
        setStakeAmount(amountToStake)
        setPercent(sliderPercent)
    }

    const handleWithDrawEarly = () => {
        if (pid === 0) {
            drFrankenstein.methods.leaveStakingEarly(stakeAmount)
                .send({ from: account }).then(() => {
                    updateResult(pid);
                    onDismiss()
                })
        } else {
            drFrankenstein.methods.withdrawEarly(pid, stakeAmount)
                .send({ from: account }).then(() => {
                    updateResult(pid);
                    onDismiss()
                })
        }
    }

    const handleWithDraw = () => {
        if (pid === 0) {
            drFrankenstein.methods.leaveStaking(stakeAmount)
                .send({ from: account }).then(() => {
                    updateResult(pid);
                    onDismiss()
                })
        } else {
            drFrankenstein.methods.withdraw(pid, stakeAmount)
                .send({ from: account }).then(() => {
                    updateResult(pid);
                    onDismiss()
                })
        }
    }

    if(stakeAmount.gt(result.amount)) {
        isDisabled = true
        withdrawalDetails = <Text mt="8px" ml="auto" color="tertiary" fontSize="12px" mb="8px">
            Invalid Withdrawal: Insufficient ZMBE Staked
        </Text>
    } else if(remainingAmount.lt(poolInfo.minimumStake) && !remainingAmount.eq(BIG_ZERO)) {
        isDisabled = true
        withdrawalDetails = <>
          <Text mt="8px" ml="auto" color="tertiary" fontSize="12px" mb="8px">
            Invalid Withdrawal: Remaining balance
          </Text>
          <Text mt="8px" ml="auto" color="tertiary" fontSize="12px" mb="8px">
            {`must be a minimum of ${getBalanceAmount(poolInfo.minimumStake).toString()} ZMBE`}
          </Text>
        </>
    }

    return <Modal onDismiss={onDismiss} title="Withdraw ZMBE" headerBackground={theme.colors.gradients.cardHeader}>
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
            Balance: {getFullDisplayBalance(zombieStaked, tokens.zmbe.decimals, 2)}
        </Text>
        {withdrawalDetails}
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
                Withdraw ZMBE
            </Button> :
            <Button onClick={handleWithDrawEarly} disabled={isDisabled} mt="8px" as="a" variant="secondary">
                Withdraw Early
            </Button>
        }
    </Modal>
}

export default WithdrawZombieModal
