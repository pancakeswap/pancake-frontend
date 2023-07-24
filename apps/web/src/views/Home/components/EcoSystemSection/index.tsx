import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { useMemo } from 'react'
import Image from 'next/image'
import tradeBunny from '../../images/trade-bunny.png'
import earnNftBunny from '../../images/earn-bunny.png'
import gameNftBunny from '../../images/game-nft-bunny.png'

export const CardWrapper = styled.div`
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  box-shadow: 0px 2px 0px 0px ${({ theme }) => theme.colors.cardBorder};
  width: 1133px;
  box-sizing: border-box;
  padding: 32px;
  margin-bottom: 32px;
  min-height: 451px;
  margin-top: 64px;
`
export const Title = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  font-weight: 600;
  line-height: 110%;
  padding-left: 24px;
`

const useTradeBlockData = () => {
  const { t } = useTranslation()
  return useMemo(() => {
    return [
      {
        title: t('Swap'),
        description: t('Trade cryptocurrencies instantly across multiple chains'),
      },
      {
        title: t('Liquidity'),
        description: t('Fund liquidity pools, earn trading fees'),
      },
      {
        title: t('Bridge'),
        description: t('Seamlessly transfer assets across chains'),
      },
      {
        title: t('Perpetual'),
        description: t('Trade endlessly without expiration dates'),
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
      },
      {
        title: t('Pools'),
        description: t('Stake CAKE, earn various rewards'),
      },
      {
        title: t('Liquid Staking'),
        description: t('Earn rewards while retaining asset flexibility'),
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
      },
      {
        title: t('Pancake Protectors'),
        description: t('Immersive PvP & PvE tower-defense GameFi'),
      },
      {
        title: t('Lottery'),
        description: t('Enter for a chance to win CAKE prize pools'),
      },
      {
        title: t('Pottery'),
        description: t('Stake CAKE, acquire pottery tickets, win prizes'),
      },
      {
        title: t('NFT Marketplace'),
        description: t('Trade unique NFTs on BNB Chain'),
      },
    ]
  }, [t])
}

const FeatureBox: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const { theme } = useTheme()
  return (
    <Flex justifyContent="center" alignItems="left" flexDirection="column" flexBasis="50%" pr="20px">
      <Text fontSize="32px" mb="8px" lineHeight="110%" fontWeight={600} color={theme.colors.secondary}>
        {title}
      </Text>
      <Text fontSize="16px" lineHeight="120%" color={theme.colors.text}>
        {description}
      </Text>
    </Flex>
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
      <Text fontSize="40px" color={theme.colors.secondary}>
        {t('Discover the Ecosystem')}
      </Text>
      <CardWrapper>
        <Title>{t('Trade')}</Title>
        <Flex>
          <Image src={tradeBunny} alt="tradeBunny" width={353} height={271} placeholder="blur" />
          <Flex flexWrap="wrap">
            {tradeBlockData.map((item) => (
              <FeatureBox key={`${item.title}Block`} title={item.title} description={item.description} />
            ))}
          </Flex>
        </Flex>
      </CardWrapper>
      <CardWrapper>
        <Title>{t('Earn')}</Title>
        <Flex style={{ gap: 32 }}>
          <Flex flexWrap="wrap" pl="24px">
            {earnBlockData.map((item) => (
              <FeatureBox key={`${item.title}Block`} title={item.title} description={item.description} />
            ))}
          </Flex>
          <Image src={earnNftBunny} alt="earnNftBunny" width={315} height={314} placeholder="blur" />
        </Flex>
      </CardWrapper>
      <CardWrapper>
        <Title>{t('Game & NFT')}</Title>
        <Flex style={{ gap: 32 }}>
          <Image src={gameNftBunny} alt="gameNftBunny" width={326} height={326} placeholder="blur" />
          <Flex flexWrap="wrap">
            {nftGameBlockData.map((item) => (
              <FeatureBox key={`${item.title}Block`} title={item.title} description={item.description} />
            ))}
          </Flex>
        </Flex>
      </CardWrapper>
    </Flex>
  )
}

export default EcoSystemSection
