import { useTranslation } from '@pancakeswap/localization'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Quests } from 'views/DashboardCampaignEdit/components/Quests/index'
import { useCampaignEdit } from 'views/DashboardCampaignEdit/context/useCampaignEdit'
import { EditTemplate } from 'views/DashboardQuestEdit/components/EditTemplate'
import { Reward } from 'views/DashboardQuestEdit/components/Reward'

const DashboardCampaignEditContainer = styled(Flex)`
  padding: 16px;
  margin: auto;
  max-width: 1200px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
  }
`

export const DashboardCampaignEdit = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { state, updateValue } = useCampaignEdit()

  return (
    <DashboardCampaignEditContainer>
      <EditTemplate titleText={t('Campaign title')} state={state} updateValue={updateValue}>
        {!isDesktop && <Reward amountPerWinner={state.amountPerWinner} updateValue={updateValue} />}
        <Quests />
      </EditTemplate>
      {isDesktop && <Reward amountPerWinner={state.amountPerWinner} updateValue={updateValue} />}
    </DashboardCampaignEditContainer>
  )
}
