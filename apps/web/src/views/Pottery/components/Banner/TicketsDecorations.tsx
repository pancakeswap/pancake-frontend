import styled, { keyframes } from 'styled-components'
import { Box } from '@pancakeswap/uikit'

const floatingTicketTop = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(10px, -10px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const floatingTicketRight = keyframes`
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
const floatingTicketLeft = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-10px, 15px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const Container = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;

  & img {
    position: absolute;
  }

  & :nth-child(1) {
    top: -64px;
    left: 20%;
    width: 73px;
    height: 31px;
    animation: ${floatingTicketTop} 3s ease-in-out infinite;
    animation-delay: 0.75s;
  }
  & :nth-child(2) {
    top: 6%;
    left: -3%;
    width: 75px;
    height: 59px;
    animation: ${floatingTicketTop} 3s ease-in-out infinite;
    animation-delay: 0.25s;
  }
  & :nth-child(3) {
    top: 47%;
    left: -8%;
    width: 110px;
    height: 50px;
    animation: ${floatingTicketRight} 3s ease-in-out infinite;
    animation-delay: 0.75s;
  }
  & :nth-child(4) {
    bottom: 17%;
    left: -99px;
    width: 205px;
    height: 147px;
    animation: ${floatingTicketLeft} 3s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  & :nth-child(5) {
    top: -39px;
    right: -6%;
    width: 105px;
    height: 30px;
    animation: ${floatingTicketLeft} 3s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  & :nth-child(6) {
    top: 40%;
    right: -5%;
    width: 110px;
    height: 62px;
    animation: ${floatingTicketRight} 3s ease-in-out infinite;
    animation-delay: 0.25s;
  }
  & :nth-child(7) {
    bottom: 10%;
    right: -2%;
    width: 110px;
    height: 124px;
    animation: ${floatingTicketTop} 3s ease-in-out infinite;
    animation-delay: 0.75s;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & :nth-child(1) {
      top: -87px;
      left: 20%;
      width: 92px;
      height: 48px;
    }
    & :nth-child(2) {
      top: 56px;
      left: -1%;
      width: 135px;
      height: 85px;
    }
    & :nth-child(3) {
      top: 26%;
      left: 3%;
      width: 232px;
      height: 106px;
    }
    & :nth-child(4) {
      bottom: 17%;
      left: 16px;
      width: 248px;
      height: 178px;
    }
    & :nth-child(5) {
      top: -52px;
      right: 4%;
      width: 151px;
      height: 43px;
    }
    & :nth-child(6) {
      top: 26%;
      right: 3%;
      width: 160px;
      height: 89px;
    }
    & :nth-child(7) {
      bottom: 17%;
      right: -1%;
      width: 156px;
      height: 205px;
    }
  }
`

const TicketsDecorations: React.FC<React.PropsWithChildren> = () => {
  return (
    <Container>
      <img src="/images/pottery/banner-ticket/left1.png" alt="" />
      <img src="/images/pottery/banner-ticket/left2.png" alt="" />
      <img src="/images/pottery/banner-ticket/left3.png" alt="" />
      <img src="/images/pottery/banner-ticket/left4.png" alt="" />
      <img src="/images/pottery/banner-ticket/right1.png" alt="" />
      <img src="/images/pottery/banner-ticket/right2.png" alt="" />
      <img src="/images/pottery/banner-ticket/right3.png" alt="" />
    </Container>
  )
}

export default TicketsDecorations
