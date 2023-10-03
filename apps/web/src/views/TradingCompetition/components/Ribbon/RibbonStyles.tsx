import { styled } from 'styled-components'
import { RibbonDownMid, RibbonUpMid, RibbonDownSide, RibbonUpSide } from '../../svgs'

const MidRibbonStyles = `
width: 100%;
`

const RightSideRibbonStyles = `
position: absolute;
right: 0;
z-index: 1;
transform: scaleX(-1);
right: -31px;
`

const LeftSideRibbonStyles = `
position: absolute;
left: -31px;
z-index: 1;
`

export const RibbonDownMidExpanding = styled(RibbonDownMid)`
  ${MidRibbonStyles}
  height: 48px;
`

export const RibbonUpMidExpanding = styled(RibbonUpMid)`
  ${MidRibbonStyles}
  height: 46px;
`

export const RibbonDownRightSide = styled(RibbonDownSide)`
  ${RightSideRibbonStyles}
`

export const RibbonUpRightSide = styled(RibbonUpSide)`
  ${RightSideRibbonStyles}
`

export const RibbonDownLeftSide = styled(RibbonDownSide)`
  ${LeftSideRibbonStyles}
`

export const RibbonUpLeftSide = styled(RibbonUpSide)`
  ${LeftSideRibbonStyles}
`
