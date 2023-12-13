import { styled } from 'styled-components'
import { Flex, Card } from '@pancakeswap/uikit'
import { Youtube } from 'components/Game/Project/Youtube'
import { PlaylistData } from '@pancakeswap/games'

const StyledYoutubeContainer = styled(Card)`
  width: 100%;
  cursor: pointer;
  margin: 0 0 24px 0;

  ${({ theme }) => theme.mediaQueries.md} {
    width: calc(50% - 12px);
    margin: 0 24px 24px 0;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: calc(25% - 36px);
  }
`

const StyledContainer = styled(Flex)`
  margin: auto;
  padding: 30px 0;
  max-width: 286px;
  flex-direction: column;

  ${StyledYoutubeContainer} {
    &:last-child {
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 580px;
    flex-direction: row;
    flex-wrap: wrap;

    ${StyledYoutubeContainer} {
      &:nth-child(even) {
        margin-right: 0;
      }
    }
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    max-width: 1192px;

    ${StyledYoutubeContainer} {
      &:nth-child(even) {
        margin-right: 24px;
      }

      &:nth-child(4n + 0) {
        margin-right: 0;
      }
    }
  }
`

interface YoutubeListProps {
  playlist: PlaylistData[]
}

export const YoutubeList: React.FC<React.PropsWithChildren<YoutubeListProps>> = ({ playlist }) => {
  return (
    <StyledContainer>
      {playlist.map((youtube) => (
        <StyledYoutubeContainer key={youtube.videoId}>
          <Youtube youtube={youtube} />
        </StyledYoutubeContainer>
      ))}
    </StyledContainer>
  )
}
