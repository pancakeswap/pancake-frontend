import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { RibbonProps } from '../../types'
import Ribbon from '../Ribbon'

const Wrapper = styled(Flex)<{ marginBottom?: string }>`
  position: relative;
  margin-bottom: ${({ marginBottom }) => marginBottom};
`

const Spacer = styled.div`
  height: 54px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 116px;
  }
`

const AbsoluteImageWrapper = styled.div`
  z-index: 2;
  position: absolute;
  /* When the absolute image wrapper is used - offset the image slightly to overlap the ribbon */
  bottom: -8px;
`

const RibbonWrapper = styled(Flex)<{ ribbonDirection?: string }>`
  position: absolute;
  width: 100%;
  z-index: 1;
  left: 50%;
  bottom: ${({ ribbonDirection }) => (ribbonDirection === 'down' ? '-54px' : '-50px')};
  transform: translate(-50%, 0);
`

const RibbonWithImage: React.FC<React.PropsWithChildren<RibbonProps>> = ({
  imageComponent,
  ribbonDirection = 'down',
  children,
  isCardHeader,
}) => {
  const marginBottom = () => {
    if (isCardHeader) {
      return '36px'
    }

    if (ribbonDirection === 'down') {
      return '66px'
    }

    return '50px'
  }

  return (
    <Wrapper alignItems="center" justifyContent="center" marginBottom={marginBottom()}>
      {isCardHeader ? (
        <>
          <Spacer />
          <AbsoluteImageWrapper>{imageComponent}</AbsoluteImageWrapper>
        </>
      ) : (
        imageComponent
      )}
      <RibbonWrapper alignItems="center" justifyContent="center" ribbonDirection={ribbonDirection}>
        <Ribbon ribbonDirection={ribbonDirection}>{children}</Ribbon>
      </RibbonWrapper>
    </Wrapper>
  )
}

export default RibbonWithImage
