import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import RewardsMatch from './RewardsMatch'

const Wrapper = styled(Flex)`
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

const RewardMatchesContainer: React.FC<{ lotteryData: LotteryRound }> = ({ lotteryData }) => {
  const { t } = useTranslation()
  const { treasuryFee, amountCollectedInCake, rewardsBreakdown } = lotteryData

  const feeAsPercentage = new BigNumber(treasuryFee).div(100)
  const cakeToBurn = feeAsPercentage.div(100).times(new BigNumber(amountCollectedInCake))
  const amountLessTreasuryFee = new BigNumber(amountCollectedInCake).minus(cakeToBurn)

  const getCakeRewards = (bracket: number) => {
    const shareAsPercentage = new BigNumber(rewardsBreakdown[bracket]).div(100)
    return amountLessTreasuryFee.div(100).times(shareAsPercentage)
  }

  return (
    <Wrapper>
      <Text fontSize="14px" mb="12px">
        {t('Match the winning number in the same order to share prizes. Current prizes up for grabs:')}
      </Text>
      <RewardsInner>
        <RewardsMatch rewardBracket={5} cakeAmount={getCakeRewards(5)} />
        <RewardsMatch rewardBracket={4} cakeAmount={getCakeRewards(4)} />
        <RewardsMatch rewardBracket={3} cakeAmount={getCakeRewards(3)} />
        <RewardsMatch rewardBracket={2} cakeAmount={getCakeRewards(2)} />
        <RewardsMatch rewardBracket={1} cakeAmount={getCakeRewards(1)} />
        <RewardsMatch rewardBracket={0} cakeAmount={getCakeRewards(0)} />
        <RewardsMatch rewardBracket={0} cakeAmount={cakeToBurn} isBurn />
      </RewardsInner>
    </Wrapper>
  )
}

export default RewardMatchesContainer
