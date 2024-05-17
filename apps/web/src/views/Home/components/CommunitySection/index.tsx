import { useTranslation } from '@pancakeswap/localization'
import { Flex, Heading, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import CommunitySummary, { sharedCss } from './CommunitySummary'
import { CommunityTags } from './CommunityTags'
import { LeftBottomBox, RightBottomBox } from './ImagesOnBg'
import { BlogCard, TwitterCards } from './TwitterCards'

const TransparentFrame = styled.div<{ isDark: boolean }>`
  position: relative;
  z-index: 2;
  background: ${({ theme }) => (theme.isDark ? 'rgba(0, 0, 0, 0.80)' : ' rgba(255, 255, 255, 0.8)')};
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-sizing: border-box;
  backdrop-filter: blur(20px);
  border-radius: 72px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 40px;
  }
`

const StyledSwiper = styled(Swiper)`
  width: 340px;
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
  ${sharedCss}
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

const CommunitySection = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <BgWrapper>
        <RightBottomBox />
        <LeftBottomBox />
      </BgWrapper>
      <TransparentFrame isDark={theme.isDark}>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Flex
            style={{ gap: isMobile ? 0 : 8 }}
            justifyContent="center"
            alignItems="center"
            flexDirection={isMobile ? 'column' : 'row'}
            mb="12px"
          >
            <Heading scale="xl">{t('Join our')}</Heading>{' '}
            <Heading color={theme.isDark ? '#A881FC' : theme.colors.secondary} scale="xl">
              {t('Community')}
            </Heading>
          </Flex>
          <Text mb="40px" color="textSubtle" fontWeight={600} textAlign="center">
            {t('Together we can make the PancakeSwap community even stronger')}
          </Text>
          <Flex flexDirection="row" flexWrap="wrap" alignItems="center" style={{ gap: 24 }} justifyContent="center">
            <CommunitySummary />
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

        <CommunityTags />
      </TransparentFrame>
    </>
  )
}

export default CommunitySection
