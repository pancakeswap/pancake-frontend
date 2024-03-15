import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Button, Flex, Image, OpenNewIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { useEffect, useMemo, useRef, useState } from 'react'
import { styled } from 'styled-components'
import { useFeaturesConfig } from 'views/LandingV4/hooks/useFeaturesConfig'

import 'swiper/css'
import 'swiper/css/autoplay'

const FeaturesContainer = styled(Flex)`
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  margin: 40px auto;
  flex-direction: column;

  @media screen and (min-width: 1440px) {
    padding: 0;
    margin: 96px auto;
  }
`

const ListStyled = styled(Flex)<{ $isPicked?: boolean }>`
  cursor: pointer;
  margin-right: 12px;
  border-radius: 50%;
  background: ${({ theme, $isPicked }) => ($isPicked ? theme.card.background : 'transparent')};
  border: solid 1px;
  border-color: ${({ theme, $isPicked }) => ($isPicked ? `${theme.colors.cardBorder}` : 'transparent')};

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 264px;
    border-radius: 50px;
    margin: 0 0 8px 0;
    padding: 8px;
    border-bottom: ${({ theme, $isPicked }) =>
      $isPicked ? `solid 2px ${theme.colors.cardBorder}` : 'solid 2px transparent'};
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 340px;
    padding: 16px 12px 16px 20px;
  }
`

const DetailStyled = styled(Box)`
  position: relative;
  top: 0;
  width: 100%;
  margin: 40px auto auto auto;
  min-height: 425px;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-height: 500px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0px;
    min-height: 300px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    top: -80px;
    width: 600px;
    min-height: 550px;
  }
`

const AnimationContainer = styled(Box)<{ $showAnimation?: boolean }>`
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

const CountdownContainer = styled.div<{ $percentage: number }>`
  position: relative;
  margin-left: auto;
  height: 40px;
  width: 40px;

  >svg: first-child {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    transform: rotateY(-180deg) rotateZ(-90deg);
    stroke-width: 2px;

    > circle {
      fill: none;
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-dasharray: 120px;
    }

    > circle:first-child {
      stroke-dashoffset: 0px;
      stroke: ${({ theme }) => theme.colors.cardBorder};
    }

    > circle:nth-child(2) {
      stroke: ${({ theme }) => theme.colors.primaryBright};
      stroke-dashoffset: ${({ $percentage }) => `${120 * $percentage}px`};
    }
  }

  > svg:nth-child(2) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 28px;
    width: 28px;

    >svg: first-child {
      height: 28px;
      width: 28px;
    }

    > circle {
      stroke-dasharray: 93px;
    }

    > circle:nth-child(2) {
      stroke: ${({ theme }) => theme.colors.primaryBright};
      stroke-dashoffset: ${({ $percentage }) => `${113 * $percentage}px`};
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    height: 32px;
    width: 32px;

    >svg: first-child {
      height: 32px;
      width: 32px;
    }

    > circle {
      stroke-dasharray: 93px;
    }

    > circle:nth-child(2) {
      stroke: ${({ theme }) => theme.colors.primaryBright};
      stroke-dashoffset: ${({ $percentage }) => `${93 * $percentage}px`};
    }
  }
