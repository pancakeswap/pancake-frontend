import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { AddIcon, Button, EmptyRewardIcon, Flex, useModal, useToast } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { AddRewardModal } from 'views/DashboardQuestEdit/components/Reward/AddRewardModal'
import { QuestRewardType, StateType } from 'views/DashboardQuestEdit/context/types'
import { combineDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

const AddRewardContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding-bottom: 16px;
`

interface AddRewardProps {
  state: StateType
  reward: undefined | QuestRewardType
  amountOfWinners: number
  handlePickedRewardToken: (value: Currency, totalRewardAmount: number, amountOfWinnersInModal: number) => void
}

export const AddReward: React.FC<AddRewardProps> = ({ state, reward, amountOfWinners, handlePickedRewardToken }) => {
  const { t } = useTranslation()
  const { toastError } = useToast()
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

  const endDateTime = state.endDate && state.endTime ? combineDateAndTime(state.endDate, state.endTime) ?? 0 : 0

  const onClickAddReward = () => {
    if (!state.id) {
      toastError(t('Only available for Draft status'))
    } else if (endDateTime <= 0) {
      toastError(t('Please setup end time'))
    } else {
      onPresentAddRewardModal()
    }
  }

  return (
    <AddRewardContainer>
      <EmptyRewardIcon color="#E2E7E8" width={64} height={64} />
      <Button onClick={onClickAddReward} variant="text" endIcon={<AddIcon color="primary" />}>
        {t('Add a reward')}
      </Button>
    </AddRewardContainer>
  )
}
