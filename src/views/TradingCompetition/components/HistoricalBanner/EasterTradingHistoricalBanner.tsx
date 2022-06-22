import 'atropos/css'
import { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import EasterCompetition from '../../EasterCompetition'
import layer1 from '../../pngs/easter-egg-banner-layer1.png'
import layer2 from '../../pngs/easter-egg-banner-layer2.png'
import layer3 from '../../pngs/easter-egg-banner-layer3.png'
import layer4 from '../../pngs/easter-egg-banner-layer4.png'
import layer4Tablet from '../../pngs/easter-egg-banner-layer4-tablet.png'
import {
  BannerBg,
  BannerFooter,
  BannerInner,
  BannerWrapper,
  CollapseButton,
  ContentWrapper,
  FooterButton,
} from './styled'

const Layer1Image = styled.img`
  position: absolute;
  width: 110px;
  top: -10px;
  left: 90px;
  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 10px;
    left: 145px;
    width: 170px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: 0px;
    left: 295px;
    width: 200px;
  }
`

const Layer2Image = styled.img`
  position: absolute;
  width: 120px;
  right: 10px;
  top: -8px;
  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 0;
    right: 5px;
    width: 196px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: 0;
    right: 30px;
    width: 190px;
  }
`
const Layer3Image = styled.img`
  position: absolute;
  top: 20px;
  left: 170px;
  width: 70px;

  ${({ theme }) => theme.mediaQueries.md} {
    top: 45px;
    left: 270px;
    width: 90px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    top: 45px;
    left: 440px;
    width: 100px;
  }
`
const Layer4Image = styled.img`
  position: absolute;
  width: 110px;
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
    width: 219px;
  }
`

export const EasterTradingHistoricalBanner: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true)
  const { isTablet } = useMatchBreakpoints()
  return (
    <>
      <BannerWrapper shadow={false} highlight={false}>
        <BannerInner>
          <BannerBg
            style={{ background: `radial-gradient(77.72% 89.66% at 79.76% 65.74%, #FEDC90 0%, #FFA514 74.5%)` }}
            data-atropos-offset="0"
            collapsed={collapsed}
          />

          <Layer3Image src={layer3.src} alt="" data-atropos-offset="0" />
          <Layer2Image src={layer2.src} alt="" data-atropos-offset="3" />
          <Layer1Image src={layer1.src} alt="" data-atropos-offset="6" />
          <Layer4Image src={isTablet ? layer4Tablet.src : layer4.src} data-atropos-offset="9" />
          <CollapseButton
            collapsed={collapsed}
            data-atropos-offset="0"
            onClick={() => {
              setCollapsed(!collapsed)
            }}
          />
        </BannerInner>
      </BannerWrapper>
      {!collapsed && (
        <>
          <ContentWrapper>
            <EasterCompetition />
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
