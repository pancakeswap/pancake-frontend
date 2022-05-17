import { useCallback } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Flex, Text, BunnyPlaceholderIcon, Button } from '@pancakeswap/uikit'
import { useConfig } from 'views/Ifos/contexts/IfoContext'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { MessageTextLink } from '../IfoCardStyles'

interface NotTokensProps {
  account: string
}

const NotTokens: React.FC<NotTokensProps> = ({ account }) => {
  const { t } = useTranslation()
  const { isExpanded, setIsExpanded } = useConfig()

  const scrollToTop = useCallback(() => {
    // Always expand for mobile
    if (!isExpanded) {
      setIsExpanded(true)
    }

    window.scrollTo({
      top: 400,
      behavior: 'auto',
    })
  }, [])

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
        <MessageTextLink href="/ifo#ifo-how-to" color="primary" display="inline">
          {t('How does it work?')} »
        </MessageTextLink>
      </Flex>
      {account ? <Button onClick={scrollToTop}>{t('Lock CAKE')}</Button> : <ConnectWalletButton />}
    </Flex>
  )
}

export default NotTokens
