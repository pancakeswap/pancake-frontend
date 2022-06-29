import { memo } from 'react'
import { Message, MessageText } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

export const ZapErrorMessages: React.FC<{ isSingleToken: boolean }> = memo(({ isSingleToken }) => {
  const { t } = useTranslation()
  return (
    <Message variant="warning" mb="16px">
      <MessageText>
        {isSingleToken
          ? t('Zap does NOT support tokens with fees on transfers. If you experience any issues, disable Zap here.')
          : t(
              'Zap does NOT support tokens with fees on transfers. Please choose "Don\'t convert" and retry. If you experience any further issues, disable Zap here.',
            )}
      </MessageText>
    </Message>
  )
})
