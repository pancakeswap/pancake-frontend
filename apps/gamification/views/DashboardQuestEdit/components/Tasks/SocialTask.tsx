import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  DeleteOutlineIcon,
  ErrorFillIcon,
  Flex,
  InputGroup,
  OpenNewIcon,
  Text,
  useMatchBreakpoints,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { InputErrorText, StyledInput } from 'views/DashboardQuestEdit/components/InputStyle'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/Tasks/ConfirmDeleteModal'
import { TaskSocialConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateUrl } from 'views/DashboardQuestEdit/utils/validateTask'

interface SocialTaskProps {
  task: TaskSocialConfig
}

export const SocialTask: React.FC<SocialTaskProps> = ({ task }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const social = TaskType.X_LINK_POST
  const { taskIcon, taskNaming, taskInputPlaceholder } = useTaskInfo()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Open in new tab'), {
    placement: 'top',
  })

  const onclickOpenNewIcon = () => {
    window.open(task.socialLink, '_blank', 'noopener noreferrer')
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskSocialConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].socialLink = e.target.value

    onTasksChange([...forkTasks])
  }

  const isUrlError = useMemo(() => validateUrl(task.socialLink), [task?.socialLink])

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={['column', 'column', 'row']}>
        <Flex>
          <Flex mr="8px" alignSelf="center">
            {taskIcon(social)}
          </Flex>
          <Text style={{ alignSelf: 'center' }} bold>
            {taskNaming(social)}
          </Text>
          {isMobile && (
            <DeleteOutlineIcon
              ml="auto"
              width="20px"
              height="20px"
              color="primary"
              style={{ cursor: 'pointer' }}
              onClick={onPresentDeleteModal}
            />
          )}
        </Flex>
        <Flex width={['100%', '100%', 'fit-content']} m={['8px 0 0 0', '8px 0 0 0', '0 0 0 auto']} alignSelf="center">
          <InputGroup
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
              value={task.socialLink}
              isError={isUrlError}
              style={{ borderRadius: '24px' }}
              placeholder={taskInputPlaceholder(social)}
              onChange={handleUrlChange}
            />
          </InputGroup>
          {!isMobile && (
            <DeleteOutlineIcon
              ml="8px"
              width="20px"
              height="20px"
              color="primary"
              style={{ cursor: 'pointer' }}
              onClick={onPresentDeleteModal}
            />
          )}
        </Flex>
      </Flex>
      {isUrlError && <InputErrorText errorText={t('Enter a valid website URL')} />}
    </Flex>
  )
}
