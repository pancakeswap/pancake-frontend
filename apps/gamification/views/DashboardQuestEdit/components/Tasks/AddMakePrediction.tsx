import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  ChevronDownIcon,
  ErrorFillIcon,
  Flex,
  FlexGap,
  InputGroup,
  OpenNewIcon,
  Text,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import { NetworkSelectorModal } from 'components/NetworkSelectorModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { predictionTaskSupportChains } from 'config/supportedChain'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { InputErrorText, StyledInput } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { ExpandButton } from 'views/DashboardQuestEdit/components/Tasks/ExpandButton'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskMakePredictionConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateIsNotEmpty, validateUrl } from 'views/DashboardQuestEdit/utils/validateFormat'

const StyleSelector = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 0 8px 0 28px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
`

const StyleNetwork = styled(Flex)`
  position: relative;
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-size: contain;
`

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

  const handlePickedChainId = (pickedChainId: ChainId) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskMakePredictionConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].network = pickedChainId

    onTasksChange([...forkTasks])
  }

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)
  const [onPresentNetworkSelectorModal] = useModal(
    <NetworkSelectorModal
      pickedChainId={task.network}
      customSupportChains={predictionTaskSupportChains}
      setPickedChainId={handlePickedChainId}
    />,
  )

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

  const isTitleError = useMemo(() => !isFirst && validateIsNotEmpty(task.title), [isFirst, task.title])
  const isUrlError = useMemo(() => !isFirst && validateUrl(task.link), [isFirst, task?.link])

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={['row']}>
        {!disableInput && <ExpandButton isExpanded={isExpanded} setIsExpanded={setIsExpanded} />}
        <Flex>
          <Flex mr="8px" alignSelf="center" position="relative">
            {taskIcon(TaskType.MAKE_A_PREDICTION)}
            {task.isOptional && <StyledOptionIcon />}
          </Flex>
          <Text style={{ alignSelf: 'center' }} bold>
            {taskNaming(TaskType.MAKE_A_PREDICTION)}
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
          <Flex width="100%">
            <Flex
              position="relative"
              paddingRight="45px"
              style={{ cursor: 'pointer' }}
              onClick={onPresentNetworkSelectorModal}
            >
              <StyleNetwork style={{ backgroundImage: `url(${ASSET_CDN}/web/chains/${task.network}.png)` }} />
              <StyleSelector variant="light" scale="sm" endIcon={<ChevronDownIcon />} />
            </Flex>
            <Flex flexDirection="column" width="100%">
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
                  placeholder={taskInputPlaceholder(TaskType.MAKE_A_PREDICTION)}
                  onChange={(e) => handleUrlChange(e, 'link')}
                />
              </InputGroup>
              {isUrlError && <InputErrorText errorText={t('Enter a valid website URL')} />}
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <InputGroup endIcon={isTitleError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}>
              <StyledInput
                placeholder={t('Title')}
                value={task.title}
                isError={isTitleError}
                disabled={disableInput}
                style={{ borderRadius: '24px' }}
                onChange={(e) => handleUrlChange(e, 'title')}
              />
            </InputGroup>
            {isTitleError && <InputErrorText errorText={t('Title is empty')} />}
          </Flex>
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
