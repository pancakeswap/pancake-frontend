import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  InjectedModalProps,
  Link,
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Text,
  WarningIcon,
} from '@pancakeswap/uikit'
import { ReactNode, useCallback, useState } from 'react'
import { styled } from 'styled-components'

export interface CheckType {
  key: string
  value?: boolean
  content: string
}

interface RiskDisclaimerProps extends InjectedModalProps {
  onSuccess: () => void
  checks: CheckType[]
  header: ReactNode
  title: string
  modalHeader?: string
  id: string
  footer?: ReactNode
  subtitle?: ReactNode
  hideConfirm?: boolean
  headerStyle?: React.CSSProperties
  footerStyle?: React.CSSProperties
  hasExternalLink?: boolean
}

const GradientModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  padding-bottom: 24px;
  padding-top: 24px;
`

const StyledLink = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`

// TODO: Copy from src/views/Predictions/components/RiskDisclaimer.tsx
// Will replace that with this modal.

const DisclaimerModal: React.FC<React.PropsWithChildren<RiskDisclaimerProps>> = ({
  id,
  title,
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
  hasExternalLink,
}) => {
  const [checkState, setCheckState] = useState(checks || [])
  const { t } = useTranslation()

  const handleSetAcknowledgeRisk = useCallback(
    (currentKey: string) => {
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
    <ModalContainer title={modalHeader || t('%title% Disclaimer', { title })} style={{ minWidth: '320px' }} id={id}>
      <GradientModalHeader>
        <ModalTitle>
          <Heading scale="lg">{modalHeader || t('%title% Disclaimer', { title })}</Heading>
        </ModalTitle>
      </GradientModalHeader>
      <ModalBody p="24px" maxWidth={['100%', '100%', '100%', '400px']}>
        <Box maxHeight="370px" overflowY="auto">
          <Flex alignItems="center" justifyContent="center" pb="16px">
            <WarningIcon color="warning" width="50px" height="50px" />
          </Flex>
          <Heading as="h3" mb="24px" style={headerStyle} textAlign="center">
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
        {footer && (
          <Heading as="h3" mb="24px" style={footerStyle}>
            {footer}
          </Heading>
        )}
        {hasExternalLink && (
          <StyledLink href="https://docs.pancakeswap.finance/products/bridging/wormhole-bridge-guide" external>
            <Button width="100%" my="16px">
              {t('Go to FAQ guide')}
            </Button>
          </StyledLink>
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
