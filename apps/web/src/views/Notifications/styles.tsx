import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'

export const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

export const ModalHeader = styled.div<{ background?: string }>`
  align-items: center;
  background: transparent;
  display: flex;
  padding-top: 12px;
  padding-left: 12px;
  padding-right: 12px;

  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ background }) => background || 'transparent'};
  }
`

export const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

export const FilterContainer = styled.div`
  display: flex;
  juxtify-content: space-between;
  align-items: center;
  width: 100%;
  //   padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

export const StyledInputCurrencyWrapper = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
  width: 200%; /* Specify the width of the container */
  height: 200%; /* Specify the height of the container */
  max-height: 545px;
`
export const ViewContainer = styled.div<{ isRightView: boolean }>`
  display: flex;
  width: 200%;
  transition: transform 300ms ease-in-out;
  transform: translateX(${({ isRightView }) => (isRightView ? '0%' : '-50%')});
`

export const View = styled.div`
  // flex: 1;
  // width: 50%;
  width: 100%;
`