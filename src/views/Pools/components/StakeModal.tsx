import React, { useState } from 'react'
import { Modal, Text, Flex, Image, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { BASE_EXCHANGE_URL } from 'config'
import { useSousStake } from 'hooks/useStake'

import BalanceInput from './BalanceInput'

interface StakeModalProps {
  sousId: number
  isBnbPool: boolean
  stakingTokenDecimals?: number
  onDismiss?: () => void
}

const StakeModal: React.FC<StakeModalProps> = ({ sousId, isBnbPool, stakingTokenDecimals = 18, onDismiss }) => {
  const TranslateString = useI18n()
  const { onStake } = useSousStake(sousId, isBnbPool)
  const [pendingTx, setPendingTx] = useState(false)

  const [stakeAmount, setStakeAmount] = useState('')

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
