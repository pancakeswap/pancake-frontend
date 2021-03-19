import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { RibbonProps } from '../../types'
import Ribbon from '../Ribbon'

const Wrapper = styled(Flex)`
  position: relative;
`

const ImageComponentWrapper = styled.div``

const RibbonWrapper = styled(Flex)<{ ribbonDirection?: string }>`
  position: absolute;
  width: 100%;
  z-index: 1;
  left: 50%;
  bottom: ${({ ribbonDirection }) => (ribbonDirection === 'down' ? '-54px' : '-48px')};
  transform: translate(-50%, 0);
`

const RibbonWithImage: React.FC<RibbonProps> = ({ imageComponent, ribbonDirection = 'down', ribbonText = '' }) => {
  return (
    <Wrapper alignItems="center" justifyContent="center">
      <ImageComponentWrapper>{imageComponent}</ImageComponentWrapper>
      <RibbonWrapper alignItems="center" justifyContent="center" ribbonDirection={ribbonDirection}>
        <Ribbon ribbonDirection={ribbonDirection}>{ribbonText}</Ribbon>
      </RibbonWrapper>
    </Wrapper>
  )
}

export default RibbonWithImage
