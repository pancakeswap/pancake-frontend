import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { floatingStarsLeft, floatingStarsRight } from 'components/Game/DecorationsAnimation'
import { ASSET_CDN } from 'config/constants/endpoints'

const StyledDecorations = styled(Box)`
  display: none;
  position: absolute;
  top: 0;
  left: 0%;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  > img {
    position: absolute;
  }

  & :nth-child(1) {
    top: -5%;
    right: 2%;
    animation: ${floatingStarsLeft} 2.5s ease-in-out infinite;
  }

  & :nth-child(2) {
    top: 15%;
    left: 0%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(3) {
    top: 60%;
    right: -1%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    display: block;
  }
}`

export const Decorations = () => {
  return (
    <StyledDecorations>
      <img src={`${ASSET_CDN}/web/game/developers/piezas-2.png`} width="100px" height="113px" alt="piezas2" />
      <img src={`${ASSET_CDN}/web/game/developers/piezas-3.png`} width="159px" height="199px" alt="piezas3" />
      <img src={`${ASSET_CDN}/web/game/developers/piezas-4.png`} width="74px" height="73px" alt="piezas4" />
    </StyledDecorations>
  )
}
