import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { floatingStarsLeft, floatingStarsRight } from 'components/Game/DecorationsAnimation'

const StyledDecorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  transform: translateX(-50%);
  z-index: 2;
  > img {
    position: absolute;
  }

  & :nth-child(1) {
    top: 40%;
    left: 0%;
    width: 63px;
    height: 163px;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(2) {
    top: 35%;
    left: 2%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(3) {
    right: 0%;
    top: 82%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(4) {
    top: 76%;
    right: 1%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(5) {
    display: none;
    right: 5%;
    bottom: 35%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    z-index: 1;

    & :nth-child(1) {
      top: 30%;
      left: 0%;
      width: 79px;
      height: 207px;
    }
  
    & :nth-child(2) {
      top: 30%;
      left: 2%;
    }

    & :nth-child(3) {
      top: 40%;
      right: -2%;
      width: 101px;
      height: 105px;
    }
  
    & :nth-child(4) {
      top: 32%;
      right: -1%;
      width: 109px;
      height: 90px;
    }
  
    & :nth-child(5) {
      display: block;
    }
  }
}`

export const Decorations = () => {
  return (
    <StyledDecorations>
      <img src="/images/game/developers/left-1.png" width="79px" height="207px" alt="left1" />
      <img src="/images/game/developers/star.png" width="49px" height="43px" alt="star" />
      <img src="/images/game/developers/right-1-1.png" width="81px" height="85px" alt="right1" />
      <img src="/images/game/developers/right-2-1.png" width="89px" height="70px" alt="right2" />
      <img src="/images/game/developers/star.png" width="67px" height="59px" alt="star2" />
    </StyledDecorations>
  )
}
