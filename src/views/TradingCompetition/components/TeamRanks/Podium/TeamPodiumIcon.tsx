import React from 'react'
import styled from 'styled-components'
import { Flex, Image } from '@pancakeswap-libs/uikit'
import Sticker from '../../Sticker'

const Wrapper = styled(Flex)`
  width: 136px;
  height: 136px;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 50%;
  }
`

const TeamPodiumIcon: React.FC<{ teamId?: number }> = ({ teamId }) => {
  const teamData = {
    1: { imgSrc: 'syrup-storm-lg.png', stickerCol: '#1FC7D4' },
    2: { imgSrc: 'fearsome-flippers-lg.png', stickerCol: '##452A7A' },
    3: { imgSrc: 'chaotic-cakers-lg.png', stickerCol: '#FFB237' },
  }

  return (
    <Wrapper>
      <Sticker backgroundColor={teamData[teamId].stickerCol} borderColor={teamData[teamId].stickerCol}>
        <Image src={`/images/teams/${teamData[teamId].imgSrc}`} width={132} height={132} />
      </Sticker>
    </Wrapper>
  )
}

export default TeamPodiumIcon
