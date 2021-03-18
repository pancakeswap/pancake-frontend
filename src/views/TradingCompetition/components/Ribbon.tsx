import React from 'react'
import styled from 'styled-components'
import { Text, Flex } from '@pancakeswap-libs/uikit'
import RibbonDownMid from '../svgs/RibbonDownMid'
import { ReactComponent as RibbonUpMid } from '../svgs/ribbon-up-mid.svg'
import { ReactComponent as RibbonUpSide } from '../svgs/ribbon-up-side.svg'
import Laurel from './Laurel'
import { ReactComponent as RibbonDownSide } from '../svgs/ribbon-down-side.svg'

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

const RibbonDownSideRight = styled(RibbonDownSide)`
  position: absolute;
  right: 0;
  z-index: 1;
  transform: scaleX(-1);
  right: -31px;
`

const RibbonDownSideLeft = styled(RibbonDownSide)`
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

  svg {
    height: 22px;
  }

  ${({ dir }) =>
    dir === 'l'
      ? `
    left: -5px;
    transform: rotate(-30deg);
  `
      : `
      right: -5px;
      transform: rotate(30deg);`}
`

const RightLaurelWrapper = styled.div`
  position: absolute;
  z-index: 2;
  right: 0;
  svg {
    width: 16px;
  }
`

const VisuallyHiddenText = styled(Text)`
  visibility: hidden;
  padding: 0 24px;
`

export const RibbonDown = ({ children }) => {
  return (
    <Wrapper>
      <RibbonDownSideLeft />
      <LaurelWrapper dir="l">
        <Laurel dir="l" />
      </LaurelWrapper>
      <div>
        <ExpandingRibbonDownMid preserveAspectRatio="none" />
        <VisuallyHiddenText>{children}</VisuallyHiddenText>
      </div>
      <TextWrapper>
        <Text p="0 24px">{children}</Text>
      </TextWrapper>
      <LaurelWrapper dir="r">
        <Laurel dir="r" />
      </LaurelWrapper>
      <RibbonDownSideRight />
    </Wrapper>
  )
}

export default RibbonDown
