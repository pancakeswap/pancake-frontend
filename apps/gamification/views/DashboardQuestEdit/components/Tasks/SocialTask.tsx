import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  DeleteOutlineIcon,
  Flex,
  Input,
  InputGroup,
  OpenNewIcon,
  Text,
  useMatchBreakpoints,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/Tasks/ConfirmDeleteModal'
import { TaskSocialConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'

const StyledInput = styled(Input)`
  height: 32px;
`

interface SocialTaskProps {
  task: TaskSocialConfig
}

export const SocialTask: React.FC<SocialTaskProps> = ({ task }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [urlLink, setUrlLink] = useState('https://google.com')
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const social = TaskType.X_LINK_POST
  const { taskIcon, taskNaming, taskInputPlaceholder } = useTaskInfo()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Open in new tab'), {
    placement: 'top',
  })

  const onclickOpenNewIcon = () => {
    window.open(urlLink, '_blank', 'noopener noreferrer')
  }

  return (
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
            <Box ref={targetRef} onClick={onclickOpenNewIcon}>
              <OpenNewIcon style={{ cursor: 'pointer' }} color="primary" width="20px" />
              {tooltipVisible && tooltip}
            </Box>
          }
        >
          <StyledInput
            value={urlLink}
            style={{ borderRadius: '24px' }}
            placeholder={taskInputPlaceholder(social)}
            onChange={(e) => setUrlLink(e.target.value)}
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
  )
}
