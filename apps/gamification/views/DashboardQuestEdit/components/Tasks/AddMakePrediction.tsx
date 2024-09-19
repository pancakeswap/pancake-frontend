import { useTranslation } from '@pancakeswap/localization'
import { Flex, FlexGap, Text, useModal } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { StyledInput } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { ExpandButton } from 'views/DashboardQuestEdit/components/Tasks/ExpandButton'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskMakePredictionConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'

interface AddMakePredictionProps {
  task: TaskMakePredictionConfig
  isDrafted: boolean
}

type SocialKeyType = 'title' | 'description'

export const AddMakePrediction: React.FC<AddMakePredictionProps> = ({ task, isDrafted }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(true)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const { taskIcon, taskNaming } = useTaskInfo(false, 22)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>, socialKeyType: SocialKeyType) => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskMakePredictionConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate][socialKeyType] = e.target.value

    onTasksChange([...forkTasks])
  }

  const onClickOptional = () => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskMakePredictionConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].isOptional = !forkTasks[indexToUpdate].isOptional

    onTasksChange([...forkTasks])
  }

  const disableInput = useMemo(() => !isDrafted, [isDrafted])

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={['row']}>
        {!disableInput && <ExpandButton isExpanded={isExpanded} setIsExpanded={setIsExpanded} />}
        <Flex>
          <Flex mr="8px" alignSelf="center" position="relative">
            {taskIcon(TaskType.MAKE_PREDICTION)}
            {task.isOptional && <StyledOptionIcon />}
          </Flex>
          <Text style={{ alignSelf: 'center' }} bold>
            {taskNaming(TaskType.MAKE_PREDICTION)}
          </Text>
        </Flex>
        {isDrafted && (
          <Flex width={['fit-content']} m={['0 0 0 auto']} alignSelf="center">
            <DropdownList
              m="auto"
              id={task.sid}
              isOptional={task.isOptional}
              onClickDelete={onPresentDeleteModal}
              onClickOptional={onClickOptional}
            />
          </Flex>
        )}
      </Flex>
      {isExpanded && (
        <FlexGap gap="8px" flexDirection="column" mt="8px">
          <StyledInput
            placeholder={t('Title')}
            value={task.title}
            style={{ borderRadius: '24px' }}
            disabled={disableInput}
            onChange={(e) => handleUrlChange(e, 'title')}
          />
          <StyledInput
            placeholder={t('Description (Optional)')}
            value={task.description}
            style={{ borderRadius: '24px' }}
            disabled={disableInput}
            onChange={(e) => handleUrlChange(e, 'description')}
          />
        </FlexGap>
      )}
    </Flex>
  )
}
