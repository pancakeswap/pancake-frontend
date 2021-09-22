import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledArtistSectionContainer = styled(Flex)`
  position: relative;
  background: linear-gradient(90deg, #faf9fa 0%, #d7caec 100%);
`

export const StyledArtistBioContainer = styled(Flex)`
  position: relative;
  padding: 48px 36px;
  border-radius: 56px;
  background: ${({ theme }) => theme.colors.invertedContrast};
  box-shadow: ${({ theme }) => theme.shadows.level1};

  & > svg {
    position: absolute;
    width: 20px;
    height: 85px;
    left: calc(50% - 10px);
    top: -51px;
    transform: rotate(90deg);

    ${({ theme }) => theme.mediaQueries.md} {
      left: -19px;
      top: calc(50% - 42px);
      transform: none;
    }
  }
`
