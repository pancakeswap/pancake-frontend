import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { Button, ChevronDownIcon, DeleteOutlineIcon, ErrorFillIcon, Flex, Text, useModal } from '@pancakeswap/uikit'
import { CurrencySearchModal } from 'components/SearchModal/CurrencySearchModal'
import { TokenWithChain } from 'components/TokenWithChain'
import { useCallback, useState } from 'react'
import { styled } from 'styled-components'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/Tasks/ConfirmDeleteModal'
import { TaskType, useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'

const StyleSelector = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 0 8px 0 28px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
`

export const AddSwap = () => {
  const { t } = useTranslation()
  const { taskIcon, taskNaming } = useTaskInfo()
  const [total, setTotal] = useState('')
  const defaultCurrency = (CAKE as any)?.[ChainId.BSC]
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(defaultCurrency)

  const handleCurrencySelect = useCallback((currency: Currency) => {
    setSelectedCurrency(currency)
  }, [])

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal selectedCurrency={selectedCurrency} onCurrencySelect={handleCurrencySelect} />,
  )

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal />)

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(e.target.value)
  }

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center">
          {taskIcon(TaskType.MAKE_A_SWAP)}
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {taskNaming(TaskType.MAKE_A_SWAP)}
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
        <Flex flexDirection="column">
          <Flex>
            <Flex position="relative" paddingRight="45px" onClick={onPresentCurrencyModal}>
              <TokenWithChain width={32} height={32} currency={selectedCurrency} />
              <StyleSelector variant="light" scale="sm" endIcon={<ChevronDownIcon />} />
            </Flex>
            <StyledInputGroup endIcon={<ErrorFillIcon color="failure" width={16} height={16} />}>
              <StyledInput isError value={total} placeholder={t('Min. amount in $')} onChange={handleTotalChange} />
            </StyledInputGroup>
          </Flex>
          <InputErrorText errorText={t('Cannot be 0')} />
        </Flex>
      </Flex>
    </Flex>
  )
}
