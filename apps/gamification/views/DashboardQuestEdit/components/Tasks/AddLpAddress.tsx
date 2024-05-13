import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Button, ChevronDownIcon, DeleteOutlineIcon, ErrorFillIcon, Flex, Text, useModal } from '@pancakeswap/uikit'
import { NetworkSelectorModal } from 'components/NetworkSelectorModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/Tasks/ConfirmDeleteModal'
import { TaskLiquidityConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateLpAddress, validateNumber } from 'views/DashboardQuestEdit/utils/validateTask'

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
}

export const AddLpAddress: React.FC<AddLpAddressProps> = ({ task }) => {
  const { t } = useTranslation()
  const { taskIcon, taskNaming } = useTaskInfo()
  const [isFirst, setIsFirst] = useState(true)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

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

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLiquidityConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].minAmount = e.target.value

    onTasksChange([...forkTasks])
  }

  const handleLpAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskLiquidityConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].lpAddress = e.target.value

    onTasksChange([...forkTasks])
  }

  const isMinAmountError = useMemo(() => !isFirst && validateNumber(task.minAmount), [isFirst, task?.minAmount])
  const isLpAddressError = useMemo(() => !isFirst && validateLpAddress(task.lpAddress), [isFirst, task?.lpAddress])

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center">
          {taskIcon(TaskType.ADD_LIQUIDITY)}
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {taskNaming(TaskType.ADD_LIQUIDITY)}
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
                placeholder={t('LP address link')}
                pattern="^(0x[a-fA-F0-9]{40})$"
                onChange={handleLpAddressChange}
              />
            </StyledInputGroup>
          </Flex>
          {isLpAddressError && <InputErrorText errorText={t('This is not an LP address link')} />}
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <StyledInputGroup
            endIcon={isMinAmountError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
          >
            <StyledInput
              value={task.minAmount}
              isError={isMinAmountError}
              placeholder={t('Min. amount in $')}
              onChange={handleTotalChange}
            />
          </StyledInputGroup>
          {isMinAmountError && <InputErrorText errorText={t('Cannot be 0')} />}
        </Flex>
      </Flex>
    </Flex>
  )
}
