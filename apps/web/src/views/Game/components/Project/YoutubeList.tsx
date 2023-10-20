import { styled } from 'styled-components'
import { useMemo, useState } from 'react'
import { Flex, Card, useModal } from '@pancakeswap/uikit'
import { Youtube } from 'views/Game/components/Project/Youtube'
import { YoutubeModal } from 'views/Game/components/Project/YoutubeModal'
import { youtubeList } from '../mockYoutubeList'

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
    margin: 0 24px 0 0;
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

      &:nth-child(n + 4) {
        margin-right: 0;
      }
    }
  }
`

export const YoutubeList = () => {
  const fakeDate: any = JSON.parse(JSON.stringify(youtubeList))
  const [pickedYoutubeId, setPickedYoutubeId] = useState('')

  const pickedYoutube = useMemo(() => fakeDate.find((i) => i.videoId === pickedYoutubeId), [fakeDate, pickedYoutubeId])
  const [onShowYoutubeModal] = useModal(<YoutubeModal youtube={pickedYoutube} />, true, true)

  const handleClickYoutubeVideo = (youtubeId: string) => {
    setPickedYoutubeId(youtubeId)
    onShowYoutubeModal()
  }

  return (
    <StyledContainer>
      {fakeDate.map((youtube) => (
        <StyledYoutubeContainer key={youtube.videoId}>
          <Youtube youtube={youtube} handleClickYoutubeVideo={handleClickYoutubeVideo} />
        </StyledYoutubeContainer>
      ))}
    </StyledContainer>
  )
}
