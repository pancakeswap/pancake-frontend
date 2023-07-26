import styled from 'styled-components'
import { Box, Flex, Text } from '@pancakeswap/uikit'

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

export const StyledInputCurrencyWrapper = styled(Box)`
  width: 380px;
`
