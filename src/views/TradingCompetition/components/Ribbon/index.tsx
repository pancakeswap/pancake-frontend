import React from 'react'
import styled from 'styled-components'
import { Flex, LaurelLeftIcon, LaurelRightIcon } from '@pancakeswap/uikit'
import { RibbonProps } from '../../types'
import {
  RibbonDownMidExpanding,
  RibbonUpMidExpanding,
  RibbonDownRightSide,
  RibbonUpRightSide,
  RibbonDownLeftSide,
  RibbonUpLeftSide,
} from './RibbonStyles'
import { Heading2Text, VisuallyHiddenHeading2Text } from '../CompetitionHeadingText'

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

const LaurelWrapper = styled.div<{ dir?: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translate(0, -50%);
  ${({ dir }) => (dir === 'left' ? `left: 0;` : `right: 0;`)}

  svg {
    height: 20px;
    width: auto;
    path {
      fill: ${({ theme }) => theme.colors.text};
    }
  }
`

const Ribbon: React.FC<RibbonProps> = ({ children, ribbonDirection }) => {
  const RibbonDown = () => {
    return (
      <Wrapper ribbonDirection={ribbonDirection}>
        <RibbonDownLeftSide width="32px" />
        <LaurelWrapper dir="left">
          <LaurelLeftIcon />
        </LaurelWrapper>
        <div>
          <RibbonDownMidExpanding preserveAspectRatio="none" />
          <VisuallyHiddenHeading2Text p="0 30px">{children}</VisuallyHiddenHeading2Text>
        </div>
        <TextWrapper>
          <Heading2Text p="0 30px">{children}</Heading2Text>
        </TextWrapper>
        <LaurelWrapper dir="right">
          <LaurelRightIcon />
        </LaurelWrapper>
        <RibbonDownRightSide width="32px" />
      </Wrapper>
    )
  }

  const RibbonUp = () => {
    return (
      <Wrapper ribbonDirection={ribbonDirection}>
        <RibbonUpLeftSide width="32px" />
        <LaurelWrapper dir="left">
          <LaurelLeftIcon />
        </LaurelWrapper>
        <div>
          <RibbonUpMidExpanding preserveAspectRatio="none" />
          <VisuallyHiddenHeading2Text p="0 30px">{children}</VisuallyHiddenHeading2Text>
        </div>
        <TextWrapper>
          <Heading2Text p="0 30px">{children}</Heading2Text>
        </TextWrapper>
        <LaurelWrapper dir="right">
          <LaurelRightIcon />
        </LaurelWrapper>
        <RibbonUpRightSide width="32px" />
      </Wrapper>
    )
  }

  return ribbonDirection === 'up' ? <RibbonUp /> : <RibbonDown />
}

export default Ribbon
