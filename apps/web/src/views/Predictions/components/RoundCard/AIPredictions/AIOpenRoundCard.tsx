import { useTranslation } from '@pancakeswap/localization'
import { BetPosition, TRANSACTION_BUFFER_BLOCKS } from '@pancakeswap/prediction'
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  PlayCircleOutlineIcon,
  QuestionHelper,
  Text,
  useToast,
  useTooltip,
} from '@pancakeswap/uikit'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { ToastDescriptionWithTx } from 'components/Toast'
import { ASSET_CDN } from 'config/constants/endpoints'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchLedgerData } from 'state/predictions'
import { NodeLedger, NodeRound } from 'state/types'
import styled from 'styled-components'
import { getNowInSeconds } from 'utils/getNowInSeconds'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { usePredictionPrice } from 'views/Predictions/hooks/usePredictionPrice'
import { useAccount } from 'wagmi'
import { AVERAGE_CHAIN_BLOCK_TIMES } from '@pancakeswap/chains'
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
  formattedBullMultiplier: string
  formattedBearMultiplier: string
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
  formattedBullMultiplier,
  formattedBearMultiplier,
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

  // Fetch Live Price for AI Predictions Open and Live Round Cards
  const {
    data: { price: livePrice },
  } = usePredictionPrice({
    currencyA: config?.token.symbol,
  })

  // AI Prediction Market
  /**
   * AI's Bet based on the round's AIPrice and live price.
   */
  const liveAIPosition: 'UP' | 'DOWN' | undefined = useMemo(() => {
    const formattedAIPrice = parseFloat(formatBigInt(round.AIPrice ?? 0n, 8, config?.ai?.aiPriceDecimals))

    if (formattedAIPrice && livePrice)
      return formattedAIPrice === livePrice ? undefined : formattedAIPrice > livePrice ? 'UP' : 'DOWN'

    return undefined
  }, [livePrice, round.AIPrice, config?.ai?.aiPriceDecimals])

  /**
   * User Position in AI Prediction Market
   */
  const userPosition: 'UP' | 'DOWN' | undefined = useMemo(() => {
    if ((hasEnteredFor && liveAIPosition === 'UP') || (hasEnteredAgainst && liveAIPosition === 'DOWN')) return 'UP'
    if ((hasEnteredFor && liveAIPosition === 'DOWN') || (hasEnteredAgainst && liveAIPosition === 'UP')) return 'DOWN'

    return undefined
  }, [hasEnteredFor, hasEnteredAgainst, liveAIPosition])

  // AI-based Prediction's Multiplier
  // If AI's prediction is UP, then BullMultiplier is AI's prediction and vice versa
  const bullMultiplier = liveAIPosition === 'UP' ? formattedBullMultiplier : formattedBearMultiplier
  const bearMultiplier = liveAIPosition === 'DOWN' ? formattedBullMultiplier : formattedBearMultiplier

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
      }, (secondsToLock - AVERAGE_CHAIN_BLOCK_TIMES[chainId] * TRANSACTION_BUFFER_BLOCKS) * 1000)

      return () => {
        clearTimeout(setIsBufferPhaseTimeout)
      }
    }
    return undefined
  }, [lockTimestamp, chainId])

  const canEnterPosition = useMemo(() => {
    if (hasEnteredFor || hasEnteredAgainst) {
      return false
    }

    if (round.lockPrice !== null) {
      return false
    }

    return true
  }, [hasEnteredFor, hasEnteredAgainst, round?.lockPrice])

  const handleBack = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: false,
    }))
  }, [])

  const handleSetPosition = useCallback((newPosition: BetPosition) => {
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
    },
    [account, chainId, dispatch, round?.epoch, handleBack, position, t, toastSuccess],
  )

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
          {(!positionEnteredText || (liveAIPosition === 'DOWN' && userPosition === 'DOWN')) && (
            <Flex justifyContent="center" alignItems="baseline">
              <Text
                color="white"
                fontWeight={700}
                style={{
                  fontSize: '24px',
                  marginBottom: liveAIPosition === 'DOWN' && userPosition === 'DOWN' ? '12px' : '0',
                  // WebkitTextStroke: '3px #280D5F',
                }}
              >
                {t('AI prediction')}
              </Text>
              <QuestionHelper
                text={
                  <>
                    {t('Enter bet by going with or against the prediction made by AI')}
                    <br />
                    <br />
                    {t('You will be able to see AI is betting Up or Down after you place the bet!')}
                    <br />
                    <br />
                    <Flex>
                      {t('Powered by Allora')}
                      <img
                        src={`${ASSET_CDN}/web/game/predictions/allora.svg`}
                        alt="Allora Logo"
                        width={20}
                        height={20}
                        style={{ marginLeft: '5px', filter: theme.isDark ? 'invert(1)' : '' }}
                      />
                    </Flex>
                  </>
                }
                placement="bottom"
                color="white"
                size="18px"
                ml="3px"
                mt="3px"
              />
            </Flex>
          )}
          {!positionEnteredText ? (
            <>
              <Box mt="50px" mb="12px" mx="18px" position="relative">
                <RoundResultBox isNext>
                  <PayoutMeter pt="10px" bearMultiplier={bearMultiplier} bullMultiplier={bullMultiplier} />
                </RoundResultBox>

                <AIPredictionsLogo style={{ position: 'absolute', top: '-48px', left: '48px', width: '160px' }} />
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
                    <AIPredictionsLogo style={{ width: '160px', margin: '10px 0' }} />
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
