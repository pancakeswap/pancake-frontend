import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, ErrorFillIcon, Flex, FlexGap, InputGroup, Text, useModal } from '@pancakeswap/uikit'
import { getDecimalAmount, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { CurrencySearchModal } from 'components/SearchModal/CurrencySearchModal'
import { TokenWithChain } from 'components/TokenWithChain'
import { ADDRESS_ZERO } from 'config/constants'
import { useFindTokens } from 'hooks/useFindTokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { Address } from 'viem'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { DropdownList } from 'views/DashboardQuestEdit/components/Tasks/DropdownList'
import { ExpandButton } from 'views/DashboardQuestEdit/components/Tasks/ExpandButton'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskHoldTokenConfig } from 'views/DashboardQuestEdit/context/types'
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

interface AddHoldTokenProps {
  task: TaskHoldTokenConfig
  isDrafted: boolean
}

type SocialKeyType = 'title' | 'description' | 'minAmount' | 'minHoldDays'

export const AddHoldToken: React.FC<AddHoldTokenProps> = ({ task, isDrafted }) => {
  const { t } = useTranslation()
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)
  const [isFirst, setIsFirst] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const [minAmount, setMinAmount] = useState('')
  const { tasks, onTasksChange, deleteTask } = useQuestEdit()

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={() => deleteTask(task.sid)} />)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      setIsFirst(false)

      const forkTasks = Object.assign(tasks)
      const indexToUpdate = forkTasks.findIndex((i: TaskHoldTokenConfig) => i.sid === task.sid)
      forkTasks[indexToUpdate].network = currency.chainId
      forkTasks[indexToUpdate].tokenAddress = currency.isNative ? ADDRESS_ZERO : currency.address
      forkTasks[indexToUpdate].title = `Hold at least ${minAmount ?? 0} ${currency?.symbol}`

      onTasksChange([...forkTasks])
    },
    [task, minAmount, tasks, onTasksChange],
  )

  const selectedCurrency = useFindTokens(task?.network as ChainId, task?.tokenAddress as Address)

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal selectedCurrency={selectedCurrency} onCurrencySelect={handleCurrencySelect} />,
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, socialKeyType: SocialKeyType) => {
    setIsFirst(false)

    if (e.currentTarget.validity.valid) {
      const forkTasks = Object.assign(tasks)
      const indexToUpdate = forkTasks.findIndex((i: TaskHoldTokenConfig) => i.sid === task.sid)
      forkTasks[indexToUpdate][socialKeyType] = e.target.value

      if (socialKeyType === 'minAmount') {
        setMinAmount(e.target.value)
        forkTasks[indexToUpdate][socialKeyType] = getDecimalAmount(
          new BigNumber(e.target.value),
          selectedCurrency.decimals,
        ).toString()

        forkTasks[indexToUpdate].title = `Hold at least ${e?.target?.value ?? 0} ${selectedCurrency?.symbol}`
      } else if (socialKeyType === 'minHoldDays') {
        const value = Number(e.target.value)
        forkTasks[indexToUpdate][socialKeyType] = value > 0 ? value : ''
      } else {
        forkTasks[indexToUpdate][socialKeyType] = e.target.value
      }

      onTasksChange([...forkTasks])
    }
  }

  const onClickOptional = () => {
    const forkTasks = Object.assign(tasks)
    const indexToUpdate = forkTasks.findIndex((i: TaskHoldTokenConfig) => i.sid === task.sid)
    forkTasks[indexToUpdate].isOptional = !forkTasks[indexToUpdate].isOptional

    onTasksChange([...forkTasks])
  }

  const disableInput = useMemo(() => !isDrafted, [isDrafted])

  const isError = useMemo(
    () => !isFirst && validateNumber(task.minAmount === 'NaN' ? '0' : task.minAmount),
    [isFirst, task?.minAmount],
  )

  const isMinHoldDaysError = useMemo(
    () => !isFirst && validateNumber(task.minHoldDays.toString()),
    [isFirst, task?.minHoldDays],
  )

  useEffect(() => {
    if (task.minAmount) {
      setMinAmount(getFullDisplayBalance(new BigNumber(task.minAmount), selectedCurrency.decimals).toString())
    }
  }, [task?.minAmount, selectedCurrency?.decimals])

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        {!disableInput && <ExpandButton isExpanded={isExpanded} setIsExpanded={setIsExpanded} />}
        <Flex mr="8px" alignSelf="center" position="relative">
          {taskIcon(TaskType.HOLD_A_TOKEN)}
          {task.isOptional && <StyledOptionIcon />}
        </Flex>
        <Text bold style={{ alignSelf: 'center' }}>
          {taskNaming(TaskType.HOLD_A_TOKEN)}
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
      {isExpanded && (
        <Flex flexDirection={['column']} width="100%" mt="12px">
          <Flex flexDirection="column">
            <Flex flexDirection={['column', 'column', 'row']}>
              <Flex width="100%">
                <Flex position="relative" paddingRight="45px" onClick={onPresentCurrencyModal}>
                  <TokenWithChain width={32} height={32} currency={selectedCurrency} />
                  <StyleSelector variant="light" scale="sm" endIcon={<ChevronDownIcon />} />
                </Flex>
                <Flex width="100%" flexDirection="column">
                  <StyledInputGroup
                    endIcon={isError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
                  >
                    <StyledInput
                      inputMode="numeric"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      isError={isError}
                      value={minAmount}
                      disabled={disableInput}
                      placeholder={t('Minimum no. of token')}
                      onChange={(e) => handleInputChange(e, 'minAmount')}
                    />
                  </StyledInputGroup>
                  {isError && <InputErrorText errorText={t('Cannot be 0')} />}
                </Flex>
              </Flex>
              <Flex width={['100%', '100%', '80%']} m={['8px 0 0 0', '8px 0 0 0', '0 0 0 8px']} flexDirection="column">
                <StyledInputGroup
                  endIcon={isMinHoldDaysError ? <ErrorFillIcon color="failure" width={16} height={16} /> : undefined}
                >
                  <StyledInput
                    inputMode="numeric"
                    pattern="^[0-9]+$"
                    placeholder={t('Days to hold')}
                    isError={isMinHoldDaysError}
                    value={task.minHoldDays}
                    disabled={disableInput}
                    onChange={(e) => handleInputChange(e, 'minHoldDays')}
                  />
                </StyledInputGroup>
                {isMinHoldDaysError && <InputErrorText errorText={t('Days to hold cannot be 0')} />}
              </Flex>
            </Flex>
            <FlexGap gap="8px" flexDirection="column" mt="8px">
              <InputGroup>
                <StyledInput
                  placeholder={t('Title')}
                  value={task.title}
                  disabled={disableInput}
                  style={{ borderRadius: '24px' }}
                  onChange={(e) => handleInputChange(e, 'title')}
                />
              </InputGroup>
              <StyledInput
                placeholder={t('Description (Optional)')}
                value={task.description}
                disabled={disableInput}
                style={{ borderRadius: '24px' }}
                onChange={(e) => handleInputChange(e, 'description')}
              />
            </FlexGap>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
