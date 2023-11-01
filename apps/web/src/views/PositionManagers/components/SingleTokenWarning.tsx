import { useTranslation } from '@pancakeswap/localization'
import { Message, MessageText, Text, Link } from '@pancakeswap/uikit'
import { memo } from 'react'

export const SingleTokenWarning: React.FC<{ strategyInfoUrl?: string }> = memo(({ strategyInfoUrl }) => {
  const { t } = useTranslation()

  return (
    <Message variant="primary" mt="15px">
      <MessageText>
        <Text fontSize={14} as="span" color="secondary">
          {t(
            'Single token deposits only. The final position may consist with both tokens. Learn more about the strategy',
          )}
        </Text>
        {strategyInfoUrl && (
          <Link
            bold
            external
            m="0 4px"
            fontSize={14}
            color="secondary"
            display="inline-block !important"
            href={strategyInfoUrl}
            style={{ textDecoration: 'underline' }}
          >
            {t('here')}
          </Link>
        )}
      </MessageText>
    </Message>
  )
})
