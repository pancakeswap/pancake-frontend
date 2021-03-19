import React, { useState } from 'react'
import SwiperCore from 'swiper'
import { CardBody, PlayCircleOutlineIcon, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Position, Round } from 'state/types'
import CardFlip from '../CardFlip'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import SetPositionCard from './SetPositionCard'
import CardHeader from './CardHeader'

interface NextRoundCardProps {
  round: Round
  swiperInstance: SwiperCore
}

const NextRoundCard: React.FC<NextRoundCardProps> = ({ round, swiperInstance }) => {
  const [state, setState] = useState({
    isSettingPosition: false,
    defaultPosition: Position.UP,
  })
  const TranslateString = useI18n()

  const handleBack = () =>
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: false,
    }))

  const handleSetPosition = (defaultPosition) => {
    setState({
      isSettingPosition: true,
      defaultPosition,
    })
  }

  return (
    <CardFlip isFlipped={state.isSettingPosition} height="417px">
      <Card>
        <CardHeader
          status="next"
          epoch={round.epoch}
          blockNumber={round.endBlock}
          icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}
          title={TranslateString(999, 'Next')}
        />
        <CardBody p="16px">
          <MultiplierArrow />
          <RoundInfoBox>
            <Button variant="success" width="100%" onClick={() => handleSetPosition(Position.UP)} mb="4px">
              {TranslateString(999, 'Enter UP')}
            </Button>
            <Button variant="danger" width="100%" onClick={() => handleSetPosition(Position.DOWN)}>
              {TranslateString(999, 'Enter DOWN')}
            </Button>
          </RoundInfoBox>
          <MultiplierArrow roundPosition={Position.DOWN} />
        </CardBody>
      </Card>
      <SetPositionCard onBack={handleBack} defaultPosition={state.defaultPosition} swiperInstance={swiperInstance} />
    </CardFlip>
  )
}

export default NextRoundCard
