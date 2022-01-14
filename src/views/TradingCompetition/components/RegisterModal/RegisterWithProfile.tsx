import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, Text, Flex, Checkbox, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTradingCompetitionContractV2 } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { CompetitionProps } from '../../types'

const StyledCheckbox = styled(Checkbox)`
  min-width: 24px;
`

const StyledLabel = styled.label`
  cursor: pointer;
`

const RegisterWithProfile: React.FC<CompetitionProps> = ({ profile, onDismiss, onRegisterSuccess }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const tradingCompetitionContract = useTradingCompetitionContractV2()
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleConfirmClick = async () => {
    const tx = await callWithGasPrice(tradingCompetitionContract, 'register')
    setIsConfirming(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(
        t('You have registered for the competition!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
      onDismiss()
      onRegisterSuccess()
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setIsConfirming(false)
    }
  }

  return (
    <>
      <Heading scale="md" mb="24px">{`@${profile.username}`}</Heading>
      <Flex flexDirection="column">
        <Text bold>
          {t('Registering for the competition will make your wallet address publicly visible on the leaderboard.')}
        </Text>
        <Text fontSize="14px" color="textSubtle" mb="24px">
          {t('This decision cannot be reversed.')}
        </Text>
        <StyledLabel htmlFor="acknowledgement">
          <Flex alignItems="center" justifyContent="space-between">
            <StyledCheckbox
              id="acknowledgement"
              checked={isAcknowledged}
              onChange={() => setIsAcknowledged(!isAcknowledged)}
              scale="sm"
            />
            <Text ml="16px">
              {t('I understand that my address may be displayed publicly throughout the competition.')}
            </Text>
          </Flex>
        </StyledLabel>
      </Flex>
      <Button
        mt="24px"
        width="100%"
        onClick={handleConfirmClick}
        disabled={!isAcknowledged || isConfirming}
        isLoading={isConfirming}
        endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        {t('Confirm')}
      </Button>
    </>
  )
}

export default RegisterWithProfile
