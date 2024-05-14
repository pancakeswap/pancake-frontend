import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { Button, ChevronDownIcon, DeleteOutlineIcon, ErrorFillIcon, Flex, Text, useModal } from '@pancakeswap/uikit'
import { CurrencySearchModal } from 'components/SearchModal/CurrencySearchModal'
import { TokenWithChain } from 'components/TokenWithChain'
import { useCallback, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/Tasks/ConfirmDeleteModal'
import { TaskSwapConfig } from 'views/DashboardQuestEdit/context/types'
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

interface AddSwapProps {
  task: TaskSwapConfig
}

export const AddSwap: React.FC<AddSwapProps> = ({ task }) => {
  const { t } = useTranslation()
  const { taskIcon, taskNaming } = useTaskInfo()
  const [isFirst, setIsFirst] = useState(true)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      setIsFirst(false)

      const forkTasks = Object.assign(tasks)
      const indexToUpdate = forkTasks.findIndex((i: TaskSwapConfig) => i.sid === task.sid)
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
    const indexToUpdate = forkTasks.findIndex((i: TaskSwapConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].minAmount = e.target.value

    onTasksChange([...forkTasks])
  }

  const isError = useMemo(() => !isFirst && validateNumber(task.minAmount), [isFirst, task?.minAmount])

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center">
          {taskIcon(TaskType.MAKE_A_SWAP)}
        </Flex>
        <Text bold style={{ alignSelf: 'center' }}>
          {taskNaming(TaskType.MAKE_A_SWAP)}
        </Text>
        <DeleteOutlineIcon
          ml="auto"
          width="20px"
          height="20px"
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={onPresentDeleteModal}
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
