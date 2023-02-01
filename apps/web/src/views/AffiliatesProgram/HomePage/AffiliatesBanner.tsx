import styled from 'styled-components'
import { Flex, Text, Button, Box, PageSection } from '@pancakeswap/uikit'
import { SlideSvgDark, SlideSvgLight } from 'views/Home/components/SlideSvg'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/legacy/image'
import bunnyImage from '../../../../public/images/affiliates-program/banner.png'

const StyledBannerSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
  transform: scaleX(-1);
`

const AffiliatesBanner = () => {
  const { t } = useTranslation()

  return (
    <>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: linear-gradient(139.73deg, #e6fdff 0%, #f3efff 100%);
          }
          [data-theme='dark'] #home-1 .page-bg {
            background: radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%);
          }

          .slide-svg-dark {
            display: none;
          }
          .slide-svg-light {
            display: block;
          }
          .slide-svg-light path {
            fill: #faf9fa;
          }
          [data-theme='dark'] .slide-svg-dark {
            display: block;
          }
          [data-theme='dark'] .slide-svg-light {
            display: none;
          }
        `}
      </style>
      <StyledBannerSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <BgWrapper>
          <InnerWrapper>
            <SlideSvgDark className="slide-svg-dark" width="100%" />
            <SlideSvgLight className="slide-svg-light" width="100%" />
          </InnerWrapper>
        </BgWrapper>
        <Flex>
          <Box width={['375px']} height={['559px']}>
            <Image src={bunnyImage} alt="banner-image" />
          </Box>
          <Flex ml={['48px']} width={['697px']} alignSelf="center" flexDirection="column">
            <Text fontSize={['64px']} lineHeight="110%" bold color="secondary">
              Join our
              <span style={{ display: 'block' }}>Affiliates program</span>
            </Text>
            <Text fontSize={['24px']} lineHeight="110%" bold m="32px 0">
              Monetize your influence. Grow through robust analytics.
              <span style={{ display: 'block' }}>Join a tight-knit community</span>
            </Text>
            <Flex>
              <Button width="fit-content">Join our Affiliates Program</Button>
              <Button ml="12px" variant="secondary" width="fit-content">
                How does it work?
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </StyledBannerSection>
    </>
  )
}

export default AffiliatesBanner
