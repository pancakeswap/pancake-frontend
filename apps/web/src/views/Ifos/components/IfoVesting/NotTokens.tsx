import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { MessageTextLink } from '../IfoCardStyles'

const NotTokens: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <BunnyPlaceholderIcon width={80} height={80} margin="auto" />
      <Flex flexDirection="column" alignItems="center" mt="16px" mb="24px">
        <Text bold mb="8px" textAlign="center">
          {t('You have no tokens available for claiming')}
        </Text>
        <Text fontSize="14px" color="textSubtle" textAlign="center">
          {t('Participate in our next IFO. and remember to lock your CAKE to increase your allocation!')}
        </Text>
        <NextLink href="/ifo#ifo-how-to">
          <MessageTextLink color="primary" display="inline">
            {t('How does it work?')} »
          </MessageTextLink>
        </NextLink>
      </Flex>
    </Flex>
  )
}

export default NotTokens
