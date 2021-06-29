/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import styled from 'styled-components'
import { BalanceInput, Button, Flex, Modal, Slider, Text, useModal } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useDrFrankenstein } from 'hooks/useContract'
import { BASE_EXCHANGE_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import { getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import WarningModal from 'views/HomeCopy/components/WarningModal'

interface Result {
    paidUnlockFee: boolean,
    rugDeposited: number
}

interface StakeLpTokenModalProps {
    details: {
        id: number,
        pid: number,
        name: string,
        withdrawalCooldown: string,
        artist?: any,
        stakingToken: any,
        result: Result,
        lpAddresses:any
    },
    lpTokenBalance:any
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const StakeLpTokenModal: React.FC<StakeLpTokenModalProps> = ({ details: { name, pid, lpAddresses }, lpTokenBalance }) => {


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
        const percentageOfStakingMax = lpTokenBalance.dividedBy(100).multipliedBy(sliderPercent)
        const amountToStake = getFullDisplayBalance(percentageOfStakingMax, 18, 4)
        setStakeAmount(amountToStake)
        setPercent(sliderPercent)
    }

    const handleDepositLP = () => {
        const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), 18);
        drFrankenstein.methods.deposit(pid, convertedStakeAmount)
          .send({ from: account })
    }

    const [onGetTokenClick] = useModal(
        <WarningModal
        url={`${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${getAddress(lpAddresses)}`} />,
      );

    return <Modal title='Stake LP Tokens' headerBackground={theme.colors.gradients.cardHeader}>
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
            Balance: {getFullDisplayBalance(lpTokenBalance, 18, 4)}
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
        {lpTokenBalance.toString() === '0' ?
            <Button mt="8px" as="a" onClick={onGetTokenClick} variant="secondary">
                Get {name}
            </Button> :
            <Button onClick={handleDepositLP} mt="8px" as="a" variant="secondary">
                Deposit {name}
            </Button>}
    </Modal>
}

export default StakeLpTokenModal
