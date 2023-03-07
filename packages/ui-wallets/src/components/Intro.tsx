import { Trans } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui/components/AtomBox'
import { Button, Heading, Image, LinkExternal, Text } from '@pancakeswap/uikit'
import { useState, useCallback } from 'react'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/bundle'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper/types'
import { Autoplay } from 'swiper'

const IntroSteps = [
  {
    title: <Trans>Your first step in the DeFi world</Trans>,
    icon: 'https://cdn.pancakeswap.com/wallets/wallet_intro.png',
    description: (
      <Trans>
        A Web3 Wallet allows you to send and receive crypto assets like bitcoin, BNB, ETH, NFTs and much more.
      </Trans>
    ),
  },
  {
    title: <Trans>Login using a wallet connection</Trans>,
    icon: 'https://cdn.pancakeswap.com/wallets/world_lock.png',
    description: (
      <Trans>
        Instead of setting up new accounts and passwords for every website, simply set up your wallet in one go, and
        connect it to your favorite DApps.
      </Trans>
    ),
  },
]

const StepDot = ({ active, place, onClick }: { active: boolean; place: 'left' | 'right'; onClick: () => void }) => (
  <AtomBox padding="4px" onClick={onClick} cursor="pointer">
    <AtomBox
      bgc={active ? 'secondary' : 'inputSecondary'}
      width="56px"
      height="8px"
      borderLeftRadius={place === 'left' ? 'card' : '0'}
      borderRightRadius={place === 'right' ? 'card' : '0'}
    />
  </AtomBox>
)

export const StepIntro = ({ docLink, docText }: { docLink: string; docText: string }) => {
  const [step, setStep] = useState(0)
  const [swiper, setSwiper] = useState<SwiperClass | undefined>(undefined)

  const handleRealIndexChange = useCallback((swiperInstance: SwiperClass) => {
    setStep(swiperInstance.realIndex)
  }, [])

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      return () => {
        setStep(stepIndex)
        swiper?.slideTo(stepIndex)
      }
    },
    [swiper],
  )

  return (
    <AtomBox
      display="flex"
      width="full"
      flexDirection="column"
      style={{ gap: '24px' }}
      mx="auto"
      my="48px"
      textAlign="center"
      alignItems="center"
    >
      <Swiper
        initialSlide={0}
        modules={[Autoplay]}
        slidesPerView="auto"
        onSwiper={setSwiper}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onRealIndexChange={handleRealIndexChange}
        centeredSlides
        loop
        style={{ marginLeft: '0px', marginRight: '0px' }}
      >
        {IntroSteps.map((introStep) => (
          <SwiperSlide key={introStep.icon}>
            <Heading as="h2" color="secondary">
              {introStep.title}
            </Heading>
            <Image m="auto" src={introStep.icon} width={198} height={178} />
            <Text maxWidth="368px" m="auto" small color="textSubtle">
              {introStep.description}
            </Text>
          </SwiperSlide>
        ))}
      </Swiper>
      <AtomBox display="flex">
        <StepDot place="left" active={step === 0} onClick={handleStepClick(0)} />
        <StepDot place="right" active={step === 1} onClick={handleStepClick(1)} />
      </AtomBox>
      <Button minHeight={40} variant="subtle" external as={LinkExternal} color="backgroundAlt" href={docLink}>
        {docText}
      </Button>
    </AtomBox>
  )
}
