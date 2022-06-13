import styled from 'styled-components'
import { useState } from 'react'
import 'atropos/css'
import layer1 from '../../pngs/mobox-histortical-banner-layer1.png'
import layer2 from '../../pngs/mobox-histortical-banner-layer2.png'
import layer3 from '../../pngs/mobox-histortical-banner-layer3.png'
import layer4 from '../../pngs/mobox-histortical-banner-layer4.png'
import { BannerWrapper, BannerInner, BannerBg, FullLayerImage, CollapseButton, ContentWrapper } from './styled'
import MoboxCompetition from '../../MoboxCompetition'

const Layer2Image = styled.img`
  position: absolute;
  top: -20px;
  left: 200px;
  width: 96px;
`
const Layer3Image = styled.img`
  position: absolute;
  top: -25px;
  left: 500px;
  width: 132px;
`
const Layer4Image = styled.img`
  position: absolute;
  top: 40px;
  left: 50px;
  width: 315px;
`

export const MoboxHistoricalBanner: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <>
      <BannerWrapper shadow={false} highlight={false}>
        <BannerInner>
          <BannerBg data-atropos-offset="0" collapsed={collapsed} />
          <Layer3Image src={layer3.src} alt="" data-atropos-offset="3" />
          <FullLayerImage src={layer1.src} alt="" data-atropos-offset="3" />
          <Layer2Image src={layer2.src} alt="" data-atropos-offset="6" />
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
        <ContentWrapper>
          <MoboxCompetition />
        </ContentWrapper>
      )}
    </>
  )
}
