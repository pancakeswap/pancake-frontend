import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { CardBody, PlayCircleOutlineIcon, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useAppDispatch } from 'state'
import { BetPosition, Round } from 'state/types'
import { useGetTotalIntervalBlocks } from 'state/hooks'
import { markPositionAsEntered } from 'state/predictions'
import useToast from 'hooks/useToast'
import CardFlip from '../CardFlip'
import { getBnbAmount } from '../../helpers'
import { RoundResultBox, PrizePoolRow } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'
import SetPositionCard from './SetPositionCard'

interface OpenRoundCardProps {
  round: Round
  betAmount?: number
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: number
  bearMultiplier: number
}

interface State {
  isSettingPosition: boolean
  position: BetPosition
}

const OpenRoundCard: React.FC<OpenRoundCardProps> = ({
  round,
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const canEnterPosition = round.lockPrice === null && !hasEnteredUp && !hasEnteredDown
  const [state, setState] = useState<State>({
    isSettingPosition: false,
    position: BetPosition.BULL,
  })
  const TranslateString = useI18n()
  const interval = useGetTotalIntervalBlocks()
  const { toastSuccess } = useToast()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isSettingPosition, position } = state

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

  const handleSuccess = async (decimalValue: BigNumber, hash: string) => {
    const positionDisplay = position === BetPosition.BULL ? 'UP' : 'DOWN'

    // Optimistically set the user bet so we see the entered position immediately.
    dispatch(
      markPositionAsEntered({
        account,
        roundId: round.id,
        partialBet: {
          hash,
          position,
          amount: getBnbAmount(decimalValue).toNumber(),
        },
      }),
    )

    handleBack()

    toastSuccess(
      'Success!',
      TranslateString(999, `${positionDisplay} position entered`, {
        position: positionDisplay,
      }),
    )
  }

  return (
    <CardFlip isFlipped={isSettingPosition} height="404px">
      <Card>
        <CardHeader
          status="next"
          epoch={round.epoch}
          blockNumber={endBlock}
          icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}
          title={TranslateString(999, 'Next')}
        />
        <CardBody p="16px">
          <MultiplierArrow amount={betAmount} multiplier={bullMultiplier} hasEntered={hasEnteredUp} />
          <RoundResultBox isNext={canEnterPosition} isLive={!canEnterPosition}>
            {canEnterPosition ? (
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
          </RoundResultBox>
          <MultiplierArrow
            amount={betAmount}
            multiplier={bearMultiplier}
            betPosition={BetPosition.BEAR}
            hasEntered={hasEnteredDown}
          />
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
