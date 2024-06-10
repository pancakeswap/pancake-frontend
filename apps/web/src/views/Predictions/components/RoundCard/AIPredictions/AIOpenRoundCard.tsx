import { useTranslation } from '@pancakeswap/localization'
import { BetPosition, ROUND_BUFFER } from '@pancakeswap/prediction'
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  PlayCircleOutlineIcon,
  Text,
  useToast,
  useTooltip,
} from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { useEffect, useMemo, useState } from 'react'
import { fetchLedgerData } from 'state/predictions'
import { NodeLedger, NodeRound } from 'state/types'
import styled from 'styled-components'
import { getNowInSeconds } from 'utils/getNowInSeconds'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { useAccount } from 'wagmi'
import { formatTokenv2 } from '../../../helpers'
import CardFlip from '../../CardFlip'
import { PrizePoolRow, RoundResultBox } from '../../RoundResult'
import { AICardHeader, getBorderBackground } from './AICardHeader'
import { AIMultiplierArrow } from './AIMultiplierArrow'
import { AIPredictionsLogo } from './AIPredictionsLogo'
import { AISetPositionCard } from './AISetPositionCard'
import { PayoutMeter } from './PayoutMeter'

const StyledPositionBox = styled(Box)`
  padding: 12px 24px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii['20px']};
  background-color: ${({ theme }) => theme.colors.tertiary};
`

const StyledCardBody = styled(CardBody)`
  padding: 16px;
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.secondary} 43%, transparent 0);
`

interface AIOpenRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredFor: boolean // FOLLOWED AI's Prediction
  hasEnteredAgainst: boolean // AGAINST AI's Prediction
  bullMultiplier: string
  bearMultiplier: string

  liveAIPosition: 'UP' | 'DOWN' | undefined
  userPosition?: 'UP' | 'DOWN' | undefined
}

interface State {
  isSettingPosition: boolean
  position: BetPosition
}

export const AIOpenRoundCard: React.FC<React.PropsWithChildren<AIOpenRoundCardProps>> = ({
  round,
  betAmount,
  hasEnteredFor,
  hasEnteredAgainst,
  bullMultiplier,
  bearMultiplier,
  liveAIPosition,
  userPosition,
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

  const positionEnteredText = useMemo(
    () => (hasEnteredFor ? t('Follow') : hasEnteredAgainst ? t('Against') : null),
    [t, hasEnteredFor, hasEnteredAgainst],
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
      }, (secondsToLock - ROUND_BUFFER) * 1000)

      return () => {
        clearTimeout(setIsBufferPhaseTimeout)
      }
    }
    return undefined
  }, [lockTimestamp])

  const getHasEnteredPosition = () => {
    if (hasEnteredFor || hasEnteredAgainst) {
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
    if (account && chainId) {
      await dispatch(fetchLedgerData({ account, chainId, epochs: [round.epoch] }))

      handleBack()

      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={hash}>
          {t('You are %positionMessage% prediction!', {
            // TODO: test reactivity of this by going BULL (following AI) and see if position is up to date
            positionMessage: position === BetPosition.BULL ? t("following AI's") : t("going against AI's"),
          })}
        </ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <CardFlip isFlipped={isSettingPosition} height="404px">
      <Card borderBackground={getBorderBackground(theme, 'next')} padding={0}>
        <AICardHeader
          status="next"
          epoch={round.epoch}
          icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}
          title={t('Next')}
        />

        <StyledCardBody>
          {!positionEnteredText ? (
            <>
              <Text
                color="white"
                fontWeight={700}
                textAlign="center"
                style={{
                  fontSize: '24px',
                  //  WebkitTextStroke: '3px #280D5F'
                }}
              >
                AI prediction
              </Text>

              <Box mt="50px" mb="12px" mx="18px" position="relative">
                <RoundResultBox isNext>
                  <PayoutMeter pt="10px" bearMultiplier={bearMultiplier} bullMultiplier={bullMultiplier} />
                </RoundResultBox>

                <AIPredictionsLogo
                  width={140}
                  height={140}
                  style={{ position: 'absolute', top: '-58px', left: '68px' }}
                />
              </Box>
            </>
          ) : (
            <>
              {!!positionEnteredText && ((hasEnteredFor && liveAIPosition === 'UP') || hasEnteredAgainst) && (
                <AIMultiplierArrow
                  betAmount={betAmount}
                  multiplier={bullMultiplier}
                  hasEntered={!!positionEnteredText && userPosition === 'UP'}
                  hasEnteredAgainst={hasEnteredAgainst && userPosition === 'UP' && liveAIPosition === 'DOWN'}
                />
              )}
              <Box mx="18px">
                <RoundResultBox innerPadding="2px 0" isNext>
                  <Flex justifyContent="center">
                    <AIPredictionsLogo width={120} height={120} />
                  </Flex>
                </RoundResultBox>
              </Box>
              {!!positionEnteredText && ((hasEnteredFor && liveAIPosition === 'DOWN') || hasEnteredAgainst) && (
                <AIMultiplierArrow
                  betAmount={betAmount}
                  multiplier={bearMultiplier}
                  betPosition={BetPosition.BEAR}
                  hasEntered={!!positionEnteredText && userPosition === 'DOWN'}
                  hasEnteredAgainst={hasEnteredAgainst && userPosition === 'DOWN' && liveAIPosition === 'UP'}
                />
              )}
            </>
          )}

          {canEnterPosition && (
            <>
              <Button
                variant="success"
                width="100%"
                onClick={() => handleSetPosition(BetPosition.BULL)}
                mb="4px"
                disabled={!canEnterPosition || isBufferPhase}
              >
                {t('Follow')}
              </Button>
              <Button
                variant="danger"
                width="100%"
                onClick={() => handleSetPosition(BetPosition.BEAR)}
                disabled={!canEnterPosition || isBufferPhase}
              >
                {t('Against')}
              </Button>
              <PrizePoolRow totalAmount={round.totalAmount} mt="8px" />
            </>
          )}

          {positionEnteredText && (
            <>
              <StyledPositionBox mt="16px" ref={targetRef}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text color="textSubtle" textTransform="uppercase" style={{ fontSize: '13px' }} bold>
                    {t('My Position')}
                  </Text>
                  <Text bold>{t('%position% AI', { position: positionEnteredText })}</Text>
                </Flex>
              </StyledPositionBox>
              <PrizePoolRow totalAmount={round.totalAmount} mt="12px" px="10px" />
              {tooltipVisible && tooltip}
            </>
          )}
        </StyledCardBody>
      </Card>
      <AISetPositionCard
        onBack={handleBack}
        onSuccess={handleSuccess}
        position={position}
        togglePosition={togglePosition}
        epoch={round.epoch}
      />
    </CardFlip>
  )
}
