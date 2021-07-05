import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import RewardBracketDetail from './RewardBracketDetail'

const Wrapper = styled(Flex)`
  width: 100%;
  flex-direction: column;
`

const RewardsInner = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  row-gap: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(4, 1fr);
  }
`

interface RewardMatchesProps {
  lotteryData: LotteryRound
  isHistoricRound?: boolean
}

const RewardBrackets: React.FC<RewardMatchesProps> = ({ lotteryData, isHistoricRound }) => {
  const { t } = useTranslation()
  const { treasuryFee, amountCollectedInCake, rewardsBreakdown, countWinnersPerBracket } = lotteryData

  const feeAsPercentage = new BigNumber(treasuryFee).div(100)
  const cakeToBurn = feeAsPercentage.div(100).times(new BigNumber(amountCollectedInCake))
  const amountLessTreasuryFee = new BigNumber(amountCollectedInCake).minus(cakeToBurn)

  const getCakeRewards = (bracket: number) => {
    const shareAsPercentage = new BigNumber(rewardsBreakdown[bracket]).div(100)
    return amountLessTreasuryFee.div(100).times(shareAsPercentage)
  }

  return (
    <Wrapper>
      <Text fontSize="14px" mb="24px">
        {t('Match the winning number in the same order to share prizes.')}{' '}
        {!isHistoricRound && t('Current prizes up for grabs:')}
      </Text>
      <RewardsInner>
        <RewardBracketDetail
          rewardBracket={5}
          cakeAmount={getCakeRewards(5)}
          numberWinners={countWinnersPerBracket[5]}
          isHistoricRound={isHistoricRound}
        />
        <RewardBracketDetail
          rewardBracket={4}
          cakeAmount={getCakeRewards(4)}
          numberWinners={countWinnersPerBracket[4]}
          isHistoricRound={isHistoricRound}
        />
        <RewardBracketDetail
          rewardBracket={3}
          cakeAmount={getCakeRewards(3)}
          numberWinners={countWinnersPerBracket[3]}
          isHistoricRound={isHistoricRound}
        />
        <RewardBracketDetail
          rewardBracket={2}
          cakeAmount={getCakeRewards(2)}
          numberWinners={countWinnersPerBracket[2]}
          isHistoricRound={isHistoricRound}
        />
        <RewardBracketDetail
          rewardBracket={1}
          cakeAmount={getCakeRewards(1)}
          numberWinners={countWinnersPerBracket[1]}
          isHistoricRound={isHistoricRound}
        />
        <RewardBracketDetail
          rewardBracket={0}
          cakeAmount={getCakeRewards(0)}
          numberWinners={countWinnersPerBracket[0]}
          isHistoricRound={isHistoricRound}
        />
        <RewardBracketDetail rewardBracket={0} cakeAmount={cakeToBurn} isBurn />
      </RewardsInner>
    </Wrapper>
  )
}

export default RewardBrackets