`

const DISPLAY_TIMER = 10000

export const Features = () => {
  const { t } = useTranslation()
  const { isLg, isMd, isXl, isXxl } = useMatchBreakpoints()
  const [percentage, setPerCentage] = useState(0)
  const [step, setStep] = useState(0)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const [mouseEntered, setMouseEntered] = useState(false)
  const [showAnimation, setShowAnimation] = useState(true)
  const [remainingTimer, setRemainingTimer] = useState(DISPLAY_TIMER)
  const FeaturesConfig = useFeaturesConfig()

  const isBigDevice = useMemo(() => isMd || isLg || isXl || isXxl, [isLg, isMd, isXl, isXxl])

  const handleStepClick = (stepIndex: number) => {
    if (step !== stepIndex) {
      setTimeout(() => {
        setStep(stepIndex)
        setRemainingTimer(DISPLAY_TIMER)
        setShowAnimation(true)
      }, 600)
    }
  }

  useEffect(() => {
    const startCountdown = () => {
      if (mouseEntered) {
        return
      }

      // Clear previous interval
      if (timer.current) {
        if (showAnimation) {
          setTimeout(() => setShowAnimation(false), 1000)
        }

        clearInterval(timer.current)
      }

      timer.current = setInterval(() => {
        const timeInSecond = remainingTimer - 80
        const newRemainingTimer = timeInSecond > 0 ? timeInSecond : DISPLAY_TIMER
        setRemainingTimer(newRemainingTimer)

        const newPercentage = 1 - timeInSecond / DISPLAY_TIMER
        setPerCentage(newPercentage)

        if (newPercentage >= 1) {
          const nextStepIndex = step === FeaturesConfig.length - 1 ? 0 : step + 1
          setStep(nextStepIndex)
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
  }, [FeaturesConfig.length, mouseEntered, remainingTimer, showAnimation, step])

  return (
    <FeaturesContainer id="features">
      <Text
        bold
        mb="40px"
        fontSize={['28px', '36px', '36px', '36px', '40px']}
        lineHeight={['32px', '36px', '36px', '36px', '40px']}
        textAlign={['center', 'center', 'center', 'center', 'left']}
      >
        {t('Features')}
      </Text>

      <AnimationContainer $showAnimation={showAnimation}>
        <Box width={528} height={297} display={['none', 'none', 'block', 'block', 'none']} m="auto auto 40px auto">
          <Image width={528} height={297} src={FeaturesConfig[step].imgUrl} alt="img" />
        </Box>
      </AnimationContainer>

      <Flex width="100%" flexDirection={['column', 'column', 'row']} justifyContent={['space-between']}>
        <Flex
          flexDirection={['row', 'row', 'column']}
          m={['auto', 'auto', '0 25px 0 0', '0 25px 0 0', '0 40px 0 0', '0 auto 0 0']}
        >
          {FeaturesConfig?.map((config) => {
            const isPicked = step === config.id
            return (
              <div
                key={config.id}
                onMouseEnter={() => isPicked && setMouseEntered(true)}
                onMouseLeave={() => isPicked && setMouseEntered(false)}
              >
                <ListStyled $isPicked={isPicked} onClick={() => handleStepClick(config.id)}>
                  <Box display={['none', 'none', 'flex']}>
                    <Flex alignSelf="center" opacity={isPicked ? 1 : 0.6}>
                      {config.icon}
                    </Flex>
                    <Text
                      bold
                      color={isPicked ? 'text' : 'textSubtle'}
                      ml={['8px', '8px', '8px', '8px', '16px']}
                      fontSize={['16px', '16px', '16px', '16px', '20px']}
                    >
                      {config?.title}
                    </Text>
                  </Box>
                  <CountdownContainer $percentage={percentage}>
                    {isBigDevice ? (
                      <>
                        {isPicked && (
                          <>
                            <svg>
                              <circle
                                r={isMd || isLg ? '13' : '15'}
                                cx={isMd || isLg ? '14' : '16'}
                                cy={isMd || isLg ? '14' : '16'}
                              />
                              <circle
                                r={isMd || isLg ? '13' : '15'}
                                cx={isMd || isLg ? '14' : '16'}
                                cy={isMd || isLg ? '14' : '16'}
                              />
                            </svg>
                            <ArrowForwardIcon color="primary" />
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <svg>
                          <circle r="19" cx="20" cy="20" />
                          <circle r="19" cx="20" cy="20" opacity={isPicked ? 1 : 0} />
                        </svg>
                        <Flex
                          position="relative"
                          left="50%"
                          top="50%"
                          opacity={isPicked ? 1 : 0.6}
                          style={{ transform: 'translate(-30%,-50%)' }}
                        >
                          {config.icon}
                        </Flex>
                      </>
                    )}
                  </CountdownContainer>
                </ListStyled>
              </div>
            )
          })}
          <Box display={['none', 'none', 'none', 'none', 'block']}>
            <NextLinkFromReactRouter
              target="_blank"
              to="https://developer.pancakeswap.finance/?utm_source=v4landingpage&utm_medium=banner&utm_campaign=v4landingpage&utm_id=v4landingpage"
            >
              <Button width="fit-content" mt={['32px', '32px', '32px', '32px', '32px', '56px']}>
                <Text color="white" bold mr="4px">
                  {t('Read more')}
                </Text>
                <OpenNewIcon color="white" />
              </Button>
            </NextLinkFromReactRouter>
          </Box>
        </Flex>
        <AnimationContainer
          $showAnimation={showAnimation}
          onMouseEnter={() => setMouseEntered(true)}
          onMouseLeave={() => setMouseEntered(false)}
        >
          <DetailStyled>
            {!(isMd || isLg) && (
              <Box mb="40px">
                <Image width={600} height={337} src={FeaturesConfig[step].imgUrl} alt="img" />
              </Box>
            )}
            <Text
              bold
              m={['0px 0 16px 0']}
              fontSize={['20px', '20px', '20px', '20px', '28px']}
              lineHeight={['24px', '24px', '24px', '24px', '32px']}
            >
              {FeaturesConfig[step].title}
            </Text>
            <Text
              lineHeight={['20px', '20px', '20px', '20px', '24px']}
              fontSize={['14px', '14px', '14px', '14px', '16px']}
            >
              {FeaturesConfig[step].subTitle}
            </Text>
          </DetailStyled>
        </AnimationContainer>
      </Flex>
    </FeaturesContainer>
  )
}
