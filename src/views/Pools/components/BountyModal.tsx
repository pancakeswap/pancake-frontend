import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { Modal, Text, Flex, Button, HelpIcon } from '@pancakeswap-libs/uikit'
import useTheme from 'hooks/useTheme'

interface NotEnoughTokensModalProps {
  onDismiss?: () => void
}

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 1px;
  margin: 16px auto;
  width: 100%;
`

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ onDismiss }) => {
  const TranslateString = useI18n()
  const { theme } = useTheme()

  return (
    <Modal
      title={TranslateString(999, 'Claim Bounty')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Text>{TranslateString(999, "You'll claim")}</Text>
        <Flex flexDirection="column">
          <Text bold>0.00003 CAKE</Text>
          <Text fontSize="12px" color="textSubtle">
            ~0.003 USD
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(999, 'Pool total pending yield')}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          14,483.450
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(999, 'Bounty')}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          0.25%
        </Text>
      </Flex>
      <Button mb="28px">{TranslateString(464, 'Confirm')}</Button>
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="16px" bold color="textSubtle" mr="4px">
          {TranslateString(999, "What's this?")}
        </Text>
        <HelpIcon color="textSubtle" />
      </Flex>
    </Modal>
  )
}

export default NotEnoughTokensModal
