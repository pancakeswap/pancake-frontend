import { CloseIcon, Flex, IconButton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePhishingBanner } from '@pancakeswap/utils/user'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useEffect, useMemo, useRef, useState } from 'react'
import { styled } from 'styled-components'
import 'swiper/css'
import 'swiper/css/effect-fade'

import { Countdown } from './Countdown'
import { Step1 } from './Step1'
import { Step2 } from './Step2'

const Container = styled(Flex)`
  overflow: hidden;
  height: 100%;
  padding: 12px;
  align-items: center;
  background: #280d5f;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px;
    background: #7a6eaa;
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
    width: 800px;
    padding: 8px;
    margin-left: 8px;
    background: #280d5f;

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
      border-right: 8px solid #280d5f;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 900px;
  }
`
const AnimationContainer = styled(Flex)<{ $showAnimation?: boolean }>`
  width: 100%;
  justify-content: center;
  animation: ${({ $showAnimation }) => ($showAnimation ? `fadeIn 1s linear;` : 'none')};

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const DISPLAY_TIMER = 13000

const PhishingWarningBanner: React.FC<React.PropsWithChildren> = () => {
  const [, hideBanner] = usePhishingBanner()
  const { isDesktop, isLg } = useMatchBreakpoints()
  const [percentage, setPerCentage] = useState(0)
  const showInBigDevice = isDesktop || isLg
  const [step, setStep] = useState(0)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const [showAnimation, setShowAnimation] = useState(true)
  const [remainingTimer, setRemainingTimer] = useState(DISPLAY_TIMER)

  const configList = useMemo(() => [<Step1 />, <Step2 />], [])

  const nextItem = useMemo(() => (step === 0 ? 1 : 0), [step])

  useEffect(() => {
    const startCountdown = () => {
      // Clear previous interval
      if (timer.current) {
        if (showAnimation) {
          setTimeout(() => setShowAnimation(false), 1000)
        }

        clearInterval(timer.current)
      }

      timer.current = setInterval(() => {
        const timeInSecond = remainingTimer - 70
        const newRemainingTimer = timeInSecond > 0 ? timeInSecond : DISPLAY_TIMER
        setRemainingTimer(newRemainingTimer)

        const newPercentage = 1 - timeInSecond / DISPLAY_TIMER
        setPerCentage(newPercentage)

        if (newPercentage >= 1) {
          setStep(nextItem)
          setShowAnimation(true)
        }
      }, 50)
    }

    startCountdown()

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [remainingTimer, showAnimation, step, nextItem])

  const handleClickNext = () => {
    setTimeout(() => {
      setStep(nextItem)
      setPerCentage(0)
      setRemainingTimer(DISPLAY_TIMER)
      setShowAnimation(true)
    }, 600)
  }

  return (
    <Container className="warning-banner">
      <AnimationContainer $showAnimation={showAnimation}>
        <Flex justifyContent="center" alignItems="center">
          {showInBigDevice && (
            <img
              width="92px"
              alt="phishing-warning"
              src={`${ASSET_CDN}/web/phishing-warning/phishing-warning-bunny-${step + 1}.png`}
            />
          )}
          <SpeechBubble>
            <InnerContainer>{configList[step]}</InnerContainer>
            <Countdown percentage={percentage} onClick={handleClickNext} />
          </SpeechBubble>
        </Flex>
      </AnimationContainer>
      <IconButton onClick={hideBanner} variant="text">
        <CloseIcon color="#FFFFFF" />
      </IconButton>
    </Container>
  )
}

export default PhishingWarningBanner
