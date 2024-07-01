import { useTranslation } from '@pancakeswap/localization'
import { ErrorFillIcon, Flex, Text, useModal } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskLotteryConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateNumber } from 'views/DashboardQuestEdit/utils/validateFormat'

interface AddLotteryProps {
  task: TaskLotteryConfig
}

type KeyFillType = 'minAmount' | 'fromRound' | 'toRound'

export const AddLottery: React.FC<AddLotteryProps> = ({ task }) => {
  const { t } = useTranslation()
  const [isFirst, setIsFirst] = useState(true)
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, socialKeyType: KeyFillType) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLotteryConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate][socialKeyType] = e.target.value

    onTasksChange([...forkTasks])
  }

  const onClickOptional = () => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLotteryConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].isOptional = !forkTasks[indexToUpdate].isOptional

    onTasksChange([...forkTasks])
  }

  const isMinAmountError = useMemo(() => !isFirst && validateNumber(task.minAmount), [isFirst, task?.minAmount])
  const isFromRoundError = useMemo(() => !isFirst && validateNumber(task.fromRound), [isFirst, task?.fromRound])
  const isToRoundError = useMemo(() => !isFirst && validateNumber(task.toRound), [isFirst, task?.toRound])

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center" position="relative">
          {taskIcon(TaskType.PARTICIPATE_LOTTERY)}
          {task.isOptional && <StyledOptionIcon />}
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {taskNaming(TaskType.PARTICIPATE_LOTTERY)}
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
        <Flex flex="6" flexDirection="column">
          <StyledInputGroup
            endIcon={isMinAmountError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
          >
            <StyledInput
              value={task.minAmount}
              isError={isMinAmountError}
              placeholder={t('Min. ticket’s amount')}
              onChange={(e) => handleNumberChange(e, 'minAmount')}
            />
          </StyledInputGroup>
          {isMinAmountError && <InputErrorText errorText={t('Cannot be 0')} />}
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <Flex>
            <Text fontSize={14} style={{ alignSelf: 'center' }} color="textSubtle" mr="8px">
              {t('Rounds:')}
            </Text>
            <StyledInputGroup
              endIcon={isFromRoundError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
            >
              <StyledInput
                placeholder={t('From')}
                value={task.fromRound}
                isError={isFromRoundError}
                onChange={(e) => handleNumberChange(e, 'fromRound')}
              />
            </StyledInputGroup>
            <Text fontSize={14} style={{ alignSelf: 'center' }} color="textSubtle" m="0 8px 0 0">
              -
            </Text>
            <StyledInputGroup
              endIcon={isToRoundError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
            >
              <StyledInput
                placeholder={t('To')}
                value={task.toRound}
                isError={isToRoundError}
                onChange={(e) => handleNumberChange(e, 'toRound')}
              />
            </StyledInputGroup>
          </Flex>
          {(isFromRoundError || isToRoundError) && <InputErrorText errorText={t('Wrong rounds numbers')} />}
        </Flex>
      </Flex>
    </Flex>
  )
}
