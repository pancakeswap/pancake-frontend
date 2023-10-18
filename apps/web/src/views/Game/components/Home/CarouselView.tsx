import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { CarouselType } from 'views/Game/types'

const StyledCarouselContainer = styled(Box)`
  padding: 16px;
  width: calc(100% + 40px);
  margin-left: -20px;
  background: rgba(39, 38, 44, 0.8);

  ${({ theme }) => theme.mediaQueries.sm} {
    width: calc(100% + 64px);
    margin-left: -32px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 100%;
    margin: 0;
    border-radius: 16px;
  }
`

const StyledImage = styled(Box)<{ imgUrl: string; isHorizontal?: boolean }>`
  width: ${({ isHorizontal }) => (isHorizontal ? '100%' : '362px')};
  height: ${({ isHorizontal }) => (isHorizontal ? '197px' : '495px')};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin: auto;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};

  ${({ theme }) => theme.mediaQueries.sm} {
    height: ${({ isHorizontal }) => (isHorizontal ? '429px' : '641px')};
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    height: ${({ isHorizontal }) => (isHorizontal ? '429px' : '641px')};
  }
`

interface CarouselViewProps {
  isHorizontal: boolean
  carouselData: any
}

export const CarouselView: React.FC<React.PropsWithChildren<CarouselViewProps>> = ({ isHorizontal, carouselData }) => {
  return (
    <StyledCarouselContainer>
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
        <StyledImage imgUrl={carouselData.imageUrl} isHorizontal={isHorizontal} />
      )}
    </StyledCarouselContainer>
  )
}
