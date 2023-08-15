import { Flex, Text, Box, ChevronRightIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { useMemo } from 'react'
import Image, { StaticImageData } from 'next/image'
import tradeBunny from '../../images/trade-bunny.png'
import earnNftBunny from '../../images/earn-bunny.png'
import gameNftBunny from '../../images/game-nft-bunny.png'
import tradeSwap from '../../images/trade-swap.png'
import tradeLiquidity from '../../images/trade-liquidity.png'
import tradeBridge from '../../images/trade-bridge.png'
import tradePerpetual from '../../images/trade-perpetual.png'
import tradeBuy from '../../images/trade-buy-crypto.png'
import earnFarm from '../../images/earn-farm.png'
import earnPools from '../../images/earn-pools.png'
import earnLiquidStaking from '../../images/earn-liquidity-staking.png'
import earnFixedStaking from '../../images/earn-fixed-staking.png'
import gamePrediction from '../../images/game-prediction.png'
import gamePancakeProtectors from '../../images/game-pancake-protectors.png'
import gameLottery from '../../images/game-lottery.png'
import gamePottery from '../../images/game-pottery.png'
import nftMarketplace from '../../images/nft-marketplace.png'

export const CardWrapper = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  width: 1152px;
  box-sizing: border-box;
  padding: 48px 24px 24px 24px;
  min-height: 360px;
  margin-top: 48px;
`

export const ItemWrapper = styled(Flex)`
  align-items: left;
  justify-content: start;
  flex-direction: column;
  flex-grow: 1;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
`

export const Title = styled.div`
  font-size: 32px;
  margin-bottom: 24px;
  font-weight: 600;
  line-height: 110%;
  padding-left: 24px;
  color: ${({ theme }) => theme.colors.secondary};
`

const useTradeBlockData = () => {
  const { t } = useTranslation()
  return useMemo(() => {
    return [
      {
        title: t('Swap'),
        description: t('Trade crypto instantly across multiple chains'),
        ctaTitle: t('Trade Now'),
        image: tradeSwap,
      },
      {
        title: t('Liquidity'),
        description: t('Fund liquidity pools, earn trading fees'),
        ctaTitle: t('Add Liquidity'),
        image: tradeLiquidity,
      },
      {
        title: t('Bridge'),
        description: t('Seamlessly transfer assets across chains'),
        ctaTitle: t('Bridge Now'),
        image: tradeBridge,
      },
      {
        title: t('Perpetual'),
        description: t('Buy crypto with your preferred currency and payment method'),
        ctaTitle: t('Trade Now'),
        image: tradePerpetual,
      },
      {
        title: t('Buy Crypto'),
        description: t('Trade endlessly without expiration dates'),
        ctaTitle: t('Buy Now'),
        image: tradeBuy,
      },
    ]
  }, [t])
}

const useEarnBlockData = () => {
  const { t } = useTranslation()
  return useMemo(() => {
    return [
      {
        title: t('Farm'),
        description: t('Stake LP tokens, harvest CAKE'),
        ctaTitle: t('Stake Now'),
        image: earnFarm,
      },
      {
        title: t('Pools'),
        description: t('Stake CAKE, earn various rewards'),
        ctaTitle: t('Stake Now'),
        image: earnPools,
      },
      {
        title: t('Liquid Staking'),
        description: t('Earn rewards while retaining asset flexibility'),
        ctaTitle: t('Add Liquidity Now'),
        image: earnLiquidStaking,
      },
      {
        title: t('Coming Soon'),
        description: t('Fixed staking'),
        ctaTitle: t('Learn More'),
        image: earnFixedStaking,
      },
    ]
  }, [t])
}

const useNftGameBlockData = () => {
  const { t } = useTranslation()
  return useMemo(() => {
    return [
      {
        title: t('Prediction'),
        description: t('Forecast token prices within minutes'),
        ctaTitle: t('Try Now'),
        image: gamePrediction,
      },
      {
        title: t('Pancake Protectors'),
        description: t('Immersive PvP & PvE tower-defense GameFi'),
        ctaTitle: t('Try Now'),
        image: gamePancakeProtectors,
      },
      {
        title: t('Lottery'),
        description: t('Enter for a chance to win CAKE prize pools'),
        ctaTitle: t('Try Now'),
        image: gameLottery,
      },
      {
        title: t('Pottery'),
        description: t('Stake CAKE, acquire pottery tickets, win prizes'),
        ctaTitle: t('Try Now'),
        image: gamePottery,
      },
      {
        title: t('NFT Marketplace'),
        description: t('Trade unique NFTs on BNB Chain'),
        ctaTitle: t('Try Now'),
        image: nftMarketplace,
      },
    ]
  }, [t])
}

const FeatureBox: React.FC<{
  title: string
  description: string
  image: StaticImageData
  width: number
  ctaTitle: string
}> = ({ title, description, image, width, ctaTitle }) => {
  const { theme } = useTheme()
  return (
    <ItemWrapper flexBasis={`${width}%`}>
      <Image src={image} width={108} height={108} alt={title} />
      <Box>
        <Text fontSize="20px" mb="8px" lineHeight="110%" fontWeight={600} color={theme.colors.text}>
          {title}
        </Text>
        <Text fontSize="14px" lineHeight="120%" color={theme.colors.text}>
          {description}
        </Text>
      </Box>
      <Flex>
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

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <Text fontSize="40px" bold color={theme.colors.secondary}>
        {t('Discover the Ecosystem')}
      </Text>
      <CardWrapper>
        <Flex>
          <Image
            style={{ marginLeft: -72 }}
            src={tradeBunny}
            alt="tradeBunny"
            width={340}
            height={340}
            placeholder="blur"
          />
          <Flex flexDirection="column">
            <Title>{t('Trade')}</Title>
            <Flex>
              {tradeBlockData.map((item) => (
                <FeatureBox
                  key={`${item.title}Block`}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  width={100 / tradeBlockData.length}
                  ctaTitle={item.ctaTitle}
                />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </CardWrapper>
      <CardWrapper>
        <Flex style={{ gap: 32 }}>
          <Flex flexDirection="column">
            <Title>{t('Earn')}</Title>
            <Flex pl="24px">
              {earnBlockData.map((item) => (
                <FeatureBox
                  key={`${item.title}Block`}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  width={100 / tradeBlockData.length}
                  ctaTitle={item.ctaTitle}
                />
              ))}
            </Flex>
          </Flex>
          <Image
            style={{ marginRight: -72 }}
            src={earnNftBunny}
            alt="earnNftBunny"
            width={296}
            height={360}
            placeholder="blur"
          />
        </Flex>
      </CardWrapper>
      <CardWrapper>
        <Flex style={{ gap: 32 }}>
          <Image
            style={{ marginLeft: -72 }}
            src={gameNftBunny}
            alt="gameNftBunny"
            width={344}
            height={360}
            placeholder="blur"
          />
          <Flex flexDirection="column">
            <Title>{t('Game & NFT')}</Title>
            <Flex>
              {nftGameBlockData.map((item) => (
                <FeatureBox
                  key={`${item.title}Block`}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  width={100 / tradeBlockData.length}
                  ctaTitle={item.ctaTitle}
                />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </CardWrapper>
    </Flex>
  )
}

export default EcoSystemSection
