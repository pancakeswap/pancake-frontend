import { useState, useCallback } from 'react'
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
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'

interface CheckType {
  key: string
  value?: boolean
  content: string
}

interface RiskDisclaimerProps extends InjectedModalProps {
  onSuccess: () => void
  checks: CheckType[]
  header: string
  id: string
  subtitle?: string
}

const GradientModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  padding-bottom: 24px;
  padding-top: 24px;
`

// TODO: Copy from src/views/Predictions/components/RiskDisclaimer.tsx
// Will replace that with this modal.

const DisclaimerModal: React.FC<RiskDisclaimerProps> = ({ id, onSuccess, onDismiss, checks, header, subtitle }) => {
  const [checkState, setCheckState] = useState(checks || [])
  const { t } = useTranslation()

  const handleSetAcknowledgeRisk = useCallback(
    (currentKey) => {
      const newCheckState = checkState.map((check) => {
        if (currentKey === check.key) {
          return { ...check, value: !check.value }
        }

        return check
      })

      setCheckState(newCheckState)
    },
    [checkState],
  )

  const handleConfirm = useCallback(() => {
    onSuccess()
    onDismiss()
  }, [onSuccess, onDismiss])

  return (
    <ModalContainer title={t('Welcome!')} minWidth="320px" id={id}>
      <GradientModalHeader>
        <ModalTitle>
          <Heading scale="lg">{t('Welcome!')}</Heading>
        </ModalTitle>
      </GradientModalHeader>
      <ModalBody p="24px" maxWidth={['100%', '100%', '100%', '400px']}>
        <Box maxHeight="300px" overflowY="auto">
          <Heading as="h3" mb="24px">
            {header}
          </Heading>
          {subtitle && (
            <Text as="p" color="textSubtle" mb="24px">
              {subtitle}
            </Text>
          )}
          {checkState.map((check) => (
            <label
              key={check.key}
              htmlFor={check.key}
              style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}
            >
              <Flex alignItems="center">
                <div style={{ flex: 'none', alignSelf: 'flex-start', paddingTop: '8px' }}>
                  <Checkbox
                    id={check.key}
                    scale="sm"
                    checked={check.value}
                    onChange={() => handleSetAcknowledgeRisk(check.key)}
                  />
                </div>
                <Text ml="8px">{check.content}</Text>
              </Flex>
            </label>
          ))}
        </Box>
        <Button
          id={`${id}-continue`}
          width="100%"
          onClick={handleConfirm}
          disabled={checkState.some((check) => !check.value)}
        >
          {t('Continue')}
        </Button>
      </ModalBody>
    </ModalContainer>
  )
}

export default DisclaimerModal
