import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, Slider } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { BASE_EXCHANGE_URL } from 'config'
import { useSousStake } from 'hooks/useStake'
/* import { getCakeAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance' */

import BalanceInput from './BalanceInput'

interface StakeModalProps {
  sousId: number
  isBnbPool: boolean
  stakingTokenDecimals?: number
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

const StakeModal: React.FC<StakeModalProps> = ({ sousId, isBnbPool, stakingTokenDecimals = 18, onDismiss }) => {
  const TranslateString = useI18n()

  const { onStake } = useSousStake(sousId, isBnbPool)

  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [percent, setPercent] = useState(0)

  const handleStakePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStakeAmount(event.target.value)
  }

  return (
    <Modal title={TranslateString(999, 'Stake in Pool')}>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>Stake:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src="/images/tokens/CAKE.png" width={24} height={24} alt="Cake" />
          <Text ml="4px" bold>
            CAKE
          </Text>
        </Flex>
      </Flex>
      <BalanceInput value={stakeAmount} onChange={handleStakePriceChange} />
      <Text mt="8px">Balance: {stakeAmount}</Text>
      <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={(newValue) => setPercent(newValue)}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between">
        <StyledButton variant="tertiary" onClick={() => setPercent(25)}>
          25%
        </StyledButton>
        <StyledButton variant="tertiary" onClick={() => setPercent(50)}>
          50%
        </StyledButton>
        <StyledButton variant="tertiary" onClick={() => setPercent(75)}>
          75%
        </StyledButton>
        <StyledButton variant="tertiary" onClick={() => setPercent(100)}>
          MAX
        </StyledButton>
      </Flex>
      <Button
        disabled={pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onStake(stakeAmount, stakingTokenDecimals)
          setPendingTx(false)
          onDismiss()
        }}
        mt="24px"
      >
        Confirm
      </Button>
      <Button mt="8px" as="a" external href={BASE_EXCHANGE_URL}>
        {TranslateString(999, 'Buy CAKE')}
      </Button>
    </Modal>
  )
}

export default StakeModal
