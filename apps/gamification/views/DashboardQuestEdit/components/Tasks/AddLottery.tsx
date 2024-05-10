import { useTranslation } from '@pancakeswap/localization'
import { DeleteOutlineIcon, ErrorFillIcon, Flex, Text, useModal } from '@pancakeswap/uikit'
import { useState } from 'react'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/Tasks/ConfirmDeleteModal'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'

export const AddLottery = () => {
  const { t } = useTranslation()
  const [total, setTotal] = useState('')
  const { taskIcon, taskNaming } = useTaskInfo()
  const [startRound, setStartRound] = useState('')
  const [endRound, setEndRound] = useState('')
  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal />)

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(e.target.value)
  }

  const handleStartRoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartRound(e.target.value)
  }

  const handleEndRoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndRound(e.target.value)
  }

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center">
          {taskIcon(TaskType.PARTICIPATE_LOTTERY)}
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {taskNaming(TaskType.PARTICIPATE_LOTTERY)}
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
          <StyledInputGroup endIcon={<ErrorFillIcon color="failure" width={16} height={16} />}>
            <StyledInput isError placeholder={t('Min. ticket’s amount')} value={total} onChange={handleTotalChange} />
          </StyledInputGroup>
          <InputErrorText errorText={t('Cannot be 0')} />
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <Flex>
            <Text fontSize={14} style={{ alignSelf: 'center' }} color="textSubtle" mr="8px">
              {t('Rounds:')}
            </Text>
            <StyledInputGroup endIcon={<ErrorFillIcon color="failure" width={16} height={16} />}>
              <StyledInput isError placeholder={t('From')} value={startRound} onChange={handleStartRoundChange} />
            </StyledInputGroup>
            <Text fontSize={14} style={{ alignSelf: 'center' }} color="textSubtle" m="0 4px">
              -
            </Text>
            <StyledInputGroup endIcon={<ErrorFillIcon color="failure" width={16} height={16} />}>
              <StyledInput isError placeholder={t('To')} value={endRound} onChange={handleEndRoundChange} />
            </StyledInputGroup>
          </Flex>
          <InputErrorText errorText={t('Wrong rounds numbers')} />
        </Flex>
      </Flex>
    </Flex>
  )
}
