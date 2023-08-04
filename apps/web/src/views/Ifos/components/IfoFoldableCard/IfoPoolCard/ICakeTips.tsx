import { Box, Message, MessageText, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { MessageTextLink } from '../../IfoCardStyles'
import { StakeButton } from './StakeButton'

export function ICakeTips() {
  const { t } = useTranslation()

  return (
    <Message my="24px" p="8px" variant="warning" action={<StakeButton mt="0.625rem" />}>
      <Flex flexDirection="column">
        <Box>
          <MessageText display="inline">{t('You don’t have any iCAKE available for IFO public sale.')}</MessageText>{' '}
          <MessageTextLink display="inline" fontWeight={700} href="/ifo#ifo-how-to" color="warning">
            {t('How does it work?')} »
          </MessageTextLink>
        </Box>
      </Flex>
    </Message>
  )
}
