import { useTranslation } from '@pancakeswap/localization'
import { DeleteOutlineIcon, ErrorFillIcon, Flex, Text, useModal } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/Tasks/ConfirmDeleteModal'
import { TaskLotteryConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateNumber } from 'views/DashboardQuestEdit/utils/validateTask'

interface AddLotteryProps {
  task: TaskLotteryConfig
}

export const AddLottery: React.FC<AddLotteryProps> = ({ task }) => {
  const { t } = useTranslation()
  const { taskIcon, taskNaming } = useTaskInfo()
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLotteryConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].minAmount = e.target.value

    onTasksChange([...forkTasks])
  }

  const handleStartRoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLotteryConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].fromRound = e.target.value

    onTasksChange([...forkTasks])
  }

  const handleEndRoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLotteryConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].toRound = e.target.value

    onTasksChange([...forkTasks])
  }

  const isMinAmountError = useMemo(() => validateNumber(task.minAmount), [task?.minAmount])
  const isFromRoundError = useMemo(() => validateNumber(task.fromRound), [task?.fromRound])
  const isToRoundError = useMemo(() => validateNumber(task.toRound), [task?.toRound])

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center">
          {taskIcon(TaskType.PARTICIPATE_LOTTERY)}
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {taskNaming(TaskType.PARTICIPATE_LOTTERY)}
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
        <Flex flex="6" flexDirection="column">
          <StyledInputGroup
            endIcon={isMinAmountError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
          >
            <StyledInput
              value={task.minAmount}
              isError={isMinAmountError}
              placeholder={t('Min. ticket’s amount')}
              onChange={handleTotalChange}
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
                onChange={handleStartRoundChange}
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
                onChange={handleEndRoundChange}
              />
            </StyledInputGroup>
          </Flex>
          {(isFromRoundError || isToRoundError) && <InputErrorText errorText={t('Wrong rounds numbers')} />}
        </Flex>
      </Flex>
    </Flex>
  )
}
