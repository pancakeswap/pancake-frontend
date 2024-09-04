import { useTranslation } from '@pancakeswap/localization'
import { BetPosition, TRANSACTION_BUFFER_BLOCKS } from '@pancakeswap/prediction'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Button,
  Card,
  CardBody,
  PlayCircleOutlineIcon,
  useToast,
  useTooltip,
} from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchLedgerData } from 'state/predictions'
import { NodeLedger, NodeRound } from 'state/types'
import { getNowInSeconds } from 'utils/getNowInSeconds'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { useAccount } from 'wagmi'
import { logGTMPredictionBetEvent, logGTMPredictionBetPlacedEvent } from 'utils/customGTMEventTracking'
import { AVERAGE_CHAIN_BLOCK_TIMES } from '@pancakeswap/chains'
import { formatTokenv2 } from '../../helpers'
import CardFlip from '../CardFlip'
import { PrizePoolRow, RoundResultBox } from '../RoundResult'
import CardHeader, { getBorderBackground } from './CardHeader'
import MultiplierArrow from './MultiplierArrow'
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
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const dispatch = useLocalDispatch()
  const config = useConfig()
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
    <div style={{ whiteSpace: 'nowrap' }}>{`${formatTokenv2(
      betAmount ?? 0n,
      config?.token?.decimals ?? 0,
      config?.displayedDecimals ?? 4,
    )} ${config?.token?.symbol}`}</div>,
    { placement: 'top' },
  )

  useEffect(() => {
    const secondsToLock = lockTimestamp ? lockTimestamp - getNowInSeconds() : 0
    if (secondsToLock > 0) {
      const setIsBufferPhaseTimeout = setTimeout(() => {
        setIsBufferPhase(true)
      }, (secondsToLock - AVERAGE_CHAIN_BLOCK_TIMES[chainId] * TRANSACTION_BUFFER_BLOCKS) * 1000)

      return () => {
        clearTimeout(setIsBufferPhaseTimeout)
      }
    }
    return undefined
  }, [lockTimestamp, chainId])

  const canEnterPosition = useMemo(() => {
    if (hasEnteredUp || hasEnteredDown) {
      return false
    }

    if (round.lockPrice !== null) {
      return false
    }

    return true
  }, [hasEnteredUp, hasEnteredDown, round?.lockPrice])

  const handleBack = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: false,
    }))
  }, [])

  const handleSetPosition = useCallback((newPosition: BetPosition) => {
    logGTMPredictionBetEvent(newPosition)

    setState((prevState) => ({
      ...prevState,
      isSettingPosition: true,
      position: newPosition,
    }))
  }, [])

  const togglePosition = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      position: prevState.position === BetPosition.BULL ? BetPosition.BEAR : BetPosition.BULL,
    }))
  }, [])

  const handleSuccess = useCallback(
    async (hash: string) => {
      if (account && chainId) {
        await dispatch(fetchLedgerData({ account, chainId, epochs: [round.epoch] }))

        logGTMPredictionBetPlacedEvent(positionDisplay)

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
    },
    [account, chainId, dispatch, round?.epoch, handleBack, positionDisplay, t, toastSuccess],
  )

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
