import { styled } from 'styled-components'
import { Modal } from '@pancakeswap/uikit'
import YouTube from 'react-youtube'

const StyledModal = styled(Modal)`
  width: 100%;

  iframe {
    width: 100% !important;
    height: 220px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    iframe {
      height: 300px;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 800px;
    iframe {
      height: 400px;
    }
  }
`

interface YoutubeModalProps {
  youtube: any
  onDismiss?: () => void
}

export const YoutubeModal: React.FC<React.PropsWithChildren<YoutubeModalProps>> = ({ youtube, onDismiss }) => {
  if (!youtube) {
    return null
  }

  return (
    <StyledModal title={youtube.title} onDismiss={onDismiss}>
      <YouTube
        videoId={youtube.videoId}
        opts={{
          playerVars: {
            controls: 1,
            autoplay: 1,
          },
        }}
      />
    </StyledModal>
  )
}
