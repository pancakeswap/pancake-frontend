import { styled } from 'styled-components'
import { useMemo, useState } from 'react'
import { Flex, Card, useModal } from '@pancakeswap/uikit'
import { Youtube } from 'views/Game/components/Project/Youtube'
import { YoutubeModal } from 'views/Game/components/Project/YoutubeModal'
import { youtubeList } from '../mockYoutubeList'

const StyledYoutubeContainer = styled(Card)`
  width: 25%;
  cursor: pointer;
  margin-right: 24px;
`

const StyledContainer = styled(Flex)`
  margin: auto;
  padding: 30px 0;
  max-width: 1192px;

  ${StyledYoutubeContainer} {
    &:last-child {
      margin-right: 0;
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
