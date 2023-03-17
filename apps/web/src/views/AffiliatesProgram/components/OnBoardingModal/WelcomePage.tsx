import { Flex, Box, Text, Button, LogoRoundIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'

interface WelcomePageProps {
  isLoading: boolean
  handleStartNow: () => void
}

const WelcomePage: React.FC<React.PropsWithChildren<WelcomePageProps>> = ({ isLoading, handleStartNow }) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Flex flexDirection="column" padding={['24px', '24px', '24px', '24px', '50px 24px']}>
      <Box>
        <LogoRoundIcon width="48px" />
      </Box>
      <Box>
        <Text fontSize={['24px']} bold m="12px 0">
          {t('Welcome to PancakeSwap!')}
        </Text>
        <Text color="secondary" bold mb="8px">
          {router.query.user?.toString()?.replaceAll('_', ' ')}
        </Text>
        <Text color="textSubtle" fontSize="14px" mb="24px">
          {t('has referred you to start trading on a leading multchain DEX')}
        </Text>
        <Text color="textSubtle" mb="24px">
          {t('Start trading today and get a')}
          <Text color="secondary" bold as="span" m="0 4px">{`${router.query.discount}%`}</Text>
          {t('discount on most trading pairs on BNB Smart Chain and Ethereum Swap, as well as a')}
          <Text color="secondary" bold as="span" m="0 4px">
            20%
          </Text>
          {t('discount on most Perpetual trades')}
        </Text>
        <Button width="100%" disabled={isLoading} onClick={handleStartNow}>
          {t('Start Now')}
        </Button>
      </Box>
    </Flex>
  )
}

export default WelcomePage
