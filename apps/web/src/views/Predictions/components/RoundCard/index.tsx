import { BetPosition } from '@pancakeswap/prediction'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { useEffect, useMemo } from 'react'
import { useGetBetByEpoch, useGetCurrentEpoch } from 'state/predictions/hooks'
import { NodeRound } from 'state/types'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import usePollOraclePrice from 'views/Predictions/hooks/usePollOraclePrice'
import { useAccount } from 'wagmi'
import { getMultiplierV2 } from '../../helpers'
import { AILiveRoundCard } from './AIPredictions/AILiveRoundCard'
import { AIOpenRoundCard } from './AIPredictions/AIOpenRoundCard'
import ExpiredRoundCard from './ExpiredRoundCard'
import LiveRoundCard from './LiveRoundCard'
import OpenRoundCard from './OpenRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: NodeRound
  isActive?: boolean
}

const RoundCard: React.FC<React.PropsWithChildren<RoundCardProps>> = ({ round, isActive }) => {
  const { epoch, lockPrice, closePrice, totalAmount, bullAmount, bearAmount } = round
  const currentEpoch = useGetCurrentEpoch()
  const { address: account } = useAccount()
  const ledger = useGetBetByEpoch(account ?? '0x', epoch)
  const config = useConfig()

  // For fetching live price used in Open and Live Round Cards
  // Replace with CMC later (TODO)
  const { price, refresh } = usePollOraclePrice({
    chainlinkOracleAddress: config?.chainlinkOracleAddress,
  })

  const hasEntered = ledger ? ledger.amount > 0n : false

  const hasEnteredUp = hasEntered && ledger?.position === BetPosition.BULL
  const hasEnteredDown = hasEntered && ledger?.position === BetPosition.BEAR
  const hasClaimedUp = hasEntered && ledger?.claimed && ledger.position === BetPosition.BULL
  const hasClaimedDown = hasEntered && ledger?.claimed && ledger.position === BetPosition.BEAR

  // AI Prediction Market
  /**
   * AI's Bet based on the round's AIPrice and live price.
   * If the prices are equal (house win), return undefined
   */
  const liveAIPosition: 'UP' | 'DOWN' | undefined = useMemo(() => {
    // Accurate upto 8 decimals (if prices are equal at 8 decimals, it is considered a house win)
    const formattedAIPrice = parseFloat(formatBigInt(round.AIPrice ?? 0n, 8, 18))
    const formattedLivePrice = parseFloat(formatBigInt(price ?? 0n, 8, 8)) // Chainlink price is 8 decimals on ARB's ETH/USD. TODO: Replace with CMC

    if (formattedAIPrice && formattedLivePrice)
      return formattedAIPrice === formattedLivePrice ? undefined : formattedAIPrice > formattedLivePrice ? 'UP' : 'DOWN'

    return undefined
  }, [price, round.AIPrice])

  /**
   * User Position in AI Prediction Market
   */
  const userPosition: 'UP' | 'DOWN' | undefined = useMemo(() => {
    // hasEnteredUp => Has entered FOR AI (Follow AI)
    // hasEnteredDown => Has entered AGAINST AI

    if ((hasEnteredUp && liveAIPosition === 'UP') || (hasEnteredDown && liveAIPosition === 'DOWN')) return 'UP'
    if ((hasEnteredUp && liveAIPosition === 'DOWN') || (hasEnteredDown && liveAIPosition === 'UP')) return 'DOWN'

    return undefined
  }, [hasEnteredUp, hasEnteredDown, liveAIPosition])

  // Poll oracle for price every 10 seconds (for now)
  // remember this needs to sync with LiveRoundCard's price polling
  // TODO: Replace with CMC logic later
  useEffect(() => {
    if (epoch > currentEpoch) return undefined

    const interval = setInterval(() => {
      refresh()
    }, 10_000)

    return () => clearInterval(interval)
  }, [refresh, epoch, currentEpoch])

  // Fake future rounds
  if (epoch > currentEpoch) {
    return <SoonRoundCard round={round} />
  }

  const bullMultiplier = totalAmount && bullAmount ? getMultiplierV2(totalAmount, bullAmount) : BIG_ZERO
  const bearMultiplier = totalAmount && bearAmount ? getMultiplierV2(totalAmount, bearAmount) : BIG_ZERO

  const formattedBullMultiplier = bullMultiplier.toFixed(bullMultiplier.isZero() ? 0 : 2)
  const formattedBearMultiplier = bearMultiplier.toFixed(bearMultiplier.isZero() ? 0 : 2)

  // AI-based Prediction's Multiplier
  // If AI's prediction is UP, then BullMultiplier is AI's prediction and vice versa
  const aiBullMultiplier = liveAIPosition === 'UP' ? formattedBullMultiplier : formattedBearMultiplier
  const aiBearMultiplier = liveAIPosition === 'DOWN' ? formattedBullMultiplier : formattedBearMultiplier

  // Next (open) round
  if (epoch === currentEpoch && lockPrice === null) {
    // AI-based predictions
    if (config?.isAIPrediction) {
      return (
        <AIOpenRoundCard
          round={round}
          hasEnteredFor={hasEnteredUp} // Bull => With AI's prediction
          hasEnteredAgainst={hasEnteredDown} // Bear => Against AI's prediction
          betAmount={ledger?.amount}
          bullMultiplier={aiBullMultiplier}
          bearMultiplier={aiBearMultiplier}
          liveAIPosition={liveAIPosition}
          userPosition={userPosition}
        />
      )
    }

    // Predictions V2
    return (
      <OpenRoundCard
        round={round}
        hasEnteredDown={hasEnteredDown}
        hasEnteredUp={hasEnteredUp}
        betAmount={ledger?.amount}
        bullMultiplier={formattedBullMultiplier}
        bearMultiplier={formattedBearMultiplier}
      />
    )
  }

  // Live round
  if (closePrice === null && epoch === currentEpoch - 1) {
    if (config?.isAIPrediction) {
      return (
        <AILiveRoundCard
          betAmount={ledger?.amount}
          hasEnteredFor={hasEnteredUp}
          hasEnteredAgainst={hasEnteredDown}
          round={round}
          bullMultiplier={aiBullMultiplier}
          bearMultiplier={aiBearMultiplier}
          liveAIPosition={liveAIPosition}
          userPosition={userPosition}
        />
      )
    }

    return (
      <LiveRoundCard
        betAmount={ledger?.amount}
        hasEnteredDown={hasEnteredDown}
        hasEnteredUp={hasEnteredUp}
        round={round}
        bullMultiplier={formattedBullMultiplier}
        bearMultiplier={formattedBearMultiplier}
      />
    )
  }

  // Past rounds
  return (
    <ExpiredRoundCard
      isActive={isActive}
      round={round}
      hasEnteredDown={hasEnteredDown}
      hasEnteredUp={hasEnteredUp}
      hasClaimedDown={hasClaimedDown ?? false}
      hasClaimedUp={hasClaimedUp ?? false}
      betAmount={ledger?.amount}
      bullMultiplier={formattedBullMultiplier}
      bearMultiplier={formattedBearMultiplier}
    />
  )
}

export default RoundCard
