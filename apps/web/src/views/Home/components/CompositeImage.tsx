import styled, { keyframes } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import Image, { StaticImageData } from 'next/image'

const floatingAnim = (x: string, y: string) => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(${x}, ${y});
  }
  to {
    transform: translate(0, 0px);
  }
`

const Wrapper = styled(Box)<{ maxHeight: string }>`
  position: relative;
  flex-grow: 1;
  max-height: ${({ maxHeight }) => maxHeight};

  & :nth-child(4) {
    animation: ${floatingAnim('3px', '15px')} 3s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(1) {
    animation: ${floatingAnim('5px', '10px')} 3s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(2) {
    animation: ${floatingAnim('6px', '5px')} 3s ease-in-out infinite;
    animation-delay: 0.33s;
  }

  & :nth-child(5) {
    animation: ${floatingAnim('4px', '12px')} 3s ease-in-out infinite;
    animation-delay: 0s;
  }
`

const DummyImg = styled.img<{ maxHeight: string }>`
  max-height: ${({ maxHeight }) => maxHeight};
  visibility: hidden;
`

const ImageWrapper = styled(Box)`
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  /* img { */
  /*   max-height: 100%; */
  /*   width: auto; */
  /* } */
`

enum Resolution {
  MD = '1.5x',
  LG = '2x',
}
interface ImageAttributes {
  src: StaticImageData
  alt: string
}

export interface CompositeImageProps {
  attributes: ImageAttributes[]
}

interface ComponentProps extends CompositeImageProps {
  animate?: boolean
  maxHeight?: string
}

export const getImageUrl = (base: string, imageSrc: string, resolution?: Resolution, extension = '.png'): string =>
  `${base}${imageSrc}${resolution ? `@${resolution}${extension}` : extension}`

export const getSrcSet = (base: string, imageSrc: string, extension = '.png') => {
  return `${getImageUrl(base, imageSrc, undefined, extension)} 512w,
  ${getImageUrl(base, imageSrc, Resolution.MD, extension)} 768w,
  ${getImageUrl(base, imageSrc, Resolution.LG, extension)} 1024w,`
}

const CompositeImage: React.FC<React.PropsWithChildren<ComponentProps>> = ({ attributes, maxHeight = '512px' }) => {
  return (
    <Wrapper maxHeight={maxHeight}>
      {attributes.map((image) => (
        <Image src={image.src} alt={image.alt} loading="lazy" layout="fill" />
      ))}
    </Wrapper>
  )
}

export default CompositeImage
