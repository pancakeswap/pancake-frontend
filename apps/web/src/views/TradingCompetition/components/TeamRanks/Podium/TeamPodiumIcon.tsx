import { memo } from 'react'
import styled from 'styled-components'
import { Flex, Image, Skeleton } from '@pancakeswap/uikit'
import Sticker from '../../Sticker'

const Wrapper = styled(Flex)<{ imageSize?: number }>`
  align-items: center;
  justify-content: center;

  img {
    border-radius: 50%;
  }

  /* Podium is about 66% of initial size on xs devices  */
  width: ${({ imageSize }) => imageSize * 0.66 + 4}px;
  height: ${({ imageSize }) => imageSize * 0.66 + 4}px;

  /* Podium is about 80% of initial size on sm devices  */
  ${({ theme }) => theme.mediaQueries.xs} {
    width: ${({ imageSize }) => imageSize * 0.8 + 4}px;
    height: ${({ imageSize }) => imageSize * 0.8 + 4}px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: ${({ imageSize }) => imageSize + 4}px;
    height: ${({ imageSize }) => imageSize + 4}px;
  }
`

interface PodiumIconProps {
  teamId?: number
  teamPosition?: number
}

const TeamPodiumIcon: React.FC<React.PropsWithChildren<PodiumIconProps>> = ({ teamId, teamPosition }) => {
  const teamData = {
    1: { imgSrc: 'syrup-storm-lg.png', stickerCol: '#1FC7D4' },
    2: { imgSrc: 'fearsome-flippers-lg.png', stickerCol: '#452A7A' },
    3: { imgSrc: 'chaotic-cakers-lg.png', stickerCol: '#FFB237' },
  }
  const imageSize = teamPosition === 1 ? 128 : 113

  return (
    <Wrapper imageSize={imageSize}>
      {!teamId ? (
        <Skeleton variant="circle" width="100%" height="100%" />
      ) : (
        <Sticker backgroundColor={teamData[teamId].stickerCol} borderColor={teamData[teamId].stickerCol}>
          <Image src={`/images/teams/${teamData[teamId].imgSrc}`} width={imageSize} height={imageSize} />
        </Sticker>
      )}
    </Wrapper>
  )
}

export default memo(TeamPodiumIcon)
