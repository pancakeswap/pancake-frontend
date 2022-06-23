import { useMatchBreakpoints } from '@pancakeswap/uikit'
import 'atropos/css'
import { useState } from 'react'
import styled from 'styled-components'
import MoboxCompetition from '../../MoboxCompetition'
import layer1Tablet from '../../pngs/mobox-histortical-banner-layer1-tablet.png'
import layer1Mobile from '../../pngs/mobox-histortical-banner-layer1-mobile.png'
import layer1 from '../../pngs/mobox-histortical-banner-layer1.png'
import layer2 from '../../pngs/mobox-histortical-banner-layer2.png'
import layer3 from '../../pngs/mobox-histortical-banner-layer3.png'
import layer4 from '../../pngs/mobox-histortical-banner-layer4.png'
import {
  BannerBg,
  BannerFooter,
  BannerInner,
  BannerWrapper,
  CollapseButton,
  ContentWrapper,
  FooterButton,
  FullLayerImage,
  Wrapper,
} from './styled'

const Layer2Image = styled.img`
  position: absolute;
  width: 36px;
  top: -5px;
  left: 58px;
  ${({ theme }) => theme.mediaQueries.md} {
    top: -15px;
    left: 120px;
    width: 62px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    top: -20px;
    left: 200px;
    width: 96px;
  }
`
const Layer3Image = styled.img`
  position: absolute;
  width: 75px;
  top: -5px;
  left: 162px;
  ${({ theme }) => theme.mediaQueries.md} {
    top: -25px;
    left: 302px;
    width: 132px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    top: -25px;
    left: 500px;
    width: 132px;
  }
`
const Layer4Image = styled.img`
  position: absolute;
  width: 158px;
  top: 28px;
  left: 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    top: 51px;
    left: 32px;
    width: 236px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    top: 40px;
    left: 50px;
    width: 315px;
  }
`

export const MoboxHistoricalBanner: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true)
  const { isTablet, isMobile } = useMatchBreakpoints()

  return (
    <>
      <Wrapper>
        <CollapseButton
          collapsed={collapsed}
          onClick={() => {
            setCollapsed(!collapsed)
          }}
        />
        <BannerWrapper shadow={false} highlight={false} style={{ pointerEvents: collapsed ? 'auto' : 'none' }}>
          <BannerInner>
            <BannerBg data-atropos-offset="0" collapsed={collapsed} />
            <FullLayerImage
              src={isMobile ? layer1Mobile.src : isTablet ? layer1Tablet.src : layer1.src}
              alt=""
              data-atropos-offset="3"
            />
            <Layer3Image src={layer3.src} alt="" data-atropos-offset="3" />
            <Layer2Image src={layer2.src} alt="" data-atropos-offset="6" />
            <Layer4Image src={layer4.src} data-atropos-offset="9" />
          </BannerInner>
        </BannerWrapper>
      </Wrapper>
      {!collapsed && (
        <>
          <ContentWrapper>
            <MoboxCompetition />
          </ContentWrapper>
          <BannerFooter>
            <FooterButton
              onClick={() => {
                setCollapsed(true)
              }}
            />
          </BannerFooter>
        </>
      )}
    </>
  )
}
