import { useTranslation } from '@pancakeswap/localization'
import { Flex, Heading, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import CompositeImage from '../CompositeImage'
import CommunitySummary from './CommunitySummary'
import { CommunityTags } from './CommunityTags'
import { BlogCard, TwitterCards } from './TwitterCards'

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

const StyledSwiper = styled(Swiper)`
  width: 345px;
  position: relative;
  padding-bottom: 3px;
  .swiper-pagination {
    position: absolute;
    bottom: 24px;
    left: 24px;
    width: 72px;
    display: flex;
    height: 8px;
    border-radius: 24px;
    span {
      width: 50%;
      margin: 0 !important;
      border-radius: 24px;
      background-color: rgba(122, 110, 170, 0.7);
      &:first-child {
        border-radius: 4px 0px 0px 4px;
      }
      &:last-child {
        border-radius: 0px 4px 4px 0px;
      }
      &.swiper-pagination-bullet-active {
        background-color: #7645d9;
      }
    }
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
  path: '/images/home/socials/',
  attributes: [
    { src: '1', alt: 'CAKE card' },
    { src: '2', alt: 'Green CAKE card with up arrow' },
    { src: '3', alt: 'Red Cake card with down arrow' },
    { src: '4', alt: 'CAKE card' },
  ],
}

const topRightImage = {
  path: '/images/home/community-items/',
  attributes: [
    { src: '5', alt: 'Lottery ball number 9' },
    { src: '1', alt: 'Lottery ball number 2' },
    { src: '2', alt: 'Lottery ball number 4' },
    { src: '3', alt: 'Lottery ball number 6' },
    { src: '4', alt: 'Lottery ball number 7' },
  ],
}

const CommunitySection = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()

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
          <Flex
            style={{ gap: isMobile ? 0 : 8 }}
            justifyContent="center"
            alignItems="center"
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Heading scale="xl">{t('Join our')}</Heading>{' '}
            <Heading color={theme.isDark ? '#A881FC' : theme.colors.secondary} scale="xl">
              {t('Community')}
            </Heading>
          </Flex>
          <Text mb="40px" color="textSubtle" fontWeight={600} textAlign="center">
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
              <StyledSwiper
                modules={[Autoplay, Pagination, EffectFade]}
                spaceBetween={50}
                observer
                slidesPerView={1}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={500}
                autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: false }}
                loop
                pagination={{ clickable: true }}
              >
                <SwiperSlide key="TwitterCards">
                  <TwitterCards />
                </SwiperSlide>
                <SwiperSlide key="BlogCard">
                  <BlogCard />
                </SwiperSlide>
              </StyledSwiper>
            </Flex>
          </Flex>
        </Flex>
        <CommunityTags />
      </TransparentFrame>
    </>
  )
}

export default CommunitySection
