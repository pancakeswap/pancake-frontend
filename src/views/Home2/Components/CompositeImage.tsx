import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Box } from '@pancakeswap/uikit'

const floatingAnim = (x: string, y: string) => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(${x}, ${y});
  }
  to {
    transform: translate(0, -0px);
  }  
`

const Wrapper = styled(Box)`
  position: relative;
  max-height: 500px;

  & :nth-child(2) {
    animation: ${floatingAnim('3px', '15px')} 3s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${floatingAnim('5px', '10px')} 3s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${floatingAnim('6px', '5px')} 3s ease-in-out infinite;
    animation-delay: 0.33s;
  }

  & :nth-child(5) {
    animation: ${floatingAnim('4px', '12px')} 3s ease-in-out infinite;
    animation-delay: 0s;
  }
`

const DummyImg = styled.img`
  visibility: hidden;
`

const ImageWrapper = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
`

const CompositeImage = ({ images }) => {
  return (
    <Wrapper position="relative" maxHeight="500px">
      <DummyImg src={images[0].src} />
      {images.map((image) => (
        <ImageWrapper>
          <img src={image.src} alt={image.alt} />
        </ImageWrapper>
      ))}
    </Wrapper>
  )
}

export default CompositeImage
