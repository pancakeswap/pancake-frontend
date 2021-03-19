import React from 'react'
import styled from 'styled-components'
import { Text, Flex } from '@pancakeswap-libs/uikit'
import { RibbonProps } from '../../types'
import RibbonDownMid from '../../svgs/RibbonDownMid'
import RibbonDownSide from '../../svgs/RibbonDownSide'
import RibbonUpSide from '../../svgs/RibbonUpSide'
import RibbonUpMid from '../../svgs/RibbonUpMid'
// import { ReactComponent as RibbonUpMid } from '../../svgs/ribbon-up-mid.svg'
// import { ReactComponent as RibbonUpSide } from '../../svgs/ribbon-up-side.svg'
import Laurel from '../Laurel'
import { HeadingText, VisuallyHiddenHeadingText } from '../CompetitionHeading'

const Wrapper = styled(Flex)<{ ribbonDirection?: 'up' | 'down' }>`
  position: relative;
  display: inline-flex;
  align-items: ${({ ribbonDirection }) => (ribbonDirection === 'up' ? 'flex-end' : 'flex-start')};
  justify-content: center;
`

const TextWrapper = styled(Flex)`
  display: flex;
  align-items: center;
  position: absolute;
  height: 46px;
  background-color: #7645d9;
`

const RibbonDownMidExpanding = styled(RibbonDownMid)`
  width: 100%;
  height: 48px;
`

const RibbonUpMidExpanding = styled(RibbonUpMid)`
  width: 100%;
  height: 48px;
`

const RightSideRibbonStyles = `
position: absolute;
right: 0;
z-index: 1;
transform: scaleX(-1);
right: -31px;
`

const RibbonDownRightSide = styled(RibbonDownSide)`
  ${RightSideRibbonStyles}
`

const RibbonUpRightSide = styled(RibbonUpSide)`
  ${RightSideRibbonStyles}
`

const LeftSideRibbonStyles = `
position: absolute;
left: -31px;
z-index: 1;
`

const RibbonDownLeftSide = styled(RibbonDownSide)`
  ${LeftSideRibbonStyles}
`

const RibbonUpLeftSide = styled(RibbonUpSide)`
  ${LeftSideRibbonStyles}
`

const LaurelWrapper = styled.div<{ dir?: 'l' | 'r' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 48px;
  z-index: 2;
  top: -1px;

  svg {
    height: 22px;
  }

  ${({ dir }) =>
    dir === 'l'
      ? `
    left: -4px;
    transform: rotate(-30deg);
  `
      : `
      right: -4px;
      transform: rotate(30deg);`}
`

const Ribbon: React.FC<RibbonProps> = ({ children, ribbonDirection }) => {
  const RibbonDown = () => {
    return (
      <Wrapper ribbonDirection={ribbonDirection}>
        <RibbonDownLeftSide width="32px" />
        <LaurelWrapper dir="l">
          <Laurel dir="l" />
        </LaurelWrapper>
        <div>
          <RibbonDownMidExpanding preserveAspectRatio="none" />
          <VisuallyHiddenHeadingText p="0 30px">{children}</VisuallyHiddenHeadingText>
        </div>
        <TextWrapper>
          <HeadingText p="0 30px">{children}</HeadingText>
        </TextWrapper>
        <LaurelWrapper dir="r">
          <Laurel dir="r" />
        </LaurelWrapper>
        <RibbonDownRightSide width="32px" />
      </Wrapper>
    )
  }

  const RibbonUp = () => {
    return (
      <Wrapper ribbonDirection={ribbonDirection}>
        <RibbonUpLeftSide width="32px" />
        <LaurelWrapper dir="l">
          <Laurel dir="l" />
        </LaurelWrapper>
        <div>
          <RibbonUpMidExpanding preserveAspectRatio="none" />
          <VisuallyHiddenHeadingText p="0 30px">{children}</VisuallyHiddenHeadingText>
        </div>
        <TextWrapper>
          <HeadingText p="0 30px">{children}</HeadingText>
        </TextWrapper>
        <LaurelWrapper dir="r">
          <Laurel dir="r" />
        </LaurelWrapper>
        <RibbonUpRightSide width="32px" />
      </Wrapper>
    )
  }

  return ribbonDirection === 'up' ? <RibbonUp /> : <RibbonDown />
}

export default Ribbon
