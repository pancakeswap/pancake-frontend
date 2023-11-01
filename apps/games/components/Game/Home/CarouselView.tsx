import { styled } from 'styled-components'
import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { PostersItemData, PostersItemDataType } from '@pancakeswap/games'
import { useIsIOS } from 'hooks/useIsIOS'

const StyledCarouselContainer = styled(Box)<{ isHorizontal: boolean }>`
  padding: 16px 16px 2px 16px;
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
    padding: 16px;
    border-radius: 16px;

    height: ${({ isHorizontal }) => (isHorizontal ? 'auto' : '100%')};
  }
`

const StyledImage = styled(Box)<{ imgUrl: string; isHorizontal: boolean }>`
  max-width: ${({ isHorizontal }) => (isHorizontal ? '100%' : '362px')};
  height: ${({ isHorizontal }) => (isHorizontal ? '197px' : '495px')};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin: auto;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};

  ${({ theme }) => theme.mediaQueries.sm} {
    height: ${({ isHorizontal }) => (isHorizontal ? '362px' : '641px')};
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    height: ${({ isHorizontal }) => (isHorizontal ? '362px' : '641px')};
  }
`

interface CarouselViewProps {
  isHorizontal: boolean
  carouselData: PostersItemData
}

export const CarouselView: React.FC<React.PropsWithChildren<CarouselViewProps>> = ({ isHorizontal, carouselData }) => {
  const { isIOS } = useIsIOS()
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledCarouselContainer isHorizontal={isHorizontal}>
      {(!isIOS || !isMobile) && carouselData.type === PostersItemDataType.Video ? (
        <video
          muted
          autoPlay
          controls
          width="100%"
          height="100%"
          disablePictureInPicture
          src={carouselData.video}
          poster={carouselData.image}
          controlsList="nodownload noplaybackrate noremoteplayback"
        />
      ) : (
        <StyledImage imgUrl={carouselData.image} isHorizontal={isHorizontal} />
      )}
    </StyledCarouselContainer>
  )
}
