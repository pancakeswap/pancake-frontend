import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { Button, ChevronDownIcon, ErrorFillIcon, Flex, FlexGap, InputGroup, Text, useModal } from '@pancakeswap/uikit'
import { CurrencySearchModal } from 'components/SearchModal/CurrencySearchModal'
import { TokenWithChain } from 'components/TokenWithChain'
import { useTokensByChainWithNativeToken } from 'hooks/useTokensByChainWithNativeToken'
import { useCallback, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskSwapConfig } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateNumber } from 'views/DashboardQuestEdit/utils/validateFormat'

const StyleSelector = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 0 8px 0 28px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
`

interface AddSwapProps {
  task: TaskSwapConfig
}

type SocialKeyType = 'description' | 'minAmount'

export const AddSwap: React.FC<AddSwapProps> = ({ task }) => {
  const { t } = useTranslation()
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)
  const [isFirst, setIsFirst] = useState(true)
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      setIsFirst(false)

      const forkTasks = Object.assign(tasks)
      const indexToUpdate = forkTasks.findIndex((i: TaskSwapConfig) => i.sid === task.sid)
      forkTasks[indexToUpdate].network = currency.chainId
      forkTasks[indexToUpdate].tokenAddress = currency.isNative ? currency.wrapped.address : currency.address
      forkTasks[indexToUpdate].title = `Make a swap at least ${task?.minAmount ?? 0} USD of ${currency?.symbol}`

      onTasksChange([...forkTasks])
    },
    [onTasksChange, task, tasks],
  )

  const tokensByChainWithNativeToken = useTokensByChainWithNativeToken(task?.network as ChainId)

  const selectedCurrency = useMemo((): Currency => {
    const findToken = tokensByChainWithNativeToken.find((i) =>
      i.isNative
        ? i.wrapped.address.toLowerCase() === task?.tokenAddress?.toLowerCase()
        : i.address.toLowerCase() === task?.tokenAddress?.toLowerCase(),
    )
    return findToken || (CAKE as any)?.[task.network]
  }, [task, tokensByChainWithNativeToken])

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal selectedCurrency={selectedCurrency} onCurrencySelect={handleCurrencySelect} />,
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, socialKeyType: SocialKeyType) => {
    setIsFirst(false)

    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskSwapConfig) => i.sid === task.sid)

    forkTasks[indexToUpdate][socialKeyType] = e.target.value
    if (socialKeyType === 'minAmount') {
      forkTasks[indexToUpdate].title = `Make a swap at least ${e?.target?.value ?? 0} USD of ${
        selectedCurrency?.symbol
      }`
    }

    onTasksChange([...forkTasks])
  }

  const onClickOptional = () => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskSwapConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].isOptional = !forkTasks[indexToUpdate].isOptional

    onTasksChange([...forkTasks])
  }

  const isError = useMemo(() => !isFirst && validateNumber(task.minAmount), [isFirst, task?.minAmount])

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center" position="relative">
          {taskIcon(TaskType.MAKE_A_SWAP)}
          {task.isOptional && <StyledOptionIcon />}
        </Flex>
        <Text bold style={{ alignSelf: 'center' }}>
          {taskNaming(TaskType.MAKE_A_SWAP)}
        </Text>
        <DropdownList
          m="auto 0px auto auto"
          id={task.sid}
          isOptional={task.isOptional}
          onClickDelete={onPresentDeleteModal}
          onClickOptional={onClickOptional}
        />
      </Flex>
      <Flex flexDirection={['column']} width="100%" mt="12px">
        <Flex flexDirection="column">
          <Flex>
            <Flex position="relative" paddingRight="45px" onClick={onPresentCurrencyModal}>
              <TokenWithChain width={32} height={32} currency={selectedCurrency} />
              <StyleSelector variant="light" scale="sm" endIcon={<ChevronDownIcon />} />
            </Flex>
            <StyledInputGroup endIcon={isError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}>
              <StyledInput
                isError={isError}
                value={task.minAmount}
                placeholder={t('Min. amount in $')}
                onChange={(e) => handleInputChange(e, 'minAmount')}
              />
            </StyledInputGroup>
          </Flex>
          <FlexGap gap="8px" flexDirection="column" mt="8px">
            <InputGroup>
              <StyledInput disabled placeholder={t('Title')} value={task.title} style={{ borderRadius: '24px' }} />
            </InputGroup>
            <StyledInput
              placeholder={t('Description (Optional)')}
              value={task.description}
              style={{ borderRadius: '24px' }}
              onChange={(e) => handleInputChange(e, 'description')}
            />
          </FlexGap>
          {isError && <InputErrorText errorText={t('Cannot be 0')} />}
        </Flex>
      </Flex>
    </Flex>
  )
}
