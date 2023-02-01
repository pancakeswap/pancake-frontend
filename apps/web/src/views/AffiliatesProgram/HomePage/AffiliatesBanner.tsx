import styled from 'styled-components'
import { Flex, Text, Button } from '@pancakeswap/uikit'
import { SlideSvgDark, SlideSvgLight } from 'views/Home/components/SlideSvg'
import { useTranslation } from '@pancakeswap/localization'

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
          .slide-svg-dark {
            display: none;
          }
          .slide-svg-light {
            display: block;
          }
          [data-theme='dark'] .slide-svg-dark {
            display: block;
          }
          [data-theme='dark'] .slide-svg-light {
            display: none;
          }
        `}
      </style>
      <BgWrapper>
        <InnerWrapper>
          <SlideSvgDark className="slide-svg-dark" width="100%" />
          <SlideSvgLight className="slide-svg-light" width="100%" />
        </InnerWrapper>
      </BgWrapper>
      <Flex>
        <Flex width={['697px']} flexDirection="column">
          <Text fontSize={['64px']} lineHeight="110%" bold color="secondary">
            Join our
            <span style={{ display: 'block' }}>Affiliates program</span>
          </Text>
          <Text fontSize={['24px']} lineHeight="110%" bold m="32px 0">
            Monetize your influence. Grow through robust analytics.
            <span style={{ display: 'block' }}>Join a tight-knit community</span>
          </Text>
          <Button width="fit-content">Join our Affiliates Program</Button>
        </Flex>
      </Flex>
    </>
  )
}

export default AffiliatesBanner
