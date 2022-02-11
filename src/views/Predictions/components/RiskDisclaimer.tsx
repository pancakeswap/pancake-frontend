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
  Box,
} from '@tovaswapui/uikit'
import { useTranslation } from 'contexts/Localization'
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
  const { t } = useTranslation()

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
    <ModalContainer title={t('Welcome!')} minWidth="320px" id="predictions-risk-disclaimer">
      <GradientModalHeader>
        <ModalTitle>
          <Heading scale="lg">{t('Welcome!')}</Heading>
        </ModalTitle>
      </GradientModalHeader>
      <ModalBody p="24px" maxWidth="400px">
        <Box maxHeight="300px" overflowY="auto">
          <Heading as="h3" mb="24px">
            {t('This Product is in beta.')}
          </Heading>

          <Text as="p" color="textSubtle" mb="24px">
            {t('Once you enter a position, you cannot cancel or adjust it.')}
          </Text>

          <label
            htmlFor="responsibility-checkbox"
            style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}
          >
            <Flex alignItems="center">
              <div style={{ flex: 'none' }}>
                <Checkbox
                  id="responsibility-checkbox"
                  scale="sm"
                  checked={acknowledgeRisk}
                  onChange={handleSetAcknowledgeRisk}
                />
              </div>
              <Text ml="8px">
                {t(
                  'I understand that I am using this product at my own risk. Any losses incurred due to my actions are my own responsibility.',
                )}
              </Text>
            </Flex>
          </label>
          <label htmlFor="beta-checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
            <Flex alignItems="center">
              <div style={{ flex: 'none' }}>
                <Checkbox id="beta-checkbox" scale="sm" checked={acknowledgeBeta} onChange={handleSetAcknowledgeBeta} />
              </div>
              <Text ml="8px">
                {t('I understand that this product is still in beta. I am participating at my own risk')}
              </Text>
            </Flex>
          </label>
        </Box>
        <Button
          id="prediction-disclaimer-continue"
          width="100%"
          onClick={handleConfirm}
          disabled={!acknowledgeRisk || !acknowledgeBeta}
        >
          {t('Continue')}
        </Button>
      </ModalBody>
    </ModalContainer>
  )
}

export default RiskDisclaimer
