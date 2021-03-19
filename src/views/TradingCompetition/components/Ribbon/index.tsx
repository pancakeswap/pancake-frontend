import React from 'react'
import styled from 'styled-components'
import { Text, Flex } from '@pancakeswap-libs/uikit'
import { RibbonProps } from '../../types'
import RibbonDownMid from '../../svgs/RibbonDownMid'
import RibbonDownSide from '../../svgs/RibbonDownSide'
// import { ReactComponent as RibbonUpMid } from '../../svgs/ribbon-up-mid.svg'
// import { ReactComponent as RibbonUpSide } from '../../svgs/ribbon-up-side.svg'
import Laurel from '../Laurel'
import { HeadingText, VisuallyHiddenHeadingText } from '../CompetitionHeading'

const Wrapper = styled(Flex)`
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  justify-content: center;
`

const TextWrapper = styled(Flex)`
  display: flex;
  align-items: center;
  position: absolute;
  height: 46px;
  background-color: #7645d9;
`

const ExpandingRibbonDownMid = styled(RibbonDownMid)`
  width: 100%;
  height: 48px;
`

const RightSideRibbon = styled(RibbonDownSide)`
  position: absolute;
  right: 0;
  z-index: 1;
  transform: scaleX(-1);
  right: -31px;
`

const LeftSideRibbon = styled(RibbonDownSide)`
  position: absolute;
  left: -31px;
  z-index: 1;
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
      <Wrapper>
        <LeftSideRibbon width="32px" />
        <LaurelWrapper dir="l">
          <Laurel dir="l" />
        </LaurelWrapper>
        <div>
          <ExpandingRibbonDownMid preserveAspectRatio="none" />
          <VisuallyHiddenHeadingText p="0 30px">{children}</VisuallyHiddenHeadingText>
        </div>
        <TextWrapper>
          <HeadingText p="0 30px">{children}</HeadingText>
        </TextWrapper>
        <LaurelWrapper dir="r">
          <Laurel dir="r" />
        </LaurelWrapper>
        <RightSideRibbon width="32px" />
      </Wrapper>
    )
  }

  const RibbonUp = () => {
    return <span>up</span>
  }

  return ribbonDirection === 'up' ? <RibbonUp /> : <RibbonDown />
}

export default Ribbon
