import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'

const StyledDecorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 60%;
  pointer-events: none;
  overflow: hidden;
  transform: translateX(-50%);
  z-index: 1;
  > img {
    position: absolute;
  }

  & :nth-child(1) {
    top: 40%;
    left: 0%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(2) {
    top: 40%;
    left: 2%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(3) {
    right: 0%;
    top: 40%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(4) {
    right: -1%;
    top: 28%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(5) {
    right: 8%;
    bottom: 0%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }
}`

export const Decorations = () => {
  return (
    <StyledDecorations>
      <img src="/images/game/developers/left-1.png" width="79px" height="207px" alt="left1" />
      <img src="/images/game/developers/star.png" width="49px" height="43px" alt="star" />
      <img src="/images/game/developers/right-1.png" width="80px" height="150px" alt="right1" />
      <img src="/images/game/developers/right-2.png" width="109px" height="123px" alt="right2" />
      <img src="/images/game/developers/star.png" width="67px" height="59px" alt="star2" />
    </StyledDecorations>
  )
}
