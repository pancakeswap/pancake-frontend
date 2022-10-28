import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledEventStepsSectionContainer = styled(Flex)<{ $isDark: boolean }>`
  position: relative;
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(180deg, #0B4576 0%, #091115 100%)'
      : 'linear-gradient(180deg, #6fb6f1 0%, #eaf2f6 100%)'};
  z-index: 0;
`

export const StyledBunniesSquadImg = styled.img`
  position: absolute;
  bottom: 4px;
`
