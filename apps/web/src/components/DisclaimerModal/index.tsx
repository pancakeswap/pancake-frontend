import { useState, useCallback, ReactNode, CSSProperties } from 'react'
import {
  ModalContainer,
  ModalBody,
  ModalProps,
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
import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'

export interface CheckType {
  key: string
  value?: boolean
  content: ReactNode
}

interface RiskDisclaimerProps extends InjectedModalProps {
  style?: CSSProperties
  bodyMaxHeight?: CSSProperties['maxHeight']
  bodyMaxWidth?: ModalProps['maxWidth']
  onSuccess: () => void
  checks: CheckType[]
  header: ReactNode
  modalHeader?: string
  id: string
  footer?: ReactNode
  subtitle?: ReactNode
  hideConfirm?: boolean
  headerStyle?: React.CSSProperties
  footerStyle?: React.CSSProperties
}

const GradientModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  padding-bottom: 24px;
  padding-top: 24px;
`

// TODO: Copy from src/views/Predictions/components/RiskDisclaimer.tsx
// Will replace that with this modal.

const DisclaimerModal: React.FC<React.PropsWithChildren<RiskDisclaimerProps>> = ({
  id,
  onSuccess,
  onDismiss,
  checks,
  header,
  subtitle,
  hideConfirm,
  modalHeader,
  footer,
  headerStyle,
  footerStyle,
  style,
  bodyMaxWidth,
  bodyMaxHeight,
}) => {
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
    onDismiss?.()
  }, [onSuccess, onDismiss])

  return (
    <ModalContainer title={modalHeader || t('Welcome!')} style={{ minWidth: '320px', ...style }} id={id}>
      <GradientModalHeader>
        <ModalTitle>
          <Heading scale="lg">{modalHeader || t('Welcome!')}</Heading>
        </ModalTitle>
      </GradientModalHeader>
      <ModalBody p="24px" maxWidth={bodyMaxWidth ?? ['100%', '100%', '100%', '400px']}>
        <Box maxHeight={bodyMaxHeight || '300px'} overflowY="auto">
          <Heading as="h3" mb="24px" style={headerStyle}>
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
                <div style={{ flex: 'none', alignSelf: 'flex-start' }}>
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
        {footer && (
          <Heading as="h3" mb="24px" style={footerStyle}>
            {footer}
          </Heading>
        )}
        {!hideConfirm && (
          <Button
            id={`${id}-continue`}
            width="100%"
            onClick={handleConfirm}
            disabled={checkState.some((check) => !check.value)}
          >
            {t('Continue')}
          </Button>
        )}
      </ModalBody>
    </ModalContainer>
  )
}

export default DisclaimerModal
