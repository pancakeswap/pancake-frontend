/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import styled from 'styled-components'
import { BalanceInput, Button, Flex, Modal, Slider, Text, useModal } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useDrFrankenstein } from 'hooks/useContract'
import {
    APESWAP_ADD_LIQUIDITY_URL,
    AUTOSHARK_ADD_LIQUIDITY_URL,
    BASE_ADD_LIQUIDITY_URL,
    BASE_EXCHANGE_URL,
} from 'config'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core';
import { BIG_TEN, BIG_ZERO } from '../../../utils/bigNumber'
import { tombByPid } from '../../../redux/get'
import tokens from '../../../config/constants/tokens'

interface Result {
    paidUnlockFee: boolean,
    rugDeposited: number
}

interface StakeLpTokenModalProps {
    pid: number,
    lpTokenBalance: any,
    updateResult: any,
    lpAddress: string,
    onDismiss?: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const StakeLpTokenModal: React.FC<StakeLpTokenModalProps> = ({ pid, lpTokenBalance, updateResult, onDismiss }) => {
    const drFrankenstein = useDrFrankenstein();
    const { account } = useWeb3React();

    const { theme } = useTheme();
    const [stakeAmount, setStakeAmount] = useState(BIG_ZERO);
    const [percent, setPercent] = useState(0);
    const tomb = tombByPid(pid)
    const { name, quoteToken, token } = tomb

    const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value || '0'
        setStakeAmount(getDecimalAmount(new BigNumber(inputValue)));
    }

    const handleChangePercent = (sliderPercent: number) => {
        const percentageOfStakingMax = lpTokenBalance.dividedBy(100).multipliedBy(sliderPercent)
        const amountToStake = percentageOfStakingMax
        setStakeAmount(amountToStake)
        setPercent(sliderPercent)
    }

    const handleDepositLP = () => {
        const ether = BIG_TEN.pow(18)
        let fixedStakeAmount = stakeAmount
        if(Math.abs(stakeAmount.minus(lpTokenBalance).toNumber()) < ether.toNumber()) {
            fixedStakeAmount = lpTokenBalance
        }

        let formattedAmount = fixedStakeAmount.toString()
        const index = fixedStakeAmount.toString().indexOf(".")
        if (index >= 0) {
            formattedAmount = formattedAmount.substring(0, index)
        }

        drFrankenstein.methods.deposit(pid, formattedAmount)
          .send({ from: account }).then(()=>{
              updateResult(pid);
              onDismiss();
          })
    }


    let isDisabled = false
    let stakingDetails = ''
    if(stakeAmount.gt(lpTokenBalance) && lpTokenBalance.toNumber() !== 0) {
        isDisabled = true
        stakingDetails = "Invalid Stake: Insufficient LP Balance"
    }

    // eslint-disable-next-line no-nested-ternary
    const quoteTokenUrl = tomb.quoteToken === tokens.wbnb ? tomb.exchange === 'Apeswap' ? 'ETH' : 'BNB' : getAddress(tomb.quoteToken.address)

    let addLiquidityUrl

    if(tomb.exchange === 'Apeswap') {
        addLiquidityUrl = `${APESWAP_ADD_LIQUIDITY_URL}/${quoteTokenUrl}/${getAddress(tomb.token.address)}`
    } else if(tomb.exchange === 'Autoshark') {
        addLiquidityUrl = `${AUTOSHARK_ADD_LIQUIDITY_URL}/${quoteTokenUrl}/${getAddress(tomb.token.address)}`
    } else {
        addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${quoteTokenUrl}/${getAddress(tomb.token.address)}`
    }

    return <Modal onDismiss={onDismiss} title='Stake LP Tokens' headerBackground={theme.colors.gradients.cardHeader}>
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
            Balance: {getFullDisplayBalance(lpTokenBalance, 18, 4)}
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
        {lpTokenBalance.toString() === '0' ?
            <Button mt="8px" as="a" external href={addLiquidityUrl}  variant="secondary">
                Get {name}
            </Button> :
            <Button onClick={handleDepositLP} disabled={isDisabled} mt="8px" as="a" variant="secondary">
                Deposit {name}
            </Button>}
    </Modal>
}

export default StakeLpTokenModal
