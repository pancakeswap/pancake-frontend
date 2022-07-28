import { memo } from 'react'
import { Message, MessageText, Button, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'

interface ZapErrorMessagesProps {
  isSingleToken: boolean
  zapMode: boolean
  toggleZapMode: (zapMode: boolean) => void
  onModalDismiss: () => void
}

export const ZapErrorMessages: React.FC<ZapErrorMessagesProps> = memo(
  ({ isSingleToken, zapMode, toggleZapMode, onModalDismiss }) => {
    const { t } = useTranslation()
    const { toastInfo } = useToast()

    const handleCloseButton = () => {
      onModalDismiss()

      if (zapMode) {
        toggleZapMode(!zapMode)
        toastInfo(t('Info'), t('Temporarily disabled Zap'))
      }
    }

    return (
      <Box width={['100%', '100%', '380px']}>
        <Message variant="warning" mb="16px">
          <Flex flexDirection="column">
            <MessageText bold>{t('Currently using Zap for liquidity provisions.')}</MessageText>
            <MessageText small>
              {isSingleToken
                ? t('Zap does NOT support tokens with fees on transfers. If you experience any issues, click')
                : t(
                    `Zap does NOT support tokens with fees on transfers. Please choose ’Don't convert’ and retry. If you experience any further issues, click`,
                  )}
              <Button p="0 4px" scale="sm" variant="text" height="auto" onClick={handleCloseButton}>
                {t('here')}
              </Button>
              {t('to disable Zap temporarily.')}
            </MessageText>
          </Flex>
        </Message>
      </Box>
    )
  },
)
