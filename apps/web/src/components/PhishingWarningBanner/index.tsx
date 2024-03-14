import { CloseIcon, Flex, IconButton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePhishingBanner } from '@pancakeswap/utils/user'
import { useCallback, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { Autoplay, EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { Countdown } from './Countdown'
import { Step1 } from './Step1'
import { Step2 } from './Step2'

const Container = styled(Flex)`
  overflow: hidden;
  height: 100%;
  padding: 12px;
  align-items: center;
  background: ${({ theme }) => theme.colors.textSubtle};

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px;
  }
`

const InnerContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const SpeechBubble = styled(Flex)`
  justify-content: space-between;
  position: relative;
  background: ${({ theme }) => theme.colors.text};
  border-radius: 16px;
  padding: 8px;
  width: 65%;
  height: 80%;
  align-items: center;

  & ${Text} {
    flex-shrink: 0;
    margin-right: 4px;
  }

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: -8px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: ${({ theme }) => `8px solid ${theme.colors.text}`};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-left: 8px;
    width: 900px;
  }
`

const DELAY_TIME = 2000

const PhishingWarningBanner: React.FC<React.PropsWithChildren> = () => {
  const [, hideBanner] = usePhishingBanner()
  const { isMobile, isMd } = useMatchBreakpoints()
  const [step, setStep] = useState(0)
  const [percentage, setPerCentage] = useState(0)

  const configList = useMemo(() => {
    return [<Step1 />, <Step2 />]
  }, [])

  const onAutoplayTimeLeft = (s, time, progress) => {
    setPerCentage(1 - progress)
  }

  const handleRealIndexChange = useCallback(
    (swiperInstance: SwiperClass) => {
      if (step !== swiperInstance.realIndex) {
        setTimeout(() => setStep(swiperInstance.realIndex), DELAY_TIME - 1000)
      }
    },
    [step],
  )

  const SwiperComponent = (
    <Swiper
      loop
      observer
      speed={5000}
      effect="fade"
      slidesPerView={1}
      modules={[Autoplay, EffectFade]}
      fadeEffect={{ crossFade: true }}
      autoplay={{ delay: DELAY_TIME, pauseOnMouseEnter: true, disableOnInteraction: false }}
      onAutoplayTimeLeft={onAutoplayTimeLeft}
      onRealIndexChange={handleRealIndexChange}
    >
      {configList.map((config, index) => {
        const childKey = `Banner${index}`
        return <SwiperSlide key={childKey}>{config}</SwiperSlide>
      })}
    </Swiper>
  )

  return (
    <Container className="warning-banner">
      {isMobile || isMd ? (
        <>
          <Flex alignItems="center">
            {SwiperComponent}
            <Countdown percentage={percentage} />
          </Flex>
          <IconButton onClick={hideBanner} variant="text">
            <CloseIcon color="#FFFFFF" />
          </IconButton>
        </>
      ) : (
        <>
          <InnerContainer>
            <img
              width="92px"
              alt="phishing-warning"
              src={`/images/decorations/phishing-warning-bunny-${step + 1}.png`}
            />
            <SpeechBubble>
              {SwiperComponent}
              <Countdown percentage={percentage} />
            </SpeechBubble>
          </InnerContainer>
          <IconButton onClick={hideBanner} variant="text">
            <CloseIcon color="#FFFFFF" />
          </IconButton>
        </>
      )}
    </Container>
  )
}

export default PhishingWarningBanner
