import { useTranslation } from '@pancakeswap/localization'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { EditTemplate } from 'views/DashboardQuestEdit/components/EditTemplate'
import { Reward } from 'views/DashboardQuestEdit/components/Reward'
import { SubmitAction } from 'views/DashboardQuestEdit/components/SubmitAction'
import { Tasks } from 'views/DashboardQuestEdit/components/Tasks'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'

const DashboardQuestEditContainer = styled(Flex)`
  padding: 16px;
  margin: auto;
  max-width: 1200px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
  }
`

export const DashboardQuestEdit = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { state, updateValue } = useQuestEdit()

  return (
    <DashboardQuestEditContainer>
      <EditTemplate titleText={t('Quest title')} state={state} updateValue={updateValue}>
        {!isDesktop && (
          <Reward
            amountPerWinner={state.amountPerWinner}
            actionComponent={<SubmitAction />}
            updateValue={updateValue}
          />
        )}
        <Tasks />
      </EditTemplate>
      {isDesktop && (
        <Reward amountPerWinner={state.amountPerWinner} actionComponent={<SubmitAction />} updateValue={updateValue} />
      )}
    </DashboardQuestEditContainer>
  )
}
