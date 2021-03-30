import React, { useState } from 'react'
import { CardBody, PlayCircleOutlineIcon, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { BetPosition, Round } from 'state/types'
import { useGetTotalIntervalBlocks } from 'state/hooks'
import CardFlip from '../CardFlip'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import CardHeader from './CardHeader'
import SetPositionCard from './SetPositionCard'

interface OpenRoundCardProps {
  round: Round
}

const OpenRoundCard: React.FC<OpenRoundCardProps> = ({ round }) => {
  const [state, setState] = useState({
    isSettingPosition: false,
    position: BetPosition.BULL,
  })
  const TranslateString = useI18n()
  const interval = useGetTotalIntervalBlocks()

  // Bettable rounds do not have an endblock set so we approximate it by adding the block interval
  // to the start block
  const endBlock = round.startBlock + interval

  const handleBack = () =>
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: false,
    }))

  const handleSetPosition = (newPosition: BetPosition) => {
    setState({
      isSettingPosition: true,
      position: newPosition,
    })
  }

  const togglePosition = () => {
    setState((prevState) => ({
      ...prevState,
      position: prevState.position === BetPosition.BULL ? BetPosition.BEAR : BetPosition.BULL,
    }))
  }

  return (
    <CardFlip isFlipped={state.isSettingPosition} height="426px">
      <Card>
        <CardHeader
          status="next"
          epoch={round.epoch}
          blockNumber={endBlock}
          icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}
          title={TranslateString(999, 'Next')}
        />
        <CardBody p="16px">
          <MultiplierArrow />
          <RoundInfoBox isNext>
            <Button variant="success" width="100%" onClick={() => handleSetPosition(BetPosition.BULL)} mb="4px">
              {TranslateString(999, 'Enter UP')}
            </Button>
            <Button variant="danger" width="100%" onClick={() => handleSetPosition(BetPosition.BEAR)}>
              {TranslateString(999, 'Enter DOWN')}
            </Button>
          </RoundInfoBox>
          <MultiplierArrow betPosition={BetPosition.BEAR} />
        </CardBody>
      </Card>
      <SetPositionCard onBack={handleBack} position={state.position} togglePosition={togglePosition} />
    </CardFlip>
  )
}

export default OpenRoundCard
