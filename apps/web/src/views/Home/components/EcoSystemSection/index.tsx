import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import GradientLogo from '../GradientLogoSvg'

export const CardWrapper = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => (theme.isDark ? theme.colors.gradientBubblegum : theme.colors.backgroundAlt)};
  width: 100%;
  box-sizing: border-box;
  padding: 48px 24px 24px 24px;
  min-height: 360px;
  margin-top: 48px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1152px;
  }
`

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 75px;
  width: 100%;
  margin-top: 48px;

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr 1fr 1fr;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1152px;
    gap: 80px;
  }
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 48px 24px;
  border-radius: 20px;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.tertiary};
  opacity: 1;
  transition: opacity 0.25s ease-in-out;

  ${({ theme }) => theme.mediaQueries.xxl} {
    opacity: 0.8;
  }

  &:hover {
    opacity: 1;
  }
`

const CardImage = styled.img`
  width: 80%;
  height: auto;
`

export const ImageBox = styled.div`
  position: relative;
  transition: filter 0.25s linear;
  .default {
    display: none;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    .default {
      display: block;
      position: relative;
      z-index: 1;
    }
    .hover {
      transition: opacity 0.25s ease-in-out;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 2;
    }
    // filter: invert(38%) sepia(97%) saturate(433%) hue-rotate(215deg) brightness(83%) contrast(86%);
  }
`

export const ItemWrapper = styled(Flex)<{ $flexBasis: number }>`
  align-items: left;
  justify-content: space-between;
  flex-direction: column;
  flex-grow: 1;
  gap: 12px;
  cursor: pointer;
  .cta > * {
    transition: color 0.25s ease-in-out;
    path {
      transition: fill 0.25s ease-in-out;
    }
  }
  padding: 4px;
  &:hover {
    .cta > * {
      color: ${({ theme }) => theme.colors.primary};
      path {
        fill: ${({ theme }) => theme.colors.primary};
      }
    }
    ${ImageBox} {
      .hover {
        opacity: 1;
      }
      // filter: invert(0%) sepia(0%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%);
    }
  }
  flex-basis: calc(50% - 24px);

  &.type-a {
    height: 246px;
    &.adjust-height {
      margin-top: 20px;
      height: 220px;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      &.adjust-height {
        margin-top: 0px;
        height: 246px;
      }
      flex-basis: calc(33.3% - 48px);
    }
    ${({ theme }) => theme.mediaQueries.xl} {
      height: 286px;
      &.adjust-height {
        margin-top: 0px;
        height: 286px;
      }
      &.higher {
        height: 292px;
        &.adjust-height {
          margin-top: 0px;
          height: 292px;
        }
      }
    }
    ${({ theme }) => theme.mediaQueries.xxl} {
      flex-basis: ${({ $flexBasis }) => $flexBasis}%;
    }
  }
  &.type-b {
    height: 263px;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-basis: ${({ $flexBasis }) => $flexBasis}%;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      height: 286px;
    }
    ${({ theme }) => theme.mediaQueries.xl} {
      height: 256px;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 12px;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    flex-wrap: nowrap;
  }
`

export const FeatureBoxesWrapper = styled(Flex)`
  flex-wrap: wrap;
  gap: 24px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    flex-wrap: nowrap;
  }
`

export const Title = styled.div`
  font-size: 32px;
  margin-bottom: 24px;
  font-weight: 600;
  line-height: 110%;
  padding-left: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`

const useFeaturesData = () => {
  const { t } = useTranslation()
  return useMemo(() => {
    return [
      {
        title: t('Swap/Trade'),
        description: t('Trade crypto instantly in a Decentralized Exchange with simple and intuitive user experience!'),
        image: '/images/home/icons-3d/swap.png',
        path: '/swap',
      },
      {
        title: t('Liquidity Pools'),
        description: t(
          'Fund liquidity pools and earn trading fees! Integration of Frax assets with Pancakeswap liquidity via PCSX',
        ),
        image: '/images/home/icons-3d/liquidity-pool01.png',
        path: '/liquidity',
      },
      {
        title: t('Build'),
        description: t('Open source approach. Empowering developers to innovate, customize & collaborate'),
        image: '/images/home/icons-3d/farm02.png',
        path: '/farms',
      },
    ]
  }, [t])
}

const CardBox: React.FC<{
  title: string
  description: string
  image?: string
  className?: string
  path?: string
  onClick?: () => void
}> = ({ title, description, image, className, path, onClick }) => {
  const { theme } = useTheme()
  const { push } = useRouter()
  return (
    <Card className={className} onClick={onClick ? () => onClick() : () => path && push(path)}>
      <Box>
        <Text fontSize="20px" mb="8px" lineHeight="110%" fontWeight={600} color={theme.colors.secondary}>
          {title}
        </Text>
        <Text fontSize="14px" lineHeight="120%" mb="20px" color={theme.colors.primary}>
          {description}
        </Text>
        <Flex justifyContent="center">
          <CardImage src={image} alt={title} />
        </Flex>
      </Box>
    </Card>
  )
}

const EcoSystemSection: React.FC = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const featuresBlockData = useFeaturesData()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={isMobile ? '24px' : '60px'}>
      <GradientLogo height="48px" width="48px" mb="24px" />
      <Text textAlign="center" p="0px 20px">
        <Text
          fontSize={['32px', null, null, '40px']}
          lineHeight="110%"
          display="inline-block"
          bold
          color={theme.colors.contrast}
        >
          {t('Discover the')}
        </Text>
        <Text
          fontSize={['32px', null, null, '40px']}
          ml="8px"
          display="inline-block"
          bold
          lineHeight="110%"
          color={theme.colors.secondary}
        >
          {t('Ecosystem')}
        </Text>
      </Text>
      <CardsContainer>
        {featuresBlockData.map((item) => (
          <CardBox
            key={`${item.title}Block`}
            title={item.title}
            description={item.description}
            image={item.image}
            path={item.path}
          />
        ))}
      </CardsContainer>
    </Flex>
  )
}

export default EcoSystemSection
