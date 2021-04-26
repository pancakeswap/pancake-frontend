import React, { useState } from 'react'
import {
  ModalContainer,
  ModalBody,
  Text,
  Button,
  Flex,
  InjectedModalProps,
  Checkbox,
  ModalHeader,
  ModalTitle,
  Heading,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'

interface RiskDisclaimerProps extends InjectedModalProps {
  onSuccess: () => void
}

const GradientModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  padding-bottom: 24px;
  padding-top: 24px;
`

const RiskDisclaimer: React.FC<RiskDisclaimerProps> = ({ onSuccess, onDismiss }) => {
  const [acknowledgeRisk, setAcknowledgeRisk] = useState(false)
  const [acknowledgeBeta, setAcknowledgeBeta] = useState(false)
  const TranslateString = useI18n()

  const handleSetAcknowledgeRisk = () => {
    setAcknowledgeRisk(!acknowledgeRisk)
  }

  const handleSetAcknowledgeBeta = () => {
    setAcknowledgeBeta(!acknowledgeBeta)
  }

  const handleConfirm = () => {
    onSuccess()
    onDismiss()
  }

  return (
    <ModalContainer title={TranslateString(999, 'Welcome!')} minWidth="320px">
      <GradientModalHeader>
        <ModalTitle>
          <Heading size="lg">{TranslateString(556, 'Welcome!')}</Heading>
        </ModalTitle>
      </GradientModalHeader>
      <ModalBody p="24px" maxWidth="400px">
        <Heading as="h3" mb="24px">
          {TranslateString(556, 'This Product is still in beta (testing) phase.')}
        </Heading>
        <Text as="p" color="textSubtle">
          {TranslateString(999, 'Before you use this product, make sure you fully understand the risks involved.')}
        </Text>
        <Text as="p" color="textSubtle">
          {TranslateString(999, 'Once you enter a position, you cannot cancel or adjust it.')}
        </Text>
        <Text as="p" color="textSubtle" mb="24px">
          {TranslateString(999, 'All losses are final.')}
        </Text>
        <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
          <Flex alignItems="center">
            <div style={{ flex: 'none' }}>
              <Checkbox id="checkbox" scale="sm" checked={acknowledgeRisk} onChange={handleSetAcknowledgeRisk} />
            </div>
            <Text ml="8px">
              {TranslateString(
                999,
                'I understand that I am using this product at my own risk. Any losses incurred due to my actions are my own responsibility.',
              )}
            </Text>
          </Flex>
        </label>
        <label htmlFor="checkbox1" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
          <Flex alignItems="center">
            <div style={{ flex: 'none' }}>
              <Checkbox id="checkbox1" scale="sm" checked={acknowledgeBeta} onChange={handleSetAcknowledgeBeta} />
            </div>
            <Text ml="8px">
              {TranslateString(
                999,
                'I understand that this product is still in beta. I am participating at my own risk',
              )}
            </Text>
          </Flex>
        </label>
        <Button width="100%" onClick={handleConfirm} disabled={!acknowledgeRisk || !acknowledgeBeta}>
          {TranslateString(999, 'Continue')}
        </Button>
      </ModalBody>
    </ModalContainer>
  )
}

export default RiskDisclaimer
