import { memo } from 'react'
import { Message, MessageText, Button, useModal, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import SettingsModal from '../../../components/Menu/GlobalSettings/SettingsModal'

export const ZapErrorMessages: React.FC<{ isSingleToken: boolean; onModalDismiss?: () => void }> = memo(
  ({ isSingleToken, onModalDismiss }) => {
    const { t } = useTranslation()
    const [onPresentSettingsModal] = useModal(<SettingsModal />)
    return (
      <Box width={['280px', '380px']}>
        <Message variant="warning" mb="16px">
          <Flex flexDirection="column">
            <MessageText bold>{t('Currently using Zap for liquidity provisions.')}</MessageText>
            <MessageText small>
              {isSingleToken
                ? t('Zap does NOT support tokens with fees on transfers. If you experience any issues, disable Zap')
                : t(
                    `Zap does NOT support tokens with fees on transfers. Please choose ’Don't convert’ and retry. If you experience any further issues, disable Zap`,
                  )}{' '}
              <Button
                scale="sm"
                variant="text"
                height="auto"
                onClick={() => {
                  if (onModalDismiss) onModalDismiss()
                  onPresentSettingsModal()
                }}
                p="0"
              >
                {t('here.')}
              </Button>
            </MessageText>
          </Flex>
        </Message>
      </Box>
    )
  },
)
