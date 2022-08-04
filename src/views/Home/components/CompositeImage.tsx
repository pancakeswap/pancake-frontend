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
    transform: translate(0, 0px);
  }
`

const Wrapper = styled(Box)<{ maxHeight: string }>`
  position: relative;
  max-height: ${({ maxHeight }) => maxHeight};

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

const DummyImg = styled.img<{ maxHeight: string }>`
  max-height: ${({ maxHeight }) => maxHeight};
  visibility: hidden;
`

const ImageWrapper = styled(Box)`
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  img {
    max-height: 100%;
    width: auto;
  }
`

enum Resolution {
  MD = '1.5x',
  LG = '2x',
}
interface ImageAttributes {
  src: string
  alt: string
}

export interface CompositeImageProps {
  path: string
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

const CompositeImage: React.FC<ComponentProps> = ({ path, attributes, maxHeight = '512px' }) => {
  return (
    <Wrapper maxHeight={maxHeight}>
      <DummyImg
        srcSet={getSrcSet(path, attributes[0].src, '.webp')}
        maxHeight={maxHeight}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          const fallbackSrcSet = getSrcSet(path, attributes[0].src)
          if (e.currentTarget.srcset !== '' && e.currentTarget.srcset !== fallbackSrcSet) {
            // eslint-disable-next-line no-param-reassign
            e.currentTarget.srcset = fallbackSrcSet
          } else {
            const fallbackSrc = getImageUrl(path, attributes[0].src)
            if (e.currentTarget.srcset !== '' && !e.currentTarget.src.endsWith(fallbackSrc)) {
              // eslint-disable-next-line no-param-reassign
              e.currentTarget.srcset = ''
              // eslint-disable-next-line no-param-reassign
              e.currentTarget.src = fallbackSrc
            }
          }
        }}
      />
      {attributes.map((image) => (
        <ImageWrapper key={image.src}>
          <img
            srcSet={getSrcSet(path, image.src, '.webp')}
            alt={image.alt}
            onError={(e) => {
              const fallbackSrcSet = getSrcSet(path, image.src)
              if (e.currentTarget.srcset !== '' && e.currentTarget.srcset !== fallbackSrcSet) {
                // eslint-disable-next-line no-param-reassign
                e.currentTarget.srcset = fallbackSrcSet
              } else {
                const fallbackSrc = getImageUrl(path, image.src)
                if (e.currentTarget.srcset !== '' && !e.currentTarget.src.endsWith(fallbackSrc)) {
                  // eslint-disable-next-line no-param-reassign
                  e.currentTarget.srcset = ''
                  // eslint-disable-next-line no-param-reassign
                  e.currentTarget.src = fallbackSrc
                }
              }
            }}
          />
        </ImageWrapper>
      ))}
    </Wrapper>
  )
}

export default CompositeImage
