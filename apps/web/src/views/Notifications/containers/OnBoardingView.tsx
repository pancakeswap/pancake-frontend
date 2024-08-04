import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useSubscription } from '@web3inbox/react'
import NotificationsOnboardingButton from 'components/NotificationOnBoardingButton'
import Image from 'next/image'
import webNotificationBunny from '../../Home/components/Banners/images/web3-notification-bunny.png'
import webNotificationCheck from '../../Home/components/Banners/images/web3-notification-check.png'
import { getOnBoardingDescriptionMessage } from '../utils/textHelpers'

interface IOnBoardingProps {
  isRegistered: boolean
}

const OnBoardingView = ({ isRegistered }: IOnBoardingProps) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { data: subscription } = useSubscription()

  const isSubscribed = Boolean(subscription)
  const onBoardingDescription = getOnBoardingDescriptionMessage(Boolean(isRegistered), isSubscribed, t)

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
        <Flex pb="24px" pt="40px" alignItems="center" justifyContent="center" position="relative">
          {!isSubscribed ? (
            <Image src="/images/notifications/welcome-notification-bell.png" alt="#" height={185} width={270} />
          ) : (
            <>
              <Image src={webNotificationBunny} alt="webNotificationBunny" width={150} height={200} />
              <Box position="absolute" left="52%" bottom="5%">
                <Image src={webNotificationCheck} alt="webNotificationCheck" width={81} height={80} />
              </Box>
            </>
          )}
        </Flex>
        <FlexGap rowGap="12px" flexDirection="column" justifyContent="center" alignItems="center">
          <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
            {isSubscribed ? t('Yaay!. You Are Now Subscribed') : t('Notifications From PancakeSwap')}
          </Text>
          <Text fontSize="16px" textAlign="center" color="textSubtle">
            {onBoardingDescription}
          </Text>
        </FlexGap>
      </div>

      {!isSubscribed && (
        <Box margin="20px" height="10%">
          <NotificationsOnboardingButton height="50px" />
        </Box>
      )}
    </Flex>
  )
}

export default OnBoardingView
