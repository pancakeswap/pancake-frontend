import { Trans, useTranslation } from '@pancakeswap/localization'
import {
  ArrowForwardIcon,
  Box,
  CalculateIcon,
  DonateIcon,
  Flex,
  HooksIcon,
  Image,
  PoolTypeIcon,
  SingletonIcon,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import { styled } from 'styled-components'

import 'swiper/css'
import 'swiper/css/autoplay'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { Swiper as SwiperClass } from 'swiper/types'

const FeaturesContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 0 16px;
  margin: 40px auto;

  @media screen and (min-width: 1440px) {
    width: 1200px;
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

  ${({ theme }) => theme.mediaQueries.md} {
    width: 340px;
    border-radius: 24px;
    margin: 0 0 8px 0;
    padding: 16px 12px 16px 20px;
  }
`

const SwiperStyled = styled(Swiper)`
  position: relative;

  ${({ theme }) => theme.mediaQueries.md} {
    top: -80px;
    width: 600px;
    margin-left: auto;
  }
`

const DetailStyled = styled(Box)`
  width: 600px;
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

  ${({ theme }) => theme.mediaQueries.md} {
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

const FeaturesConfig = [
  {
    id: 1,
    title: <Trans>Hooks</Trans>,
    icon: <HooksIcon color="secondary" width={24} height={24} />,
    subTitle: (
      <Trans>
        Unlock unparalleled customization with Hooks, enhancing liquidity pool functionality through smart contracts.
        Tailor your liquidity pools precisely, defining Hook contracts for key actions like initialize, swap, modify,
        position, and donate. Enable dynamic fees, on-chain limit orders, custom oracles, and more with PancakeSwap&apos
        Hooks!
      </Trans>
    ),
    imgUrl: '/images/v4-landing/features-1.png',
  },
  {
    id: 2,
    title: <Trans>Customized Pool Types</Trans>,
    icon: <PoolTypeIcon color="secondary" width={24} height={24} />,
    subTitle: (
      <Trans>
        Explore a modular and sustainable design for AMMs, supporting multiple pool types and AMM logic through Hooks
        and gas optimization. Launching with CLAMM pools featuring Hooks and the first-ever liquidity book AMM,
        PancakeSwap v4&apos architecture ensures future-proof deployment of sophisticated AMM logic.
      </Trans>
    ),
    imgUrl: '/images/v4-landing/features-1.png',
  },
  {
    id: 3,
    title: <Trans>Singleton</Trans>,
    icon: <SingletonIcon color="secondary" width={24} height={24} />,
    subTitle: (
      <Trans>
        Introducing Singleton for unparalleled trading efficiency and gas savings. Singleton consolidates all pools,
        cutting gas costs by 99% for deploying new pools. Multi-hop transactions are streamlined, eliminating the need
        for token movement between contracts.
      </Trans>
    ),
    imgUrl: '/images/v4-landing/features-1.png',
  },
  {
    id: 4,
    title: <Trans>Flash Accounting</Trans>,
    icon: <CalculateIcon color="secondary" width={24} height={24} />,
    subTitle: (
      <Trans>
        Flash Accounting optimizes gas usage by computing net balances for transactions and settling them collectively,
        resulting in significant gas savings.
      </Trans>
    ),
    imgUrl: '/images/v4-landing/features-1.png',
  },
  {
    id: 5,
    title: <Trans>Donate</Trans>,
    icon: <DonateIcon color="secondary" width={24} height={24} />,
    subTitle: (
      <Trans>
        Empower your liquidity pool with the innovative Donate method. It enables direct payments to in-range LPs in one
        or both pool tokens. Donate ensures seamless and efficient transactions by leveraging the pool&apos fee
        accounting system.
      </Trans>
    ),
    imgUrl: '/images/v4-landing/features-1.png',
  },
]

export const Features = () => {
  const { t } = useTranslation()
  const { isSm, isXs, isMd } = useMatchBreakpoints()
  const [percentage, setPerCentage] = useState(0)
  const [step, setStep] = useState(1)
  const [swiper, setSwiper] = useState<SwiperClass | undefined>(undefined)

  const isBigDevice = !isXs && !isSm && !isMd

  const handleStepClick = (stepIndex: number) => {
    // setStep(stepIndex)
    // swiper?.slideTo(stepIndex - 1)
  }

  const handleRealIndexChange = useCallback((swiperInstance: SwiperClass) => {
    setStep(swiperInstance.realIndex + 1)
  }, [])

  const onAutoplayTimeLeft = (s, time, progress) => {
    setPerCentage(1 - progress)
  }

  return (
    <FeaturesContainer>
      <Text
        bold
        mb="40px"
        fontSize={['28px', '36px', '36px', '40px']}
        lineHeight={['32px', '36px', '36px', '40px']}
        textAlign={['center', 'center', 'center', 'left']}
      >
        {t('Features')}
      </Text>
      <Flex width="100%" flexDirection={['column', 'column', 'column', 'row']} justifyContent={['space-between']}>
        <Flex flexDirection={['row', 'row', 'row', 'column']} m={['auto', 'auto', 'auto', '0 auto 0 0']}>
          {FeaturesConfig.map((config) => {
            const isPicked = step === config.id
            return (
              <ListStyled key={config.id} $isPicked={isPicked} onClick={() => handleStepClick(config.id)}>
                <Box display={['none', 'none', 'none', 'flex']}>
                  <Flex alignSelf="center" opacity={isPicked ? 1 : 0.6}>
                    {config.icon}
                  </Flex>
                  <Text color={isPicked ? 'text' : 'textSubtle'} ml="16px" fontSize={20} bold>
                    {config?.title}
                  </Text>
                </Box>
                <CountdownContainer $percentage={percentage}>
                  {isBigDevice ? (
                    <>
                      {isPicked && (
                        <>
                          <svg>
                            <circle r="15" cx="16" cy="16" />
                            <circle r="15" cx="16" cy="16" />
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
            )
          })}
        </Flex>
        <SwiperStyled
          loop
          centeredSlides
          slidesPerView={1}
          modules={[Autoplay]}
          autoplay={{
            delay: 2500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          onSwiper={setSwiper}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          onRealIndexChange={handleRealIndexChange}
        >
          {FeaturesConfig.map((config) => (
            <SwiperSlide key={config.id}>
              <DetailStyled>
                <Image width={600} height={337} src={config.imgUrl} alt="img" />
                <Text
                  bold
                  mb={['16px']}
                  fontSize={['20px', '20px', '20px', '28px']}
                  lineHeight={['24px', '24px', '24px', '32px']}
                >
                  {config.title}
                </Text>
                <Text lineHeight={['20px', '20px', '20px', '24px']} fontSize={['14px', '14px', '14px', '16px']}>
                  {config.subTitle}
                </Text>
              </DetailStyled>
            </SwiperSlide>
          ))}
        </SwiperStyled>
      </Flex>
    </FeaturesContainer>
  )
}
