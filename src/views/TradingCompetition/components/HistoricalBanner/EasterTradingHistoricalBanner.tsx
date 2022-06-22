import styled from 'styled-components'
import { useState } from 'react'
import 'atropos/css'
import layer1 from '../../pngs/easter-egg-banner-layer1.png'
import layer2 from '../../pngs/easter-egg-banner-layer2.png'
import layer3 from '../../pngs/easter-egg-banner-layer3.png'
import layer4 from '../../pngs/easter-egg-banner-layer4.png'
import { BannerWrapper, BannerInner, BannerBg, CollapseButton, ContentWrapper, BannerFooter } from './styled'
import EasterCompetition from '../../EasterCompetition'

const Layer1Image = styled.img`
  position: absolute;
  bottom: 0px;
  left: 295px;
  width: 200px;
`

const Layer2Image = styled.img`
  position: absolute;
  bottom: 0;
  right: 30px;
  width: 196px;
`
const Layer3Image = styled.img`
  position: absolute;
  top: 45px;
  left: 440px;
  width: 100px;
`
const Layer4Image = styled.img`
  position: absolute;
  top: 40px;
  left: 50px;
  width: 219px;
`

export const EasterTradingHistoricalBanner: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true)
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
          <Layer4Image src={layer4.src} data-atropos-offset="9" />
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
          <BannerFooter />
        </>
      )}
    </>
  )
}
