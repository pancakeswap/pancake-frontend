import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/image'
import { styled } from 'styled-components'

const Container = styled(Box)`
  padding: 24px;
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(0deg, #3D2A54 0%, #313D5C 100%)'
      : 'linear-gradient(0deg, #f1eeff 0%, #e9f6ff 100%)'};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 40px;
  }
`

const StyledBunny = styled(Box)`
  margin-left: auto;
`

export const Banner = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <Flex
        maxWidth={['1200px']}
        margin="auto"
        flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'column-reverse', 'row']}
      >
        <Flex flexDirection="column" alignSelf={['flex-start', 'flex-start', 'flex-start', 'flex-start', 'center']}>
          <Text
            bold
            color="secondary"
            fontSize={['36px', '36px', '40px', '40px', '48px', '48px', '64px']}
            lineHeight={['36px', '36px', '40px', '40px', '48px', '48px', '64px']}
            m={['24px 0 16px 0', '24px 0 16px 0', '24px 0 16px 0', '24px 0 16px 0', '0 0 16px 0']}
          >
            {t('Explore Campaigns')}
          </Text>
          <Text
            bold
            fontSize={['16px', '16px', '16px', '16px', '16px', '16px', '20px']}
            lineHeight={['16px', '16px', '16px', '16px', '16px', '16px', '20px']}
          >
            {t('Earn by contributing to the community')}
          </Text>
        </Flex>
        <StyledBunny>
          <Image
            alt="banner-image"
            width={270}
            height={220}
            style={{
              zIndex: 0,
              minWidth: 270,
            }}
            src={`${ASSET_CDN}/web/game/developers/game-banner-bunny.png`}
          />
        </StyledBunny>
      </Flex>
    </Container>
  )
}
