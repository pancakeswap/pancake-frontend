import styled from 'styled-components'
import { Flex, Text, Button, Box, PageSection } from '@pancakeswap/uikit'
import { SlideSvgDark, SlideSvgLight } from 'views/Home/components/SlideSvg'
// import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/legacy/image'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import bunnyImage from '../../../../../public/images/affiliates-program/banner.png'

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

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;

  > img {
    position: absolute;
  }

  & :nth-child(1) {
    left: 2%;
    top: 2%;
    width: 69px;
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;

    ${({ theme }) => theme.mediaQueries.xl} {
      left: 15%;
      top: 8%;
      width: auto;
    }
  }


  & :nth-child(2) {
    left: 0%;
    bottom: 55%;
    width: 126px;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;


    ${({ theme }) => theme.mediaQueries.xl} {
      left: 15%;
      bottom: 5%;
      width: auto;
    }
  }

  & :nth-child(3) {
    right: 0%;
    top: 0%;
    width: 71px;

    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
    ${({ theme }) => theme.mediaQueries.xl} {
      right: 10%;
      top: 15%;
      width: auto;
    }
  }
}`

const AffiliatesBanner = () => {
  // const { t } = useTranslation()

  return (
    <>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: linear-gradient(
              142.67deg,
              #9bedff 10.8%,
              rgba(214, 201, 255, 0.4) 41.55%,
              rgba(214, 201, 255, 0.4) 81.99%
            );
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
        <Decorations>
          <img src="/images/affiliates-program/bobbing-1.png" width="155px" height="170px" alt="" />
          <img src="/images/affiliates-program/bobbing-2.png" width="240px" height="187px" alt="" />
          <img src="/images/affiliates-program/bobbing-3.png" width="160px" height="124px" alt="" />
        </Decorations>
        <BgWrapper>
          <InnerWrapper>
            <SlideSvgDark className="slide-svg-dark" width="100%" />
            <SlideSvgLight className="slide-svg-light" width="100%" />
          </InnerWrapper>
        </BgWrapper>
        <Flex flexDirection={['column', 'column', 'column', 'row']}>
          <Box
            m={['auto', 'auto', 'auto', '0']}
            width={['227px', '257px', '327px', '560px']}
            height={['306px', '356px', '406px', '639px']}
          >
            <Image src={bunnyImage} alt="banner-image" />
          </Box>
          <Flex
            m={['22px 0 0 0 0', '22px 0 0 0 0', '22px 0 0 0 0', '0 0 0 48px']}
            maxWidth={['697px']}
            alignSelf="center"
            flexDirection="column"
          >
            <Text fontSize={['38px', '38px', '64px']} lineHeight="110%" bold color="secondary">
              Maximize Your Earnings with Pancakeswap&apos;s Affiliate Program
            </Text>
            <Text fontSize={['16px', '24px']} lineHeight="110%" bold m="32px 0">
              Join the Team and Earn Commission on Every Adventure
            </Text>
            <Flex>
              <Button width="fit-content">Join Our Affiliate Program</Button>
              <Button ml="12px" variant="secondary" width="fit-content">
                Discover Your Commission Potential
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </StyledBannerSection>
    </>
  )
}

export default AffiliatesBanner
