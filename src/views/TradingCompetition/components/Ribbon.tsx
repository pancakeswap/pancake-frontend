import React from 'react'
import styled from 'styled-components'
import { Text, Flex } from '@pancakeswap-libs/uikit'
import RibbonDownMid from '../svgs/RibbonDownMid'
import { ReactComponent as RibbonUpMid } from '../svgs/ribbon-up-mid.svg'
import { ReactComponent as RibbonUpSide } from '../svgs/ribbon-up-side.svg'
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
  z-index: 2;
  transform: scaleX(-1);
  right: -31px;
`

const RibbonDownSideLeft = styled(RibbonDownSide)`
  position: absolute;
  left: -31px;
  z-index: 2;
`

const VisuallyHiddenText = styled(Text)`
  visibility: hidden;
  padding: 0 4px;
`

export const RibbonDown = ({ children }) => {
  return (
    <Wrapper>
      <RibbonDownSideLeft />
      <div>
        <ExpandingRibbonDownMid preserveAspectRatio="none" />
        <VisuallyHiddenText>{children}</VisuallyHiddenText>
      </div>
      <TextWrapper>
        <Text p="0 4px">{children}</Text>
      </TextWrapper>
      <RibbonDownSideRight />
    </Wrapper>
  )
}

export default RibbonDown
