import { useTranslation } from '@pancakeswap/localization'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import { Quests } from 'views/DashboardCampaignEdit/components/Quests/index'
import { EditTemplate, StateType } from 'views/DashboardQuestEdit/components/EditTemplate'
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
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const [state, setState] = useState<StateType>(() => ({
    title: '',
    body: '',
    amountPerWinner: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
  }))

  const updateValue = (key: string, value: string | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

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
