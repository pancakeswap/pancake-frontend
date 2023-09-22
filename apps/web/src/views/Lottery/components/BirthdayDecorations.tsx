import { styled, keyframes } from 'styled-components'
import { Box } from '@pancakeswap/uikit'

const floatingStarsLeft = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(10px, 10px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const floatingStarsRight = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-10px, 10px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const BirthdayDecorationsContainer = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;

  & img {
    position: absolute;
  }

  & :nth-child(3),
  & :nth-child(4),
  & :nth-child(6) {
    display: none;
  }

  & :nth-child(1) {
    width: 200px;
    height: 256px;
    left: 20%;
    bottom: 17%;
    animation: initial;
  }

  & :nth-child(2) {
    width: 172px;
    height: 173px;
    left: 45%;
    bottom: 21%;
    animation: initial;
  }

  & :nth-child(3) {
    left: 12%;
    top: 67%;
    animation: ${floatingStarsRight} 6s ease-in-out infinite;
    animation-delay: 0.2s;
  }

  & :nth-child(4) {
    right: 12%;
    top: 67%;
    animation: ${floatingStarsRight} 4s ease-in-out infinite;
  }

  & :nth-child(5) {
    top: 8%;
    left: 5%;
    animation: ${floatingStarsRight} 5s ease-in-out infinite;
  }

  & :nth-child(6) {
    top: 15%;
    left: 25%;
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;
  }

  & :nth-child(7) {
    right: 28%;
    bottom: 5%;
    animation: ${floatingStarsRight} 6s ease-in-out infinite;
  }

  & :nth-child(8) {
    left: 0%;
    top: 30%;
    animation: ${floatingStarsLeft} 6s ease-in-out infinite;
  }

  & :nth-child(9) {
    top: 40%;
    right: 5%;
    animation: ${floatingStarsRight} 6s ease-in-out infinite;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & :nth-child(1) {
      left: 30%;
      bottom: 23%;
    }

    & :nth-child(2) {
      bottom: 24%;
      left: 50%;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & :nth-child(1) {
      left: 35%;
      bottom: 23%;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    & :nth-child(3),
    & :nth-child(4),
    & :nth-child(6),
    & :nth-child(7) {
      display: block;
    }

    & :nth-child(8),
    & :nth-child(9) {
      display: none;
    }

    & :nth-child(1) {
      width: 285px;
      height: 375px;
      top: 20%;
      left: auto;
      bottom: auto;
      right: 12%;
      animation: ${floatingStarsRight} 8s ease-in-out infinite;
    }

    & :nth-child(2) {
      width: 192px;
      height: 193px;
      bottom: 15%;
      left: 16%;
      animation: ${floatingStarsLeft} 8s ease-in-out infinite;
    }
  }
`

export const BirthdayDecorations = () => {
  return (
    <BirthdayDecorationsContainer>
      <img src="/images/lottery/birthday/banner-bunny-1.png" width="285px" height="375px" alt="banner-bunny" />
      <img src="/images/lottery/birthday/third-cake.png" width="192px" height="193px" alt="third-cake" />
      <img src="/images/lottery/ticket-l.png" width="123px" height="83px" alt="ticket-left" />
      <img src="/images/lottery/ticket-r.png" width="121px" height="72px" alt="ticket-right" />
      <img src="/images/lottery/birthday/left-star-1.png" width="49px" height="44px" alt="left-star-1" />
      <img src="/images/lottery/birthday/left-2.png" width="191px" height="268px" alt="left-2" />
      <img src="/images/lottery/birthday/right-star-1.png" width="43px" height="38px" alt="right-star-1" />
      <img src="/images/lottery/birthday/mobile-1.png" width="69px" height="67px" alt="mobile-1" />
      <img src="/images/lottery/birthday/mobile-2.png" width="110px" height="103px" alt="mobile-2" />
    </BirthdayDecorationsContainer>
  )
}
