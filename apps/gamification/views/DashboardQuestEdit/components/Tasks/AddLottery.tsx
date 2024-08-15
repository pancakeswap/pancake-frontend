import { useTranslation } from '@pancakeswap/localization'
import { ErrorFillIcon, Flex, FlexGap, Text, useModal } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { ExpandButton } from 'views/DashboardQuestEdit/components/Tasks/ExpandButton'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskLotteryConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateNumber } from 'views/DashboardQuestEdit/utils/validateFormat'

interface AddLotteryProps {
  task: TaskLotteryConfig
  isDrafted: boolean
}

type KeyFillType = 'minAmount' | 'fromRound' | 'toRound' | 'title' | 'description'

export const AddLottery: React.FC<AddLotteryProps> = ({ task, isDrafted }) => {
  const { t } = useTranslation()
  const [isFirst, setIsFirst] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, socialKeyType: KeyFillType) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLotteryConfig) => i.sid === task.sid)
    if (socialKeyType === 'title' || socialKeyType === 'description') {
      forkTasks[indexToUpdate][socialKeyType] = e.target.value
    } else {
      forkTasks[indexToUpdate][socialKeyType] = Number(e.target.value)
    }

    onTasksChange([...forkTasks])
  }

  const onClickOptional = () => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLotteryConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].isOptional = !forkTasks[indexToUpdate].isOptional

    onTasksChange([...forkTasks])
  }

  const disableInput = useMemo(() => !isDrafted, [isDrafted])

  const isMinAmountError = useMemo(
    () => !isFirst && validateNumber(task?.minAmount?.toString()),
    [isFirst, task?.minAmount],
  )
  const isFromRoundError = useMemo(
    () => !isFirst && validateNumber(task?.fromRound?.toString()),
    [isFirst, task?.fromRound],
  )
  const isToRoundError = useMemo(() => !isFirst && validateNumber(task?.toRound?.toString()), [isFirst, task?.toRound])

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        {!disableInput && <ExpandButton isExpanded={isExpanded} setIsExpanded={setIsExpanded} />}
        <Flex mr="8px" alignSelf="center" position="relative">
          {taskIcon(TaskType.PARTICIPATE_LOTTERY)}
          {task.isOptional && <StyledOptionIcon />}
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {taskNaming(TaskType.PARTICIPATE_LOTTERY)}
        </Text>
        {isDrafted && (
          <DropdownList
            m="auto 0px auto auto"
            id={task.sid}
            isOptional={task.isOptional}
            onClickDelete={onPresentDeleteModal}
            onClickOptional={onClickOptional}
          />
        )}
      </Flex>
      {isExpanded && (
        <FlexGap gap="8px" flexDirection="column" mt="12px">
          <Flex flexDirection="column">
            <StyledInputGroup
              endIcon={isMinAmountError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
            >
              <StyledInput
                pattern="^[0-9]+$"
                inputMode="numeric"
                value={task.minAmount}
                isError={isMinAmountError}
                disabled={disableInput}
                placeholder={t('Min. ticket’s amount')}
                onChange={(e) => handleInputChange(e, 'minAmount')}
              />
            </StyledInputGroup>
            {isMinAmountError && <InputErrorText errorText={t('Cannot be 0')} />}
          </Flex>
          <Flex flexDirection="column">
            <Flex>
              <Text fontSize={14} style={{ alignSelf: 'center' }} color="textSubtle" mr="8px">
                {t('Rounds:')}
              </Text>
              <StyledInputGroup
                endIcon={isFromRoundError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
              >
                <StyledInput
                  placeholder={t('From')}
                  pattern="^[0-9]+$"
                  inputMode="numeric"
                  value={task.fromRound}
                  disabled={disableInput}
                  isError={isFromRoundError}
                  onChange={(e) => handleInputChange(e, 'fromRound')}
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
                  pattern="^[0-9]+$"
                  inputMode="numeric"
                  value={task.toRound}
                  isError={isToRoundError}
                  disabled={disableInput}
                  onChange={(e) => handleInputChange(e, 'toRound')}
                />
              </StyledInputGroup>
            </Flex>
            {(isFromRoundError || isToRoundError) && <InputErrorText errorText={t('Wrong rounds numbers')} />}
          </Flex>
          <StyledInput
            placeholder={t('Title')}
            value={task.description}
            style={{ borderRadius: '24px' }}
            onChange={(e) => handleInputChange(e, 'title')}
          />
          <StyledInput
            placeholder={t('Description (Optional)')}
            value={task.description}
            style={{ borderRadius: '24px' }}
            disabled={disableInput}
            onChange={(e) => handleInputChange(e, 'description')}
          />
        </FlexGap>
      )}
    </Flex>
  )
}
