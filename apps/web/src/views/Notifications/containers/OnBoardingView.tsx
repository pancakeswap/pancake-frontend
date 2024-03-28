import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import NotificationsOnboardingButton from 'components/NotificationOnBoardingButton'
import Image from 'next/image'
import { getOnBoardingDescriptionMessage } from '../utils/textHelpers'

interface IOnBoardingProps {
  isReady: boolean
  isRegistered: boolean
}

const OnBoardingView = ({ isRegistered }: IOnBoardingProps) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const onBoardingDescription = getOnBoardingDescriptionMessage(Boolean(isRegistered), t)

  return (
    <Flex
      width="100%"
      height={isMobile ? window.document.documentElement.clientHeight * 0.9 : '100%'}
      flexDirection="column"
      justifyContent="space-between"
    >
      <div
        style={{
          padding: '24px',
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box pl="40px" pb="24px" pt="48px">
          <Image src="/images/notifications/welcome-notification-bell.png" alt="#" height={185} width={270} />
        </Box>
        <FlexGap rowGap="12px" flexDirection="column" justifyContent="center" alignItems="center">
          <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
            {t('Notifications From PancakeSwap')}
          </Text>
          <Text fontSize="16px" textAlign="center" color="textSubtle">
            {onBoardingDescription}
          </Text>
        </FlexGap>
      </div>

      <Box margin="20px" height="10%">
        <NotificationsOnboardingButton height="50px" />
      </Box>
    </Flex>
  )
}

export default OnBoardingView
