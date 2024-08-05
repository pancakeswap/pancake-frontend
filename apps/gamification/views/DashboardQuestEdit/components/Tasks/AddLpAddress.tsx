import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  ChevronDownIcon,
  ErrorFillIcon,
  Flex,
  OpenNewIcon,
  Text,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import { NetworkSelectorModal } from 'components/NetworkSelectorModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskLiquidityConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import {
  validateIsNotEmpty,
  validateLpAddress,
  validateNumber,
  validateUrl,
} from 'views/DashboardQuestEdit/utils/validateFormat'

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

interface AddLpAddressProps {
  task: TaskLiquidityConfig
  isDrafted: boolean
}

type SocialKeyType =
  | 'title'
  | 'description'
  | 'minAmount'
  | 'lpAddressLink'
  | 'feeTier'
  | 'lpAddress'
  | 'stakePeriodInDays'

export const AddLpAddress: React.FC<AddLpAddressProps> = ({ task, isDrafted }) => {
  const { t } = useTranslation()
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)
  const [isFirst, setIsFirst] = useState(true)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Open in new tab'), {
    placement: 'top',
  })

  const handlePickedChainId = (pickedChainId: ChainId) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLiquidityConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].network = pickedChainId

    onTasksChange([...forkTasks])
  }

  const [onPresentNetworkSelectorModal] = useModal(
    <NetworkSelectorModal pickedChainId={task.network} setPickedChainId={handlePickedChainId} />,
  )

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, socialKeyType: SocialKeyType) => {
    setIsFirst(false)

    if (e.currentTarget.validity.valid) {
      const forkTasks = Object.assign(tasks)
      const indexToUpdate = forkTasks.findIndex((i: TaskLiquidityConfig) => i.sid === task.sid)

      if (socialKeyType === 'stakePeriodInDays') {
        forkTasks[indexToUpdate][socialKeyType] = Number(e.target.value)
      } else {
        forkTasks[indexToUpdate][socialKeyType] = e.target.value
      }

      onTasksChange([...forkTasks])
    }
  }

  const onClickOptional = () => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLiquidityConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].isOptional = !forkTasks[indexToUpdate].isOptional

    onTasksChange([...forkTasks])
  }

  const onclickOpenNewIcon = () => {
    if (task.lpAddressLink) {
      window.open(task.lpAddressLink, '_blank', 'noopener noreferrer')
    }
  }

  const isMinAmountError = useMemo(() => !isFirst && validateNumber(task.minAmount), [isFirst, task?.minAmount])
  const isLpAddressError = useMemo(() => !isFirst && validateLpAddress(task.lpAddress), [isFirst, task?.lpAddress])
  const isLpAddressUrlError = useMemo(() => !isFirst && validateUrl(task.lpAddressLink), [isFirst, task?.lpAddressLink])
  const isFeeTierError = useMemo(() => !isFirst && validateIsNotEmpty(task.feeTier), [isFirst, task?.feeTier])

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center" position="relative">
          {taskIcon(TaskType.ADD_LIQUIDITY)}
          {task.isOptional && <StyledOptionIcon />}
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {taskNaming(TaskType.ADD_LIQUIDITY)}
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
      <Flex flexDirection={['column']} width="100%" mt="12px">
        <Flex flex="6" flexDirection="column">
          <Flex>
            <Flex
              position="relative"
              paddingRight="45px"
              style={{ cursor: 'pointer' }}
              onClick={onPresentNetworkSelectorModal}
            >
              <StyleNetwork style={{ backgroundImage: `url(${ASSET_CDN}/web/chains/${task.network}.png)` }} />
              <StyleSelector variant="light" scale="sm" endIcon={<ChevronDownIcon />} />
            </Flex>
            <StyledInputGroup
              endIcon={isLpAddressError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
            >
              <StyledInput
                isError={isLpAddressError}
                value={task.lpAddress}
                placeholder={t('LP address')}
                onChange={(e) => handleInputChange(e, 'lpAddress')}
              />
            </StyledInputGroup>
          </Flex>
          {isLpAddressError && <InputErrorText errorText={t('This is not an LP address')} />}
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <StyledInputGroup>
            <StyledInput placeholder={t('Title')} value={task.title} onChange={(e) => handleInputChange(e, 'title')} />
          </StyledInputGroup>
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <StyledInputGroup>
            <StyledInput
              placeholder={t('Description (Optional)')}
              value={task.description}
              onChange={(e) => handleInputChange(e, 'description')}
            />
          </StyledInputGroup>
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <StyledInputGroup
            endIcon={
              isLpAddressUrlError ? (
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
              placeholder={t('LP Address Link')}
              isError={isLpAddressUrlError}
              value={task.lpAddressLink}
              onChange={(e) => handleInputChange(e, 'lpAddressLink')}
            />
          </StyledInputGroup>
          {isLpAddressUrlError && <InputErrorText errorText={t('Enter a valid website URL')} />}
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <StyledInputGroup
            endIcon={isFeeTierError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
          >
            <StyledInput
              pattern="^[0-9]+$"
              inputMode="numeric"
              placeholder={t('Fee Tier 100,500,2500,10000')}
              isError={isFeeTierError}
              value={task.feeTier}
              onChange={(e) => handleInputChange(e, 'feeTier')}
            />
          </StyledInputGroup>
          {isFeeTierError && <InputErrorText errorText={t('Cannot be 0')} />}
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <StyledInputGroup
            endIcon={isMinAmountError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
          >
            <StyledInput
              inputMode="numeric"
              pattern="^[0-9]*[.,]?[0-9]*$"
              value={task.minAmount}
              isError={isMinAmountError}
              placeholder={t('Min. $ amount worth of liquidity')}
              onChange={(e) => handleInputChange(e, 'minAmount')}
            />
          </StyledInputGroup>
          {isMinAmountError && <InputErrorText errorText={t('Cannot be 0')} />}
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <StyledInput
            inputMode="numeric"
            pattern="^[0-9]+$"
            placeholder={t('Days to hold')}
            value={task?.stakePeriodInDays > 0 ? task?.stakePeriodInDays : ''}
            onChange={(e) => handleInputChange(e, 'stakePeriodInDays')}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
