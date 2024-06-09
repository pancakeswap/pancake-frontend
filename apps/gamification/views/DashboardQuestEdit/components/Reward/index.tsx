import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Text } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import { styled } from 'styled-components'
import { Countdown } from 'views/DashboardQuestEdit/components/Reward/Countdown'
import { RewardAmount } from 'views/DashboardQuestEdit/components/Reward/RewardAmount'

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
  updateValue: (key: string, value: string) => void
}

export const Reward: React.FC<RewardProps> = ({ amountPerWinner, updateValue }) => {
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
          <Text fontSize={['24px']} bold mb={['24px', '24px', '40px']}>
            {t('Reward')}
          </Text>
          <RewardAmount amountPerWinner={amountPerWinner} setAmountPerWinner={handleRewardPerWin} />
          <Countdown />
        </Box>
      </Card>
    </RewardContainer>
  )
}
