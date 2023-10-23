import { styled } from 'styled-components'
import { useMemo } from 'react'
import { Box, CardHeader } from '@pancakeswap/uikit'
import { StyledTextLineClamp } from 'views/Game/components/StyledTextLineClamp'
import { PlayListData } from '@pancakeswap/games'

const Header = styled(CardHeader)<{ imgUrl: string }>`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 146px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  background-image: ${({ imgUrl }) => `url('${imgUrl}')`};

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    z-index: 1;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('/images/game/home/carousel/play-icon-1.png');
    transform: translate(-50%, -50%);
  }
`

interface YoutubeProps {
  youtube: PlayListData
  handleClickYoutubeVideo: (videoId: string) => void
}

export const Youtube: React.FC<React.PropsWithChildren<YoutubeProps>> = ({ youtube, handleClickYoutubeVideo }) => {
  const youtubeImage = useMemo(
    () => `https://ytimg.googleusercontent.com/vi/${youtube.videoId}/sddefault.jpg`,
    [youtube],
  )

  return (
    <Box onClick={() => handleClickYoutubeVideo(youtube.videoId)}>
      <Header imgUrl={youtubeImage} />
      <Box padding="20px">
        <StyledTextLineClamp bold lineClamp={3}>
          {youtube.title}
        </StyledTextLineClamp>
      </Box>
    </Box>
  )
}
