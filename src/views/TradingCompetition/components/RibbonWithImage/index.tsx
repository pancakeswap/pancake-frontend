/* eslint-disable no-nested-ternary */
import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { RibbonProps } from '../../types'
import Ribbon from '../Ribbon'

const Wrapper = styled(Flex)<{ ribbonDirection?: string; isCardHeader?: boolean }>`
  position: relative;
  margin-bottom: ${({ ribbonDirection, isCardHeader }) =>
    isCardHeader ? '36px' : ribbonDirection === 'down' ? '54px' : '50px'};
`

const ImageComponentWrapper = styled.div<{ isCardHeader?: boolean }>`
  ${({ isCardHeader }) => (isCardHeader ? `` : ``)}
`

const RibbonWrapper = styled(Flex)<{ ribbonDirection?: string }>`
  position: absolute;
  width: 100%;
  z-index: 1;
  left: 50%;
  bottom: ${({ ribbonDirection }) => (ribbonDirection === 'down' ? '-54px' : '-50px')};
  transform: translate(-50%, 0);
`

const RibbonWithImage: React.FC<RibbonProps> = ({
  imageComponent,
  ribbonDirection = 'down',
  ribbonText = '',
  isCardHeader,
}) => {
  const margin = () => {
    return ''
  }

  return (
    <Wrapper alignItems="center" justifyContent="center" ribbonDirection={ribbonDirection} isCardHeader={isCardHeader}>
      <ImageComponentWrapper isCardHeader={isCardHeader}>{imageComponent}</ImageComponentWrapper>
      <RibbonWrapper alignItems="center" justifyContent="center" ribbonDirection={ribbonDirection}>
        <Ribbon ribbonDirection={ribbonDirection}>{ribbonText}</Ribbon>
      </RibbonWrapper>
    </Wrapper>
  )
}

export default RibbonWithImage
