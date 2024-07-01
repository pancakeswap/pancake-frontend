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
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskSocialConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { validateIsNotEmpty, validateUrl } from 'views/DashboardQuestEdit/utils/validateFormat'

interface SocialTaskProps {
  task: TaskSocialConfig
}

type SocialKeyType = 'title' | 'description' | 'accountId' | 'socialLink'

export const SocialTask: React.FC<SocialTaskProps> = ({ task }) => {
  const { t } = useTranslation()
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>, socialKeyType: SocialKeyType) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskSocialConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate][socialKeyType] = e.target.value

    onTasksChange([...forkTasks])
  }

  const onClickOptional = () => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskSocialConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].isOptional = !forkTasks[indexToUpdate].isOptional

    onTasksChange([...forkTasks])
  }

  const isTitleError = useMemo(() => !isFirst && validateIsNotEmpty(task.title), [isFirst, task.title])
  const isAccountIdError = useMemo(() => !isFirst && validateIsNotEmpty(task.accountId), [isFirst, task.accountId])
  const isUrlError = useMemo(() => !isFirst && validateUrl(task.socialLink), [isFirst, task?.socialLink])

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={['row']}>
        <Flex minWidth="200px">
          <Flex mr="8px" alignSelf="center" position="relative">
            {taskIcon(social)}
            {task.isOptional && <StyledOptionIcon />}
          </Flex>
          <Text style={{ alignSelf: 'center' }} bold>
            {taskNaming(social)}
          </Text>
        </Flex>
        <Flex width={['fit-content']} m={['0 0 0 auto']} alignSelf="center">
          <DropdownList
            m="auto"
            id={task.sid}
            isOptional={task.isOptional}
            onClickDelete={onPresentDeleteModal}
            onClickOptional={onClickOptional}
          />
        </Flex>
      </Flex>
      <FlexGap gap="8px" flexDirection="column" mt="8px">
        <InputGroup endIcon={isTitleError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}>
          <StyledInput
            placeholder={t('Title')}
            value={task.title}
            isError={isTitleError}
            style={{ borderRadius: '24px' }}
            onChange={(e) => handleUrlChange(e, 'title')}
          />
        </InputGroup>
        <StyledInput
          placeholder={t('Description (Optional)')}
          value={task.description}
          style={{ borderRadius: '24px' }}
          onChange={(e) => handleUrlChange(e, 'description')}
        />
        <InputGroup
          endIcon={
            isAccountIdError ? (
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
            value={task.accountId}
            isError={isAccountIdError}
            style={{ borderRadius: '24px' }}
            placeholder={t('Account Id')}
            onChange={(e) => handleUrlChange(e, 'accountId')}
          />
        </InputGroup>
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
            onChange={(e) => handleUrlChange(e, 'socialLink')}
          />
        </InputGroup>
      </FlexGap>
      {isTitleError && <InputErrorText errorText={t('Title is empty')} />}
      {isAccountIdError && <InputErrorText errorText={t('Account id is empty')} />}
      {isUrlError && <InputErrorText errorText={t('Enter a valid website URL')} />}
    </Flex>
  )
}
