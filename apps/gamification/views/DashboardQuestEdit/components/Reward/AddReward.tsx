import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Button, EmptyRewardIcon, Flex, useModal } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { AddRewardModal } from 'views/DashboardQuestEdit/components/Reward/AddRewardModal'

const AddRewardContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding-bottom: 28px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

export const AddReward = () => {
  const { t } = useTranslation()
  const [onPresentAddRewardModal] = useModal(<AddRewardModal />)

  return (
    <AddRewardContainer>
      <EmptyRewardIcon color="#E2E7E8" width={64} height={64} />
      <Button onClick={onPresentAddRewardModal} variant="text" endIcon={<AddIcon color="primary" />}>
        {t('Add a reward')}
      </Button>
    </AddRewardContainer>
  )
}
