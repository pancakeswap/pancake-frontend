import { useTranslation } from '@pancakeswap/localization'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import CompositeImage from '../CompositeImage'
import CommunitySummary from './CommunitySummary'
import { CommunityTags } from './CommunityTags'
import TwitterCards from './TwitterCards'

const TransparentFrame = styled.div<{ isDark: boolean }>`
  background: ${({ theme }) => (theme.isDark ? 'rgba(8, 6, 11, 0.6)' : ' rgba(255, 255, 255, 0.6)')};
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-sizing: border-box;
  backdrop-filter: blur(12px);
  border-radius: 72px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 40px;
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
`

const BottomLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  bottom: -64px;
  max-width: 192px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100%;
  }
`

const TopRightImgWrapper = styled(Flex)`
  position: absolute;
  right: 0;
  top: -64px;

  max-width: 192px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100%;
  }
`

const bottomLeftImage = {
  path: '/images/home/prediction-cards/',
  attributes: [
    { src: 'bottom-left', alt: 'CAKE card' },
    { src: 'green', alt: 'Green CAKE card with up arrow' },
    { src: 'red', alt: 'Red Cake card with down arrow' },
    { src: 'top-right', alt: 'CAKE card' },
  ],
}

const topRightImage = {
  path: '/images/home/lottery-balls/',
  attributes: [
    { src: '2', alt: 'Lottery ball number 2' },
    { src: '4', alt: 'Lottery ball number 4' },
    { src: '6', alt: 'Lottery ball number 6' },
    { src: '7', alt: 'Lottery ball number 7' },
    { src: '9', alt: 'Lottery ball number 9' },
  ],
}

const CommunitySection = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <>
      <BgWrapper>
        <BottomLeftImgWrapper>
          <CompositeImage {...bottomLeftImage} />
        </BottomLeftImgWrapper>
        <TopRightImgWrapper>
          <CompositeImage {...topRightImage} />
        </TopRightImgWrapper>
      </BgWrapper>
      <TransparentFrame isDark={theme.isDark}>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Flex style={{ gap: 8 }}>
            <Heading scale="xl">{t('Join our')}</Heading>{' '}
            <Heading color={theme.isDark ? '#A881FC' : theme.colors.secondary} scale="xl">
              {t('Community')}
            </Heading>
          </Flex>
          <Text mb="40px" color="textSubtle">
            {t('Together we can make the PancakeSwap community even stronger')}
          </Text>
          <Flex m="0 auto" flexDirection={['column', null, null, 'row']} justifyContent="center" maxWidth="600px">
            <Flex
              flex="1"
              maxWidth={['275px', null, null, '100%']}
              mr={[null, null, null, '24px']}
              mb={['32px', null, null, '0']}
            >
              <CommunitySummary />
            </Flex>
            <Flex flex="1" maxWidth={['275px', null, null, '100%']}>
              <TwitterCards />
            </Flex>
          </Flex>
        </Flex>
        <CommunityTags />
      </TransparentFrame>
    </>
  )
}

export default CommunitySection
