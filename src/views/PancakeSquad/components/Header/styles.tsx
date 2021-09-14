import { Box, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledSquadHeaderContainer = styled(Flex)`
  position: relative;
  background: linear-gradient(180deg, #8051d6 0%, #492286 100%);
`

export const StyledHeaderWaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;

  & > svg {
    max-height: 16px;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 5;
    top: 2px;
  }
`

export const StyledSquadEventBorder = styled(Box)`
  background: linear-gradient(180deg, #53dee9 0%, #7645d9 100%);
  border-radius: 32px;
`

export const StyledSquadEventContainer = styled(Flex)`
  background: ${({ theme }) => theme.colors.text};
  background-clip: padding-box;
  border-radius: inherit;
`
