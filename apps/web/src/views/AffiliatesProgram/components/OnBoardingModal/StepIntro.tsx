import { styled } from 'styled-components'
import { Trans } from '@pancakeswap/localization'
import { Heading, Text, Flex, Box, useMatchBreakpoints, ChevronLeftIcon, ChevronRightIcon } from '@pancakeswap/uikit'
import Image from 'next/image'
import useTheme from 'hooks/useTheme'
import { useState, useCallback } from 'react'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { Autoplay, Navigation } from 'swiper/modules'

const MobileNavigation = styled('div')`
  position: absolute;
  top: 50%;
  width: 100%;
`

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
        and easy-to-use environment
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
    <Flex width="100%" style={{ cursor: 'pointer' }} padding="4px" onClick={onClick}>
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
  const { isDesktop } = useMatchBreakpoints()
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
    <Flex
      position="relative"
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      margin="auto"
    >
      <Swiper
        initialSlide={0}
        modules={[Autoplay, Navigation]}
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
        navigation={{
          prevEl: '.prev',
          nextEl: '.next',
        }}
      >
        {IntroSteps.map((introStep) => (
          <SwiperSlide key={introStep.icon}>
            {isDesktop && (
              <Box width="226px" m="auto">
                <Image
                  alt={introStep.title.toString()}
                  style={{ margin: 'auto', display: 'block' }}
                  src={introStep.icon}
                  width={130}
                  height={130}
                />
              </Box>
            )}
            <Box
              width={['300px', '300px', '300px', '300px', '237px']}
              m={['41px auto 32px auto', '41px auto 32px auto', '41px auto 32px auto', '41px auto 32px auto', '0 auto']}
            >
              <Heading as="h2" textAlign="center" mb={['18px', '18px', '18px', '18px', '33px']}>
                {introStep.title}
              </Heading>
              <Text textAlign="center" small color="textSubtle">
                {introStep.description}
              </Text>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      <Flex width={['100%', '100%', '100%', '100%', 'auto']}>
        {isDesktop ? (
          <>
            <StepDot place="left" active={step === 0} onClick={handleStepClick(0)} />
            <StepDot place="center" active={step === 1} onClick={handleStepClick(1)} />
            <StepDot place="right" active={step === 2} onClick={handleStepClick(2)} />
          </>
        ) : (
          <MobileNavigation>
            <ChevronLeftIcon className="prev" cursor="pointer" style={{ position: 'absolute', left: '16px' }} />
            <ChevronRightIcon className="next" cursor="pointer" style={{ position: 'absolute', right: '16px' }} />
          </MobileNavigation>
        )}
      </Flex>
    </Flex>
  )
}

export default StepIntro
