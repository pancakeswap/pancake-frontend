import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  ErrorFillIcon,
  Flex,
  InputGroup,
  OpenNewIcon,
  Text,
  useMatchBreakpoints,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { InputErrorText, StyledInput } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskSocialConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { validateIsNotEmpty, validateUrl } from 'views/DashboardQuestEdit/utils/validateTask'

interface SocialTaskProps {
  task: TaskSocialConfig
}

type SocialInputType = 'socialLink' | 'accountId'

export const SocialTask: React.FC<SocialTaskProps> = ({ task }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [isFirst, setIsFirst] = useState(true)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const social = task.taskType
  const { taskIcon, taskNaming, taskInputPlaceholder } = useTaskInfo(false, 22)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Open in new tab'), {
    placement: 'top',
  })

  const onclickOpenNewIcon = () => {
    window.open(task.socialLink, '_blank', 'noopener noreferrer')
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>, type: SocialInputType) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskSocialConfig) => i.sid === task.sid)
    if (type === 'socialLink') {
      forkTasks[indexToUpdate].socialLink = e.target.value
    } else {
      forkTasks[indexToUpdate].accountId = e.target.value
    }

    onTasksChange([...forkTasks])
  }

  const onClickOptional = () => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskSocialConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].isOptional = !forkTasks[indexToUpdate].isOptional

    onTasksChange([...forkTasks])
  }

  const isUrlError = useMemo(() => !isFirst && validateUrl(task.socialLink), [isFirst, task?.socialLink])
  const isAccountError = useMemo(() => !isFirst && validateIsNotEmpty(task.accountId), [isFirst, task?.accountId])

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={['column', 'column', 'row']}>
        <Flex minWidth="200px">
          <Flex mr="8px" alignSelf="center" position="relative">
            {taskIcon(social)}
            {task.isOptional && <StyledOptionIcon />}
          </Flex>
          <Text style={{ alignSelf: 'center' }} bold>
            {taskNaming(social)}
          </Text>
          {isMobile && (
            <DropdownList
              m="auto 0px auto auto"
              id={task.sid}
              isOptional={task.isOptional}
              onClickDelete={onPresentDeleteModal}
              onClickOptional={onClickOptional}
            />
          )}
        </Flex>
        <Flex alignSelf="center" width={['100%']} flexDirection={['column', 'column', 'row']}>
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
              value={task.socialLink}
              isError={isUrlError}
              style={{ borderRadius: '24px' }}
              placeholder={taskInputPlaceholder(social)}
              onChange={(e) => handleUrlChange(e, 'socialLink')}
            />
          </InputGroup>
          <StyledInput
            value={task.accountId}
            isError={isAccountError}
            style={{ borderRadius: '24px' }}
            placeholder={t('Account ID')}
            onChange={(e) => handleUrlChange(e, 'accountId')}
          />
          {!isMobile && (
            <DropdownList
              m="auto auto auto 8px"
              id={task.sid}
              isOptional={task.isOptional}
              onClickDelete={onPresentDeleteModal}
              onClickOptional={onClickOptional}
            />
          )}
        </Flex>
      </Flex>
      {isUrlError && <InputErrorText errorText={t('Enter a valid website URL')} />}
      {isAccountError && <InputErrorText errorText={t('Enter Account Id')} />}
    </Flex>
  )
}
