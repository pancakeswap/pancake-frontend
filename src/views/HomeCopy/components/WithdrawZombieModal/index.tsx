/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import styled from 'styled-components'
import { BalanceInput, Button, Flex, Image, Modal, Slider, Text } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useDrFrankenstein } from 'hooks/useContract'
import { getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import tokens from 'config/constants/tokens'
import { BIG_ZERO } from '../../../../utils/bigNumber'

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
    poolInfo: any
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const WithdrawZombieModal: React.FC<WithdrawZombieModalProps> = ({ details: { pid, result }, poolInfo }) => {

    const currentDate = Math.floor(Date.now() / 1000);

    const drFrankenstein = useDrFrankenstein();
    const { account } = useWeb3React();

    const zombieStaked =  new BigNumber(result.amount);

    const { theme } = useTheme();
    const [stakeAmount, setStakeAmount] = useState('');
    const [exactStakeAmount, setExactStakeAmount] = useState(BIG_ZERO);
    const [percent, setPercent] = useState(0)

    const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value || '0'
        setStakeAmount(inputValue);
    }

    const handleChangePercent = (sliderPercent: number) => {
        const percentageOfStakingMax = zombieStaked.dividedBy(100).multipliedBy(sliderPercent)
        let amountToStake
        if(sliderPercent !== 100) {
            if(zombieStaked.minus(percentageOfStakingMax).lt(poolInfo.minimumStake)) {
                amountToStake = getFullDisplayBalance(zombieStaked.minus(poolInfo.minimumStake), tokens.zmbe.decimals, 4)
            } else {
                amountToStake = getFullDisplayBalance(percentageOfStakingMax, tokens.zmbe.decimals, 4)
            }
            setExactStakeAmount(getDecimalAmount(amountToStake, tokens.zmbe.decimals))
        } else {
            amountToStake = getFullDisplayBalance(new BigNumber(zombieStaked), tokens.zmbe.decimals, 4)
            setExactStakeAmount(zombieStaked)

        }
        setStakeAmount(amountToStake)
        setPercent(sliderPercent)
    }

    const handleWithDrawEarly = () => {
        if (pid === 0) {
            drFrankenstein.methods.leaveStakingEarly(exactStakeAmount)
                .send({ from: account })
        } else {
            drFrankenstein.methods.withdrawEarly(pid, exactStakeAmount)
                .send({ from: account })
        }
    }

    const handleWithDraw = () => {
        if (pid === 0) {
            drFrankenstein.methods.leaveStaking(exactStakeAmount)
                .send({ from: account })
        } else {
            drFrankenstein.methods.withdraw(pid, exactStakeAmount)
                .send({ from: account })
        }
    }

    return <Modal title="Withdraw ZMBE" headerBackground={theme.colors.gradients.cardHeader}>
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
            Balance: {getFullDisplayBalance(zombieStaked, tokens.zmbe.decimals, 4)}
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
            <Button mt="8px" as="a" onClick={handleWithDraw}  variant="secondary">
                Withdraw ZMBE
            </Button> :
            <Button onClick={handleWithDrawEarly} mt="8px" as="a" variant="secondary">
                Withdraw Early
            </Button>
        }
    </Modal>
}

export default WithdrawZombieModal
