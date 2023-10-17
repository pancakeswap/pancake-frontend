import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { CarouselType } from 'views/Game/types'

const StyledCarouselContainer = styled(Box)<{ isHorizontal?: boolean }>`
  padding: 16px;
  border-radius: 16px;
  background: rgba(39, 38, 44, 0.8);
  height: ${({ isHorizontal }) => (isHorizontal ? '429px' : '100%')};
`

const StyledImage = styled(Box)<{ imgUrl: string }>`
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

interface CarouselViewProps {
  isHorizontal: boolean
  carouselData: any
}

export const CarouselView: React.FC<React.PropsWithChildren<CarouselViewProps>> = ({ isHorizontal, carouselData }) => {
  return (
    <StyledCarouselContainer isHorizontal={isHorizontal}>
      {carouselData.type === CarouselType.VIDEO ? (
        <video
          muted
          autoPlay
          controls
          width="100%"
          height="100%"
          disablePictureInPicture
          src={carouselData.videoUrl}
          controlsList="nodownload noplaybackrate noremoteplayback"
        />
      ) : (
        <StyledImage imgUrl={carouselData.imageUrl} />
      )}
    </StyledCarouselContainer>
  )
}
