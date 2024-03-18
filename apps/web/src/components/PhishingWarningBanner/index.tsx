import { CloseIcon, Flex, IconButton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePhishingBanner } from '@pancakeswap/utils/user'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { Autoplay, EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Countdown } from './Countdown'
import { Step1 } from './Step1'
import { Step2 } from './Step2'

const Container = styled(Flex)`
  overflow: hidden;
  height: 100%;
  padding: 12px;
  align-items: center;
  background: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px;
    background: ${({ theme }) => theme.colors.textSubtle};
  }
`

const InnerContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  align-items: center;
`

const SpeechBubble = styled(Flex)`
  position: relative;
  border-radius: 16px;
  width: 100%;
  height: 80%;
  align-items: center;
  justify-content: space-between;

  & ${Text} {
    flex-shrink: 0;
    margin-right: 4px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 8px;
    margin-left: 8px;
    width: 900px;
    background: ${({ theme }) => theme.colors.text};

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: -7px;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: ${({ theme }) => `8px solid ${theme.colors.text}`};
    }
  }
`

const DELAY_TIME = 2000

const PhishingWarningBanner: React.FC<React.PropsWithChildren> = () => {
  const [, hideBanner] = usePhishingBanner()
  const { isDesktop, isLg } = useMatchBreakpoints()
  const [percentage, setPerCentage] = useState(0)
  const showInBigDevice = isDesktop || isLg
  const configList = useMemo(() => [<Step1 />, <Step2 />], [])

  const onAutoplayTimeLeft = (s, time, progress) => {
    setPerCentage(1 - progress)
  }

  return (
    <Container className="warning-banner">
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
      >
        {configList.map((config, index) => {
          const childKey = `Banner${index}`
          return (
            <SwiperSlide key={childKey}>
              <Flex justifyContent="center" alignItems="center">
                {showInBigDevice && (
                  <img
                    width="92px"
                    alt="phishing-warning"
                    src={`/images/decorations/phishing-warning-bunny-${index + 1}.png`}
                  />
                )}
                <SpeechBubble>
                  <InnerContainer>{config}</InnerContainer>
                  {showInBigDevice && <Countdown percentage={percentage} />}
                </SpeechBubble>
              </Flex>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <IconButton onClick={hideBanner} variant="text">
        <CloseIcon color="#FFFFFF" />
      </IconButton>
    </Container>
  )
}

export default PhishingWarningBanner
