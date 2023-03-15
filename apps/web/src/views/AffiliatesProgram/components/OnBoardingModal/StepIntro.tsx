import { Trans } from '@pancakeswap/localization'
import { Heading, Text, Flex, Box } from '@pancakeswap/uikit'
import Image from 'next/image'
import useTheme from 'hooks/useTheme'
import { useState, useCallback } from 'react'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/bundle'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper/types'
import { Autoplay } from 'swiper'

const IntroSteps = [
  {
    title: <Trans>Enjoy Low Fees</Trans>,
    icon: '/images/affiliates-program/slider/1.png',
    description: <Trans>We offer the lowest fees in the industry, giving you more value for your trades</Trans>,
  },
  {
    title: <Trans>Simplified Decentralized Trading</Trans>,
    icon: '/images/affiliates-program/slider/2.png',
    description: (
      <Trans>
        Experience true decentralization with our exchange, offering you complete control over your trades in a secure
        and easy-to-use environment.
      </Trans>
    ),
  },
  {
    title: <Trans>Earn while you Trade</Trans>,
    icon: '/images/affiliates-program/slider/3.png',
    description: (
      <Trans>
        Earn CAKE tokens on most trades made on PancakeSwap. Stake for more rewards or use them in our Lottery and
        Pottery
      </Trans>
    ),
  },
]

const StepDot = ({
  active,
  place,
  onClick,
}: {
  active: boolean
  place: 'left' | 'center' | 'right'
  onClick: () => void
}) => {
  const { theme } = useTheme()
  let radius = '0'

  if (place === 'left') {
    radius = '8px 0 0 8px'
  }
  if (place === 'right') {
    radius = '0 8px 8px 0'
  }

  return (
    <Flex width="100%" padding="4px" onClick={onClick} style={{ cursor: 'pointer' }}>
      <Box
        width="56px"
        height="8px"
        borderRadius={radius}
        background={active ? theme.colors.secondary : theme.colors.inputSecondary}
      />
    </Flex>
  )
}

const StepIntro = () => {
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
    <Flex flexDirection="column" justifyContent="center" alignItems="center" margin="auto">
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
        style={{ width: '300px', marginLeft: '0px', marginRight: '0px' }}
      >
        {IntroSteps.map((introStep) => (
          <SwiperSlide key={introStep.icon}>
            <Box width="226px" m="auto">
              <Image src={introStep.icon} width={226} height={210} alt="" />
            </Box>
            <Heading textAlign="center" as="h2" color="secondary" mb="33px">
              {introStep.title}
            </Heading>
            <Text maxWidth="237px" m="auto" small color="textSubtle">
              {introStep.description}
            </Text>
          </SwiperSlide>
        ))}
      </Swiper>
      <Flex>
        <StepDot place="left" active={step === 0} onClick={handleStepClick(0)} />
        <StepDot place="center" active={step === 1} onClick={handleStepClick(1)} />
        <StepDot place="right" active={step === 2} onClick={handleStepClick(2)} />
      </Flex>
    </Flex>
  )
}

export default StepIntro
