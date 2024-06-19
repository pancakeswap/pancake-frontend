import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Text } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import { styled } from 'styled-components'
import { AddReward } from 'views/DashboardQuestEdit/components/Reward/AddReward'
import { RewardAmount } from 'views/DashboardQuestEdit/components/Reward/RewardAmount'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'
import { RewardType } from 'views/DashboardQuestEdit/type'

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
  reward: undefined | QuestRewardType
  actionComponent?: JSX.Element
  updateValue: (key: string, value: string | QuestRewardType) => void
}

export const Reward: React.FC<RewardProps> = ({ reward, actionComponent, updateValue }) => {
  const { t } = useTranslation()

  const handleRewardPerWin = useCallback(
    (value: string) => {
      if (reward) {
        updateValue('reward', {
          ...reward,
          amountOfWinners: Number(value),
        })
      }
    },
    [reward, updateValue],
  )

  const handlePickedRewardToken = () => {
    let rewardData: QuestRewardType = {
      title: '',
      description: '',
      rewardType: RewardType.TOKEN,
      currency: {
        address: '0x',
        network: 56,
      },
      amountOfWinners: 0,
      totalRewardAmount: 0,
    }

    if (reward) {
      rewardData = {
        ...reward,
        currency: {
          address: '0x',
          network: 56,
        },
      }
    }

    updateValue('reward', rewardData)
  }

  return (
    <RewardContainer>
      <Card>
        <Box padding="24px">
          <Text fontSize={['24px']} bold mb={['24px']}>
            {t('Reward')}
          </Text>
          {reward ? (
            <RewardAmount
              totalRewardAmount={reward?.totalRewardAmount}
              amountOfWinners={reward?.amountOfWinners}
              setAmountPerWinner={handleRewardPerWin}
            />
          ) : (
            <AddReward />
          )}
          {actionComponent}
        </Box>
      </Card>
    </RewardContainer>
  )
}
