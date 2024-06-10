import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, ErrorFillIcon, Flex, Text, useModal } from '@pancakeswap/uikit'
import { CurrencySearchModal } from 'components/SearchModal/CurrencySearchModal'
import { TokenWithChain } from 'components/TokenWithChain'
import { useCallback, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskHoldTokenConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateNumber } from 'views/DashboardQuestEdit/utils/validateTask'

const StyleSelector = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 0 8px 0 28px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
`

interface AddHoldTokenProps {
  task: TaskHoldTokenConfig
}

export const AddHoldToken: React.FC<AddHoldTokenProps> = ({ task }) => {
  const { t } = useTranslation()
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)
  const [isFirst, setIsFirst] = useState(true)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      setIsFirst(false)

      const forkTasks = Object.assign(tasks)
      const indexToUpdate = forkTasks.findIndex((i: TaskHoldTokenConfig) => i.sid === task.sid)
      forkTasks[indexToUpdate].currency = currency

      onTasksChange([...forkTasks])
    },
    [onTasksChange, task.sid, tasks],
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal selectedCurrency={task.currency} onCurrencySelect={handleCurrencySelect} />,
  )

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskHoldTokenConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].minAmount = e.target.value

    onTasksChange([...forkTasks])
  }

  const onClickOptional = () => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskHoldTokenConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].isOptional = !forkTasks[indexToUpdate].isOptional

    onTasksChange([...forkTasks])
  }

  const isError = useMemo(() => !isFirst && validateNumber(task.minAmount), [isFirst, task?.minAmount])

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center" position="relative">
          {taskIcon(TaskType.HOLD_A_TOKEN)}
          {task.isOptional && <StyledOptionIcon />}
        </Flex>
        <Text bold style={{ alignSelf: 'center' }}>
          {taskNaming(TaskType.HOLD_A_TOKEN)}
        </Text>
        <DropdownList
          m="auto 0px auto auto"
          id={task.sid}
          isOptional={task.isOptional}
          onClickDelete={onPresentDeleteModal}
          onClickOptional={onClickOptional}
        />
      </Flex>
      <Flex flexDirection={['column']} width="100%" mt="12px">
        <Flex flexDirection="column">
          <Flex>
            <Flex position="relative" paddingRight="45px" onClick={onPresentCurrencyModal}>
              <TokenWithChain width={32} height={32} currency={task.currency} />
              <StyleSelector variant="light" scale="sm" endIcon={<ChevronDownIcon />} />
            </Flex>
            <StyledInputGroup endIcon={isError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}>
              <StyledInput
                isError={isError}
                value={task.minAmount}
                placeholder={t('Min. amount in $')}
                onChange={handleTotalChange}
              />
            </StyledInputGroup>
          </Flex>
          {isError && <InputErrorText errorText={t('Cannot be 0')} />}
        </Flex>
      </Flex>
    </Flex>
  )
}
