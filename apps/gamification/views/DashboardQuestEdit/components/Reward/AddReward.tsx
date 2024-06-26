import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { AddIcon, Button, EmptyRewardIcon, Flex, useModal } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { AddRewardModal } from 'views/DashboardQuestEdit/components/Reward/AddRewardModal'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'

const AddRewardContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding-bottom: 28px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

interface AddRewardProps {
  reward: undefined | QuestRewardType
  amountOfWinners: number
  handlePickedRewardToken: (value: Currency, totalRewardAmount: number, amountOfWinnersInModal: number) => void
}

export const AddReward: React.FC<AddRewardProps> = ({ reward, amountOfWinners, handlePickedRewardToken }) => {
  const { t } = useTranslation()
  const [onPresentAddRewardModal] = useModal(
    <AddRewardModal
      reward={reward}
      amountOfWinners={amountOfWinners}
      handlePickedRewardToken={handlePickedRewardToken}
    />,
    true,
    true,
    'add-reward-modal',
  )

  return (
    <AddRewardContainer>
      <EmptyRewardIcon color="#E2E7E8" width={64} height={64} />
      <Button onClick={onPresentAddRewardModal} variant="text" endIcon={<AddIcon color="primary" />}>
        {t('Add a reward')}
      </Button>
    </AddRewardContainer>
  )
}
