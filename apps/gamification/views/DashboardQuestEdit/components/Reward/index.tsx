import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Text } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import { styled } from 'styled-components'
import { AddReward } from 'views/DashboardQuestEdit/components/Reward/AddReward'
import { Countdown } from 'views/DashboardQuestEdit/components/Reward/Countdown'
// import { RewardAmount } from 'views/DashboardQuestEdit/components/Reward/RewardAmount'

const RewardContainer = styled(Box)`
  width: 100%;
  padding-bottom: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 448px;
    min-height: 100vh;
    padding: 40px 40px 168px 40px;
    border-left: 1px solid ${({ theme }) => theme.colors.input};
  }
`

interface RewardProps {
  amountPerWinner: string
  actionComponent?: JSX.Element
  updateValue: (key: string, value: string) => void
}

export const Reward: React.FC<RewardProps> = ({ amountPerWinner, actionComponent, updateValue }) => {
  const { t } = useTranslation()

  const handleRewardPerWin = useCallback(
    (value: string) => {
      updateValue('amountPerWinner', value)
    },
    [updateValue],
  )

  return (
    <RewardContainer>
      <Card>
        <Box padding="24px">
          <Text fontSize={['24px']} bold mb={['24px']}>
            {t('Reward')}
          </Text>
          <AddReward />
          {/* <RewardAmount amountPerWinner={amountPerWinner} setAmountPerWinner={handleRewardPerWin} /> */}
          <Countdown />
          {actionComponent}
        </Box>
      </Card>
    </RewardContainer>
  )
}
