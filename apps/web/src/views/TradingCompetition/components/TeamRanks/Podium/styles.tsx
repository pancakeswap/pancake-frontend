import styled from 'styled-components'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import { TeamLeaderboardProps } from '../../../types'

export interface PodiumProps {
  teamsSortedByVolume?: Array<TeamLeaderboardProps>
}

export const Wrapper = styled(Flex)`
  width: 260px;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 320px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 387px;
  }
`

export const Inner = styled(Flex)`
  width: 100%;
  flex-direction: column;

  svg {
    height: auto;
    width: 100%;
  }
`

export const LeftBox = styled(Box)`
  position: absolute;
  bottom: -24px;
  left: 6px;

  ${({ theme }) => theme.mediaQueries.xs} {
    bottom: -26px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: -32px;
  }
`

export const MiddleBox = styled(Box)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translate(-50%, 0);
`

export const RightBox = styled(Box)`
  position: absolute;
  bottom: -34px;
  right: 6px;

  ${({ theme }) => theme.mediaQueries.xs} {
    bottom: -40px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: -52px;
  }
`

export const StyledVolumeFlex = styled(Flex)`
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const StyledVolumeText = styled(Text)`
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 14px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }
`
