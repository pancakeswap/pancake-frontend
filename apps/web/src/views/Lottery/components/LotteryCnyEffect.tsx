import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'

const CnyDecorations = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  top: 0;
  left: 0;

  > img {
    display: none;
    position: absolute;
  }

  & :nth-child(1) {
    top: 0;
    left: 0;
  }

  & :nth-child(2) {
    top: 0;
    right: 0;
  }

  & :nth-child(3) {
    left: 0;
    bottom: 0;
  }

  & :nth-child(4) {
    right: 0;
    bottom: 0;
  }

  & :nth-child(5) {
    top: 15%;
    left: 20%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(6) {
    top: 30%;
    left: -2%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(7) {
    left: 18%;
    bottom: 15%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(8) {
    top: 15%;
    right: 8%;
    animation: ${floatingStarsLeft} 2.5s ease-in-out infinite;
  }

  & :nth-child(9) {
    top: 45%;
    right: 20%;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;
  }

  & :nth-child(10) {
    right: 15%;
    bottom: 15%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > img {
      display: block;
    }
  }
`

const LotteryCnyEffect = () => {
  return (
    <CnyDecorations>
      <img src="/images/cny-asset/c-1.png" width="500px" height="130px" alt="" />
      <img src="/images/cny-asset/c-2.png" width="500px" height="130px" alt="" />
      <img src="/images/cny-asset/c-3.png" width="500px" height="130px" alt="" />
      <img src="/images/cny-asset/c-4.png" width="500px" height="130px" alt="" />

      <img src="/images/cny-asset/l-1.png" width="75px" height="75px" alt="" />
      <img src="/images/cny-asset/l-2.png" width="116px" height="116px" alt="" />
      <img src="/images/cny-asset/l-3.png" width="122px" height="131px" alt="" />
      <img src="/images/cny-asset/l-4.png" width="141px" height="135px" alt="" />
      <img src="/images/cny-asset/l-5.png" width="57px" height="57px" alt="" />
      <img src="/images/cny-asset/l-6.png" width="57px" height="157px" alt="" />
    </CnyDecorations>
  )
}

export default LotteryCnyEffect
