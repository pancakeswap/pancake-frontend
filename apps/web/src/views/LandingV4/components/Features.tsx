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
} from '@pancakeswap/uikit'
import { styled } from 'styled-components'

// import 'swiper/css';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';

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
  width: 340px;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 16px 12px 16px 20px;
  border-radius: 24px;
  background: ${({ theme, $isPicked }) => ($isPicked ? theme.card.background : 'initial')};
  border: ${({ theme, $isPicked }) => ($isPicked ? `1px solid ${theme.colors.cardBorder}` : 'initial')};
`

const DetailStyled = styled(Box)`
  position: relative;
  top: -80px;
  width: 600px;
`

const CountdownContainer = styled.div<{ $percentage: number }>`
  position: relative;
  margin-left: auto;
  height: 32px;
  width: 32px;

  >svg: first-child {
    position: absolute;
    top: 0;
    right: 0;
    width: 32px;
    height: 32px;
    transform: rotateY(-180deg) rotateZ(-90deg);
    stroke-width: 2px;

    > circle:first-child {
      position: relative;
      fill: none;
      z-index: 1;
      stroke-dasharray: 93px;
      stroke-dashoffset: 0px;
      stroke-linecap: round;
      stroke-width: 2px;
      stroke: ${({ theme }) => theme.colors.primaryBright};
    }

    > circle:nth-child(2) {
      position: relative;
      fill: none;
      z-index: 0;
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-dasharray: 93px;
      stroke: ${({ theme }) => theme.colors.cardBorder};
      stroke-dashoffset: ${({ $percentage }) => `${93 * ($percentage / 100)}px`};
    }
  }

  > svg:nth-child(2) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
  const pickedId: number = 1

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
      <Flex width="100%" flexDirection={['column', 'row']} justifyContent={['space-between']}>
        <Flex flexDirection={['row', 'column']}>
          {FeaturesConfig.map((config) => {
            const isPicked = pickedId === config.id

            return (
              <ListStyled key={config.id} $isPicked={isPicked}>
                <Flex alignSelf="center" opacity={isPicked ? 1 : 0.6}>
                  {config.icon}
                </Flex>
                <Text color={isPicked ? 'text' : 'textSubtle'} ml="16px" fontSize={20} bold>
                  {config?.title}
                </Text>
                {isPicked && (
                  <CountdownContainer $percentage={0}>
                    <svg>
                      <circle r="15" cx="16" cy="16" />
                      <circle r="15" cx="16" cy="16" />
                    </svg>
                    <ArrowForwardIcon color="primary" />
                  </CountdownContainer>
                )}
              </ListStyled>
            )
          })}
        </Flex>
        <DetailStyled>
          <Image width={600} height={337} src="/images/v4-landing/features-1.png" alt="img" />
          <Text
            bold
            mb={['16px']}
            fontSize={['20px', '20px', '20px', '28px']}
            lineHeight={['24px', '24px', '24px', '32px']}
          >
            Hooks
          </Text>
          <Text lineHeight={['20px', '20px', '20px', '24px']} fontSize={['14px', '14px', '14px', '16px']}>
            123
          </Text>
        </DetailStyled>
      </Flex>
    </FeaturesContainer>
  )
}
