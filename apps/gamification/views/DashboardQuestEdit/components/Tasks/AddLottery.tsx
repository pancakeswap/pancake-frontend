import { useTranslation } from '@pancakeswap/localization'
import { BunnyFillIcon, DeleteOutlineIcon, Flex, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import {
  ErrorIcon,
  InputErrorText,
  StyledInput,
  StyledInputGroup,
} from 'views/DashboardQuestEdit/components/InputStyle'

export const AddLottery = () => {
  const { t } = useTranslation()
  const [total, setTotal] = useState('')
  const [startRound, setStartRound] = useState('')
  const [endRound, setEndRound] = useState('')

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
          <BunnyFillIcon color="#7A6EAA" width="20px" height="20px" />
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {t('Participate in a lottery')}
        </Text>
        <DeleteOutlineIcon style={{ cursor: 'pointer' }} color="primary" width="20px" height="20px" ml="auto" />
      </Flex>
      <Flex flexDirection={['column']} width="100%" mt="12px">
        <Flex flex="6" flexDirection="column">
          <StyledInputGroup endIcon={<ErrorIcon />}>
            <StyledInput isError placeholder={t('Min. amount in $')} value={total} onChange={handleTotalChange} />
          </StyledInputGroup>
          <InputErrorText errorText={t('Cannot be 0')} />
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <Flex>
            <Text fontSize={14} style={{ alignSelf: 'center' }} color="textSubtle" mr="8px">
              {t('Rounds:')}
            </Text>
            <StyledInputGroup endIcon={<ErrorIcon />}>
              <StyledInput isError placeholder={t('From')} value={startRound} onChange={handleStartRoundChange} />
            </StyledInputGroup>
            <Text fontSize={14} style={{ alignSelf: 'center' }} color="textSubtle" m="0 4px">
              -
            </Text>
            <StyledInputGroup endIcon={<ErrorIcon />}>
              <StyledInput isError placeholder={t('To')} value={endRound} onChange={handleEndRoundChange} />
            </StyledInputGroup>
          </Flex>
          <InputErrorText errorText={t('Wrong rounds numbers')} />
        </Flex>
      </Flex>
    </Flex>
  )
}
