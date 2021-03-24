import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, Slider, RefreshIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { BASE_EXCHANGE_URL } from 'config'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { Address } from 'config/constants/types'

import BalanceInput from './BalanceInput'

interface StakeModalProps {
  sousId: number
  isBnbPool: boolean
  stakingTokenDecimals?: number
  stakingTokenName: string
  stakingTokenAddress?: Address
  max: BigNumber
  isStaking?: boolean
  onDismiss?: () => void
}

const StyledButton = styled(Button)`
  font-size: 12px;
  margin: 0 2px;
  flex-grow: 1;
  padding: 4px 16px;
  height: 20px;
  max-width: 57px;
`

const StakeModal: React.FC<StakeModalProps> = ({
  sousId,
  isBnbPool,
  stakingTokenName,
  stakingTokenDecimals = 18,
  isStaking = true,
  max,
  onDismiss,
}) => {
  const TranslateString = useI18n()

  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId)
  const { theme } = useTheme()

  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [percent, setPercent] = useState(0)

  const handleStakePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? event.target.value : '0'

    setStakeAmount(event.target.value)

    const percentage = Math.floor(
      new BigNumber(new BigNumber(value).multipliedBy(new BigNumber(10).pow(stakingTokenDecimals)))
        .dividedBy(max)
        .toNumber() * 100,
    )

    setPercent(percentage > 100 ? 100 : percentage)
  }

  const handleRenderActionButtonLabel = () => {
    if (pendingTx) {
      return TranslateString(999, 'Confirming')
    }

    return TranslateString(999, 'Confirm')
  }

  const handleRenderIcon = () => {
    if (pendingTx) {
      return <RefreshIcon color="white" />
    }

    return null
  }

  const handleRenderTitle = () => {
    if (isStaking) {
      return TranslateString(999, 'Stake in Pool')
    }

    return TranslateString(588, 'Unstake')
  }

  const handleConfirmClick = async () => {
    setPendingTx(true)

    if (isStaking) {
      await onStake(stakeAmount, stakingTokenDecimals)
    } else {
      await onUnstake(stakeAmount, stakingTokenDecimals)
    }

    setPendingTx(false)
  }

  const handleChangePercent = (value) => {
    setStakeAmount(getFullDisplayBalance(max.multipliedBy(value / 100), stakingTokenDecimals))
    setPercent(value)
  }

  return (
    <Modal
      title={handleRenderTitle()}
      minWidth="288px"
      onDismiss={onDismiss}
      headerBackground={theme.card.cardHeaderBackground}
    >
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isStaking ? TranslateString(316, 'Stake') : TranslateString(588, 'Unstake')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${stakingTokenName}.png`} width={24} height={24} alt="Cake" />
          <Text ml="4px" bold>
            CAKE
          </Text>
        </Flex>
      </Flex>
      <BalanceInput value={stakeAmount} onChange={handleStakePriceChange} />
      <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        Balance: {getFullDisplayBalance(max)}
      </Text>
      <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={(newValue) => setPercent(newValue)}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <StyledButton variant="tertiary" onClick={() => handleChangePercent(25)}>
          25%
        </StyledButton>
        <StyledButton variant="tertiary" onClick={() => handleChangePercent(50)}>
          50%
        </StyledButton>
        <StyledButton variant="tertiary" onClick={() => handleChangePercent(75)}>
          75%
        </StyledButton>
        <StyledButton variant="tertiary" onClick={() => handleChangePercent(100)}>
          MAX
        </StyledButton>
      </Flex>
      <Button isLoading={pendingTx} onClick={handleConfirmClick} mt="24px" endIcon={handleRenderIcon()}>
        {handleRenderActionButtonLabel()}
      </Button>
      {isStaking && (
        <Button mt="8px" as="a" external href={BASE_EXCHANGE_URL} variant="secondary">
          {TranslateString(999, 'Get')} {stakingTokenName}
        </Button>
      )}
    </Modal>
  )
}

export default StakeModal
