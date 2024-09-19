import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  ErrorFillIcon,
  Flex,
  FlexGap,
  InputGroup,
  OpenNewIcon,
  Text,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { InputErrorText, StyledInput } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { ExpandButton } from 'views/DashboardQuestEdit/components/Tasks/ExpandButton'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskMakePredictionConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateUrl } from 'views/DashboardQuestEdit/utils/validateFormat'

interface AddMakePredictionProps {
  task: TaskMakePredictionConfig
  isDrafted: boolean
}

type SocialKeyType = 'title' | 'description' | 'link'

export const AddMakePrediction: React.FC<AddMakePredictionProps> = ({ task, isDrafted }) => {
  const { t } = useTranslation()
  const [isFirst, setIsFirst] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const { taskIcon, taskNaming, taskInputPlaceholder } = useTaskInfo(false, 22)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Open in new tab'), {
    placement: 'top',
  })

  const onclickOpenNewIcon = () => {
    if (task.link) {
      window.open(task.link, '_blank', 'noopener noreferrer')
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>, socialKeyType: SocialKeyType) => {
    setIsFirst(false)

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

  const isUrlError = useMemo(() => !isFirst && validateUrl(task.link), [isFirst, task?.link])

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
          <Flex flexDirection="column">
            <InputGroup
              m={['8px 0', '8px 0', '0 8px 0 0']}
              endIcon={
                isUrlError ? (
                  <ErrorFillIcon color="failure" width={16} height={16} />
                ) : (
                  <Box ref={targetRef} onClick={onclickOpenNewIcon}>
                    <OpenNewIcon style={{ cursor: 'pointer' }} color="primary" width="20px" />
                    {tooltipVisible && tooltip}
                  </Box>
                )
              }
            >
              <StyledInput
                value={task.link}
                isError={isUrlError}
                style={{ borderRadius: '24px' }}
                disabled={disableInput}
                placeholder={taskInputPlaceholder(TaskType.MAKE_PREDICTION)}
                onChange={(e) => handleUrlChange(e, 'link')}
              />
            </InputGroup>
            {isUrlError && <InputErrorText errorText={t('Enter a valid website URL')} />}
          </Flex>
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
