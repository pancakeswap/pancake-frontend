import { styled } from 'styled-components'
import { useMemo } from 'react'
import { Link, Box, CardHeader } from '@pancakeswap/uikit'
import { StyledTextLineClamp } from 'components/Game/StyledTextLineClamp'
import { PlaylistData } from '@pancakeswap/games'

const Header = styled(CardHeader)<{ imgUrl: string }>`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 146px;
  width: 100%;
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

const StyledContainer = styled(Link)`
  display: flex;
  flex-direction: column;

  &:hover {
    text-decoration: none;
  }
`

interface YoutubeProps {
  youtube: PlaylistData
}

export const Youtube: React.FC<React.PropsWithChildren<YoutubeProps>> = ({ youtube }) => {
  const youtubeImage = useMemo(
    () => `https://ytimg.googleusercontent.com/vi/${youtube.videoId}/sddefault.jpg`,
    [youtube],
  )

  return (
    <StyledContainer external href={`https://www.youtube.com/watch?v=${youtube.videoId}`}>
      <Header imgUrl={youtubeImage} />
      <Box padding="20px">
        <StyledTextLineClamp bold lineClamp={3}>
          {youtube.title}
        </StyledTextLineClamp>
      </Box>
    </StyledContainer>
  )
}
