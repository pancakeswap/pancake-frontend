import { Trans } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useSubscription } from '@web3inbox/react'
import NotificationsOnboardingButton from 'components/NotificationOnBoardingButton'
import { useInitializeNotifications } from 'hooks/useInitializeNotifications'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import webNotificationBunny from '../../Home/components/Banners/images/web3-notification-bunny.png'
import webNotificationCheck from '../../Home/components/Banners/images/web3-notification-check.png'

const IntroSteps = [
  {
    key: 'step-1',
    title: <Trans>Notifications From PancakeSwap</Trans>,
    icon: webNotificationBunny,
    description: (
      <Trans>
        Get started with notifications from PancakeSwap. First authorize notifications by signing in your wallet
      </Trans>
    ),
  },
  {
    key: 'step-2',

    title: <Trans>Enable PancakeSwap Notifications</Trans>,
    icon: '/images/notifications/welcome-notification-bell.png',
    description: (
      <Trans>
        Finally, subscribe to notifications to stay informed on the latest news and updates that PancakeSwap has to
        offer.
      </Trans>
    ),
  },
  {
    key: 'step-3',

    title: <Trans>Congrats You Are Now Subscribed</Trans>,
    icon: webNotificationCheck,
    description: (
      <Trans>
        You are now subscribed. To see your notifications you can view your inbox from the notification bell on the
        navbar
      </Trans>
    ),
  },
]

const OnBoardingView = () => {
  const [step, setStep] = useState(0)

  const [swiper, setSwiper] = useState<SwiperClass | undefined>(undefined)
  const { isReady, isRegistered } = useInitializeNotifications()
  const { data: subscription } = useSubscription()
  const { isMobile } = useMatchBreakpoints()

  const isSubscribed = Boolean(subscription)

  const handleRealIndexChange = useCallback((swiperInstance: SwiperClass) => {
    setStep(swiperInstance.realIndex)
  }, [])

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      setStep(stepIndex)
      swiper?.slideTo(stepIndex, 500)
    },
    [swiper],
  )

  useEffect(() => {
    if (!isReady || !swiper) return
    if (!isRegistered && step !== 0) handleStepClick(0)
    if (isRegistered && !isSubscribed && step !== 1) handleStepClick(1)
    if (isSubscribed && step !== 2) handleStepClick(2)
  }, [isRegistered, isSubscribed, handleStepClick, isReady, swiper, step])

  return (
    <Flex
      width="100%"
      height={isMobile ? window.document.documentElement.clientHeight * 0.9 : '100%'}
      flexDirection="column"
      justifyContent="space-between"
    >
      <Swiper
        initialSlide={0}
        modules={[Navigation]}
        slidesPerView="auto"
        onSwiper={setSwiper}
        onRealIndexChange={handleRealIndexChange}
        centeredSlides
        style={{ width: '310px' }}
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
          {IntroSteps.map((introStep, i) => (
            <SwiperSlide key={introStep.key}>
              <Flex height="270px" alignItems="center" justifyContent="center" position="relative">
                <Image
                  alt={introStep.title.toString()}
                  src={introStep.icon}
                  height={i === 1 ? 185 : 105}
                  width={i === 1 ? 270 : 160}
                />
              </Flex>

              <FlexGap rowGap="12px" flexDirection="column" justifyContent="center" alignItems="center">
                <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
                  {introStep.title}
                </Text>
                <Text fontSize="16px" textAlign="center" color="textSubtle">
                  {introStep.description}
                </Text>
              </FlexGap>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>

      {!isSubscribed && (
        <Box margin="20px" height={isSubscribed ? '10%' : '20%'}>
          <NotificationsOnboardingButton isReady={isReady} isRegistered={isRegistered} height="50px" />
        </Box>
      )}
    </Flex>
  )
}

export default OnBoardingView
