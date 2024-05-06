import { useTranslation } from '@pancakeswap/localization'
import { BunnyFillIcon, DeleteOutlineIcon, Flex, Input, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'

const StyledInput = styled(Input)`
  height: 32px;
`

export const AddLottery = () => {
  const { t } = useTranslation()
  const [lpAddress, setLpAddress] = useState('')
  const [startRound, setStartRound] = useState('')
  const [endRound, setEndRound] = useState('')

  const handleLpAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLpAddress(e.target.value)
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
      <Flex flexDirection={['column', 'column', 'row']} width="100%" mt="12px">
        <Flex flex="6">
          <StyledInput value={lpAddress} onChange={handleLpAddressChange} />
        </Flex>
        <Flex flex="4" m={['8px 0 0 0', '8px 0 0 0', '0 0 0 16px']}>
          <Text fontSize={14} style={{ alignSelf: 'center' }} color="textSubtle" mr="8px">
            {t('Rounds:')}
          </Text>
          <StyledInput value={startRound} onChange={handleStartRoundChange} />
          <Text fontSize={14} style={{ alignSelf: 'center' }} color="textSubtle" m="0 4px">
            -
          </Text>
          <StyledInput value={endRound} onChange={handleEndRoundChange} />
        </Flex>
      </Flex>
    </Flex>
  )
}
