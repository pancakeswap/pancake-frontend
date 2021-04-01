import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { CardBody, PlayCircleOutlineIcon, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { BetPosition, Round } from 'state/types'
import { useGetTotalIntervalBlocks, useToast } from 'state/hooks'
import { updateRound } from 'state/predictions'
import CardFlip from '../CardFlip'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import CardHeader from './CardHeader'
import SetPositionCard from './SetPositionCard'
import PrizePoolRow from './PrizePoolRow'

interface OpenRoundCardProps {
  round: Round
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: number
  bearMultiplier: number
}

interface State {
  isSettingPosition: boolean
  position: BetPosition
  hasEnteredPosition: boolean
}

const OpenRoundCard: React.FC<OpenRoundCardProps> = ({
  round,
  hasEnteredUp,
  hasEnteredDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const canEnterPosition = round.lockPrice === null && !hasEnteredUp && !hasEnteredDown
  const [state, setState] = useState<State>({
    isSettingPosition: false,
    position: BetPosition.BULL,

    // We keep this flag in state because it is possible despite polling for new round data
    // after a user enters a position it returns without the position data. So we want
    // to be able to update it immediately
    hasEnteredPosition: false,
  })
  const TranslateString = useI18n()
  const interval = useGetTotalIntervalBlocks()
  const dispatch = useDispatch()
  const { toastSuccess } = useToast()
  const { isSettingPosition, position, hasEnteredPosition } = state

  // Bettable rounds do not have an endblock set so we approximate it by adding the block interval
  // to the start block
  const endBlock = round.startBlock + interval

  const handleBack = () =>
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: false,
    }))

  const handleSetPosition = (newPosition: BetPosition) => {
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: true,
      position: newPosition,
    }))
  }

  const togglePosition = () => {
    setState((prevState) => ({
      ...prevState,
      position: prevState.position === BetPosition.BULL ? BetPosition.BEAR : BetPosition.BULL,
    }))
  }

  const handleSuccess = async () => {
    const positionDisplay = position === BetPosition.BULL ? 'UP' : 'DOWN'

    setState((prevState) => ({
      ...prevState,
      hasEnteredPosition: false,
    }))

    await dispatch(updateRound({ id: round.id }))
    handleBack()

    toastSuccess(
      'Success!',
      TranslateString(999, `${positionDisplay} position entered`, {
        position: positionDisplay,
      }),
    )
  }

  return (
    <CardFlip isFlipped={isSettingPosition} height="426px">
      <Card>
        <CardHeader
          status="next"
          epoch={round.epoch}
          blockNumber={endBlock}
          icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}
          title={TranslateString(999, 'Next')}
        />
        <CardBody p="16px">
          <MultiplierArrow multiplier={bullMultiplier} hasEntered={hasEnteredUp} />
          <RoundInfoBox isNext={canEnterPosition} isLive={!canEnterPosition}>
            {canEnterPosition && !hasEnteredPosition ? (
              <>
                <PrizePoolRow totalAmount={round.totalAmount} mb="8px" />
                <Button
                  variant="success"
                  width="100%"
                  onClick={() => handleSetPosition(BetPosition.BULL)}
                  mb="4px"
                  disabled={!canEnterPosition}
                >
                  {TranslateString(999, 'Enter UP')}
                </Button>
                <Button
                  variant="danger"
                  width="100%"
                  onClick={() => handleSetPosition(BetPosition.BEAR)}
                  disabled={!canEnterPosition}
                >
                  {TranslateString(999, 'Enter DOWN')}
                </Button>
              </>
            ) : (
              <>
                <Button disabled startIcon={<PlayCircleOutlineIcon color="currentColor" />} width="100%" mb="8px">
                  {TranslateString(999, 'Position Entered')}
                </Button>
                <PrizePoolRow totalAmount={round.totalAmount} />
              </>
            )}
          </RoundInfoBox>
          <MultiplierArrow multiplier={bearMultiplier} betPosition={BetPosition.BEAR} hasEntered={hasEnteredDown} />
        </CardBody>
      </Card>
      <SetPositionCard
        onBack={handleBack}
        onSuccess={handleSuccess}
        position={position}
        togglePosition={togglePosition}
      />
    </CardFlip>
  )
}

export default OpenRoundCard
