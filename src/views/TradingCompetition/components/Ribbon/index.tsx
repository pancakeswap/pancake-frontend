import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { RibbonProps } from '../../types'
import Laurel from '../Laurel'
import {
  RibbonDownMidExpanding,
  RibbonUpMidExpanding,
  RibbonDownRightSide,
  RibbonUpRightSide,
  RibbonDownLeftSide,
  RibbonUpLeftSide,
} from './RibbonStyles'
import { HeadingText, VisuallyHiddenHeadingText } from '../CompetitionHeadingText'

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

const LaurelWrapper = styled.div<{ dir?: 'l' | 'r' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 48px;
  z-index: 2;
  top: -2px;

  svg {
    height: 20px;
    path {
      fill: ${({ theme }) => theme.colors.text};
    }
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
