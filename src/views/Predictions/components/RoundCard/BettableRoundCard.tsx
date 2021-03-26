import React, { useState } from 'react'
import { CardBody, PlayCircleOutlineIcon, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { BetPosition, Round } from 'state/types'
import { useGetIntervalBlocks } from 'state/hooks'
import CardFlip from '../CardFlip'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import SetPositionCard from './SetPositionCard'
import CardHeader from './CardHeader'

interface BettableRoundCardProps {
  round: Round
}

const BettableRoundCard: React.FC<BettableRoundCardProps> = ({ round }) => {
  const [state, setState] = useState({
    isSettingPosition: false,
    defaultPosition: BetPosition.BULL,
  })
  const TranslateString = useI18n()
  const intervalBlocks = useGetIntervalBlocks()

  // Bettable rounds do not have an endblock set so we approximate it by adding the block interval
  // to the start block
  const endBlock = round.startBlock + intervalBlocks

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
    <CardFlip isFlipped={state.isSettingPosition} height="426px">
      <Card>
        <CardHeader
          status="next"
          epoch={round.epoch}
          blockNumber={endBlock}
          icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}
          title={TranslateString(999, 'Next')}
          timerPrefix={TranslateString(999, 'Start')}
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
      <SetPositionCard onBack={handleBack} defaultPosition={state.defaultPosition} />
    </CardFlip>
  )
}

export default BettableRoundCard
