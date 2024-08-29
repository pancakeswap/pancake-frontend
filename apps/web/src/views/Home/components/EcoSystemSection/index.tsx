import { useTranslation } from '@pancakeswap/localization'
import { Box, ChevronRightIcon, Flex, Text, useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import USCitizenConfirmModal from 'components/Modal/USCitizenConfirmModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { IdType, useUserNotUsCitizenAcknowledgement } from 'hooks/useUserIsUsCitizenAcknowledgement'
import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { getPerpetualUrl } from 'utils/getPerpetualUrl'
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

const useTradeBlockData = () => {
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()
  const { isDark } = useTheme()
  const { chainId } = useActiveChainId()
  const { push } = useRouter()
  const perpetualUrl = useMemo(() => getPerpetualUrl({ chainId, languageCode: code, isDark }), [chainId, code, isDark])
  const [onUSCitizenModalPresent] = useModal(
    <USCitizenConfirmModal title={t('PancakeSwap Perpetuals')} id={IdType.PERPETUALS} />,
    true,
    false,
    'usCitizenConfirmModal',
  )
  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement(IdType.PERPETUALS)

  return useMemo(() => {
    return [
      {
        title: t('Swap'),
        description: t('Trade crypto instantly across multiple chains'),
        ctaTitle: t('Trade Now'),
        image: `${ASSET_CDN}/web/landing/trade-swap.png`,
        defaultImage: `${ASSET_CDN}/web/landing/trade-swap-purple.png`,
        path: '/swap',
      },
      {
        title: t('Liquidity'),
        description: t('Fund liquidity pools, earn trading fees'),
        ctaTitle: t('Add Now'),
        image: `${ASSET_CDN}/web/landing/trade-liquidity.png`,
        defaultImage: `${ASSET_CDN}/web/landing/trade-liquidity-purple.png`,
        path: '/liquidity/positions',
      },
      {
        title: t('Bridge'),
        description: t('Seamlessly transfer assets across chains'),
        ctaTitle: t('Bridge Now'),
        image: `${ASSET_CDN}/web/landing/trade-bridge.png`,
        defaultImage: `${ASSET_CDN}/web/landing/trade-bridge-purple.png`,
        path: 'https://bridge.pancakeswap.finance/',
      },
      {
        title: t('Perpetual'),
        description: t('Trade endlessly without expiration dates'),
        ctaTitle: t('Trade Now'),
        image: `${ASSET_CDN}/web/landing/trade-perpetual.png`,
        defaultImage: `${ASSET_CDN}/web/landing/trade-perpetual-purple.png`,
        onClick: () => {
          if (!userNotUsCitizenAcknowledgement) {
            onUSCitizenModalPresent()
          } else {
            push(perpetualUrl)
          }
        },
      },
      {
        title: t('Buy Crypto'),
        description: t('Buy crypto with your preferred currency and payment method'),
        ctaTitle: t('Buy Now'),
        image: `${ASSET_CDN}/web/landing/trade-buy-crypto.png`,
        defaultImage: `${ASSET_CDN}/web/landing/trade-buy-crypto-purple.png`,
        path: '/buy-crypto',
      },
    ]
  }, [t, push, perpetualUrl, onUSCitizenModalPresent, userNotUsCitizenAcknowledgement])
}

const useEarnBlockData = () => {
  const { t } = useTranslation()
  return useMemo(() => {
    return [
      {
        title: t('Farm'),
        description: t('Stake LP tokens, harvest CAKE'),
        ctaTitle: t('Stake Now'),
        image: `${ASSET_CDN}/web/landing/earn-farm.png`,
        defaultImage: `${ASSET_CDN}/web/landing/earn-farm-purple.png`,
        path: '/liquidity/pools',
      },
      {
        title: t('Pools'),
        description: t('Stake CAKE, earn various rewards'),
        ctaTitle: t('Stake Now'),
        image: `${ASSET_CDN}/web/landing/earn-pools.png`,
        defaultImage: `${ASSET_CDN}/web/landing/earn-pools-purple.png`,
        path: '/pools',
      },
      {
        title: t('Liquid Staking'),
        description: t('Earn rewards while retaining asset flexibility'),
        ctaTitle: t('Add Now'),
        image: `${ASSET_CDN}/web/landing/earn-liquidity-staking.png`,
        defaultImage: `${ASSET_CDN}/web/landing/earn-liquidity-staking-purple.png`,
        path: '/liquid-staking',
      },
      {
        title: t('Simple Staking'),
        description: t('Earn rewards hassle-free with single-sided staking'),
        ctaTitle: t('Stake Now'),
        image: `${ASSET_CDN}/web/landing/earn-fixed-staking.png`,
        defaultImage: `${ASSET_CDN}/web/landing/earn-fixed-staking-purple.png`,
        path: '/simple-staking',
      },
      {
        title: t('Position Manager'),
        description: t('Automate your PancakeSwap v3 liquidity'),
        ctaTitle: t('Stake Now'),
        image: `${ASSET_CDN}/web/landing/earn-pm.png`,
        defaultImage: `${ASSET_CDN}/web/landing/earn-pm-purple.png`,
        path: '/position-managers',
        className: 'adjust-height',
      },
    ]
  }, [t])
}

const useNftGameBlockData = () => {
  const { t } = useTranslation()
  return useMemo(() => {
    return [
      {
        title: t('Gaming Marketplace'),
        description: t('Play, Build and Connect on PancakeSwap'),
        ctaTitle: t('Play Now'),
        image: `${ASSET_CDN}/web/landing/game-pancake-protectors.png`,
        defaultImage: `${ASSET_CDN}/web/landing/game-pancake-protectors-purple.png`,
        path: 'https://pancakeswap.games/',
      },
      {
        title: t('Prediction'),
        description: t('Forecast token prices within minutes'),
        ctaTitle: t('Try Now'),
        image: `${ASSET_CDN}/web/landing/game-prediction.png`,
        defaultImage: `${ASSET_CDN}/web/landing/game-prediction-purple.png`,
        path: '/prediction',
      },
      {
        title: t('NFT Marketplace'),
        description: t('Trade unique NFTs on BNB Chain'),
        ctaTitle: t('Trade Now'),
        image: `${ASSET_CDN}/web/landing/nft-marketplace.png`,
        defaultImage: `${ASSET_CDN}/web/landing/nft-marketplace-purple.png`,
        path: '/nfts',
        className: 'adjust-height',
      },
    ]
  }, [t])
}

const FeatureBox: React.FC<{
  title: string
  description: string
  image: StaticImageData | string
  defaultImage: StaticImageData | string
  width: number
  ctaTitle: string
  className?: string
  path?: string
  onClick?: () => void
}> = ({ title, description, image, defaultImage, ctaTitle, width, className, path, onClick }) => {
  const { theme } = useTheme()
  const { push } = useRouter()
  return (
    <ItemWrapper
      className={className}
      $flexBasis={width}
      onClick={onClick ? () => onClick() : () => path && push(path)}
    >
      <ImageBox>
        <Image className="default" src={defaultImage} width={108} height={108} alt={title} unoptimized />
        <Image className="hover" src={image} width={108} height={108} alt={title} unoptimized />
      </ImageBox>
      <Box>
        <Text fontSize="20px" mb="8px" lineHeight="110%" fontWeight={600} color={theme.colors.text}>
          {title}
        </Text>
        <Text fontSize="14px" lineHeight="120%" color={theme.colors.text}>
          {description}
        </Text>
      </Box>
      <Flex className="cta">
        <Text fontSize="16px" fontWeight={600} color={theme.colors.textSubtle}>
          {ctaTitle}
        </Text>
        <ChevronRightIcon color={theme.colors.textSubtle} />
      </Flex>
    </ItemWrapper>
  )
}

const EcoSystemSection: React.FC = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const tradeBlockData = useTradeBlockData()
  const earnBlockData = useEarnBlockData()
  const nftGameBlockData = useNftGameBlockData()
  const { isMobile, isMd } = useMatchBreakpoints()

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={isMobile ? '24px' : '60px'}>
      <GradientLogo height="48px" width="48px" mb="24px" />
      <Text textAlign="center" p="0px 20px">
        <Text
          fontSize={['32px', null, null, '40px']}
          lineHeight="110%"
          display="inline-block"
          bold
          color={theme.colors.text}
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
      <CardWrapper>
        <Flex
          style={{ gap: 32 }}
          flexDirection={isMobile || isMd ? 'column' : 'row'}
          alignItems={isMobile || isMd ? undefined : 'center'}
        >
          <Image
            style={{ marginLeft: isMobile ? -32 : -72 }}
            src={`${ASSET_CDN}/web/landing/trade-bunny.png`}
            alt="trade-bunny"
            width={340}
            height={340}
            unoptimized
          />
          <Flex flexDirection="column">
            <Title>{t('Trade')}</Title>
            <FeatureBoxesWrapper>
              {tradeBlockData.map((item) => (
                <FeatureBox
                  key={`${item.title}Block`}
                  className="type-a"
                  title={item.title}
                  description={item.description}
                  defaultImage={item.defaultImage}
                  image={item.image}
                  width={100 / tradeBlockData.length}
                  ctaTitle={item.ctaTitle}
                  path={item.path}
                  onClick={item.onClick}
                />
              ))}
            </FeatureBoxesWrapper>
          </Flex>
        </Flex>
      </CardWrapper>
      <CardWrapper>
        <Flex
          style={{ gap: 32 }}
          flexDirection={isMobile || isMd ? 'column' : 'row-reverse'}
          alignItems={isMobile || isMd ? undefined : 'center'}
        >
          <Image
            style={{ marginRight: isMobile || isMd ? 'auto' : -72, marginLeft: isMobile || isMd ? 0 : 'auto' }}
            src={`${ASSET_CDN}/web/landing/earn-bunny.png`}
            alt="earn-bunny"
            width={296}
            height={360}
            unoptimized
          />
          <Flex flexDirection="column">
            <Title>{t('Earn')}</Title>
            <FeatureBoxesWrapper>
              {earnBlockData.map((item) => (
                <FeatureBox
                  className={`type-a${item?.className ? ` ${item?.className}` : ''}`}
                  key={`${item.title}Block`}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  defaultImage={item.defaultImage}
                  width={100 / tradeBlockData.length}
                  ctaTitle={item.ctaTitle}
                  path={item.path}
                />
              ))}
            </FeatureBoxesWrapper>
          </Flex>
        </Flex>
      </CardWrapper>
      <CardWrapper>
        <Flex
          style={{ gap: 32 }}
          flexDirection={isMobile || isMd ? 'column' : 'row'}
          alignItems={isMobile || isMd ? undefined : 'center'}
        >
          <Image
            style={{ marginLeft: isMobile ? -32 : -72 }}
            src={`${ASSET_CDN}/web/landing/game-nft-bunny.png`}
            alt="game-nft-bunny"
            width={344}
            height={360}
            unoptimized
          />
          <Flex flexDirection="column">
            <Title>{t('Game & NFT')}</Title>
            <FeatureBoxesWrapper>
              {nftGameBlockData.map((item) => (
                <FeatureBox
                  className={`type-a higher${item?.className ? ` ${item?.className}` : ''}`}
                  key={`${item.title}Block`}
                  title={item.title}
                  description={item.description}
                  defaultImage={item.defaultImage}
                  image={item.image}
                  width={100 / tradeBlockData.length}
                  ctaTitle={item.ctaTitle}
                  path={item.path}
                />
              ))}
            </FeatureBoxesWrapper>
          </Flex>
        </Flex>
      </CardWrapper>
    </Flex>
  )
}

export default EcoSystemSection
