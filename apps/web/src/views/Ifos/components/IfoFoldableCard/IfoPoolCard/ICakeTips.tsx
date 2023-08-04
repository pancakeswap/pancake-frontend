import { Box, Message, MessageText } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { MessageTextLink } from '../../IfoCardStyles'

export function ICakeTips() {
  const { t } = useTranslation()

  return (
    <Message my="24px" p="8px" variant="warning">
      <Box>
        <MessageText display="inline">{t('You don’t have any iCAKE available for IFO public sale.')}</MessageText>{' '}
        <MessageTextLink display="inline" fontWeight={700} href="/ifo#ifo-how-to" color="warning">
          {t('How does it work?')} »
        </MessageTextLink>
      </Box>
    </Message>
  )
}
