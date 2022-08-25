import { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import {
  Card,
  CardBody,
  PlayCircleOutlineIcon,
  Button,
  useTooltip,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@pancakeswap/uikit'
import { getNow } from 'utils/getNow'
import { useTranslation } from '@pancakeswap/localization'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { BetPosition, NodeLedger, NodeRound } from 'state/types'
import { fetchLedgerData } from 'state/predictions'
import { ROUND_BUFFER } from 'state/predictions/config'
import useToast from 'hooks/useToast'
import useTheme from 'hooks/useTheme'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import CardFlip from '../CardFlip'
import { formatBnbv2 } from '../../helpers'
import { RoundResultBox, PrizePoolRow } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader, { getBorderBackground } from './CardHeader'
import SetPositionCard from './SetPositionCard'

interface OpenRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: string
  bearMultiplier: string
}

interface State {
  isSettingPosition: boolean
  position: BetPosition
}

const OpenRoundCard: React.FC<React.PropsWithChildren<OpenRoundCardProps>> = ({
  round,
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const [state, setState] = useState<State>({
    isSettingPosition: false,
    position: BetPosition.BULL,
  })
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess } = useToast()
  const { account } = useWeb3React()
  const dispatch = useLocalDispatch()
  const { token, displayedDecimals } = useConfig()
  const { lockTimestamp } = round ?? { lockTimestamp: null }
  const { isSettingPosition, position } = state
  const [isBufferPhase, setIsBufferPhase] = useState(false)
  const positionDisplay = useMemo(
    () => (position === BetPosition.BULL ? t('Up').toUpperCase() : t('Down').toUpperCase()),
    [t, position],
  )
  const positionEnteredText = useMemo(
    () => (hasEnteredUp ? t('Up').toUpperCase() : hasEnteredDown ? t('Down').toUpperCase() : null),
    [t, hasEnteredUp, hasEnteredDown],
  )
  const positionEnteredIcon = useMemo(
    () =>
      hasEnteredUp ? (
        <ArrowUpIcon color="currentColor" />
      ) : hasEnteredDown ? (
        <ArrowDownIcon color="currentColor" />
      ) : null,
    [hasEnteredUp, hasEnteredDown],
  )
  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <div style={{ whiteSpace: 'nowrap' }}>{`${formatBnbv2(betAmount, displayedDecimals)} ${token.symbol}`}</div>,
    { placement: 'top' },
  )

  useEffect(() => {
    const secondsToLock = lockTimestamp ? lockTimestamp - getNow() : 0
    if (secondsToLock > 0) {
      const setIsBufferPhaseTimeout = setTimeout(() => {
        setIsBufferPhase(true)
      }, (secondsToLock - ROUND_BUFFER) * 1000)

      return () => {
        clearTimeout(setIsBufferPhaseTimeout)
      }
    }
    return undefined
  }, [lockTimestamp])

  const getHasEnteredPosition = () => {
    if (hasEnteredUp || hasEnteredDown) {
      return false
    }

    if (round.lockPrice !== null) {
      return false
    }

    return true
  }

  const canEnterPosition = getHasEnteredPosition()

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

  const handleSuccess = async (hash: string) => {
    await dispatch(fetchLedgerData({ account, epochs: [round.epoch] }))

    handleBack()

    toastSuccess(
      t('Success!'),
      <ToastDescriptionWithTx txHash={hash}>
        {t('%position% position entered', {
          position: positionDisplay,
        })}
      </ToastDescriptionWithTx>,
    )
  }

  return (
    <CardFlip isFlipped={isSettingPosition} height="404px">
      <Card borderBackground={getBorderBackground(theme, 'next')}>
        <CardHeader
          status="next"
          epoch={round.epoch}
          icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}
          title={t('Next')}
        />
        <CardBody p="16px">
          <MultiplierArrow betAmount={betAmount} multiplier={bullMultiplier} hasEntered={hasEnteredUp} />
          <RoundResultBox isNext={canEnterPosition} isLive={!canEnterPosition}>
            {canEnterPosition ? (
              <>
                <PrizePoolRow totalAmount={round.totalAmount} mb="8px" />
                <Button
                  variant="success"
                  width="100%"
                  onClick={() => handleSetPosition(BetPosition.BULL)}
                  mb="4px"
                  disabled={!canEnterPosition || isBufferPhase}
                >
                  {t('Enter UP')}
                </Button>
                <Button
                  variant="danger"
                  width="100%"
                  onClick={() => handleSetPosition(BetPosition.BEAR)}
                  disabled={!canEnterPosition || isBufferPhase}
                >
                  {t('Enter DOWN')}
                </Button>
              </>
            ) : positionEnteredText ? (
              <>
                <div ref={targetRef}>
                  <Button disabled startIcon={positionEnteredIcon} width="100%" mb="8px">
                    {t('%position% Entered', { position: positionEnteredText })}
                  </Button>
                </div>
                <PrizePoolRow totalAmount={round.totalAmount} />
                {tooltipVisible && tooltip}
              </>
            ) : (
              <>
                <div>
                  <Button disabled width="100%" mb="8px">
                    {t('No position entered')}
                  </Button>
                </div>
                <PrizePoolRow totalAmount={round.totalAmount} />
              </>
            )}
          </RoundResultBox>
          <MultiplierArrow
            betAmount={betAmount}
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
        epoch={round.epoch}
      />
    </CardFlip>
  )
}

export default OpenRoundCard
