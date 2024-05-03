import { useTranslation } from '@pancakeswap/localization'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import { EditTemplate, StateType } from 'views/DashboardQuestEdit/components/EditTemplate'
import { Reward } from 'views/DashboardQuestEdit/components/Reward'
import { Tasks } from 'views/DashboardQuestEdit/components/Tasks'

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
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const [state, setState] = useState<StateType>(() => ({
    title: '',
    body: '',
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

  const handleEasyMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value)
  }

  return (
    <DashboardQuestEditContainer>
      <EditTemplate
        titleText={t('Quest title')}
        state={state}
        updateValue={updateValue}
        handleDateChange={handleDateChange}
        handleEasyMdeChange={handleEasyMdeChange}
      >
        {!isDesktop && <Reward />}
        <Tasks />
      </EditTemplate>
      {isDesktop && <Reward />}
    </DashboardQuestEditContainer>
  )
}
