import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import RoundSelect, { RoundOptionProps } from '../Select/RoundSelect'

interface PastLotterySearcherProps {
  initialLotteryNumber: number
  onSubmit: (num: number) => void
}

const Wrapper = styled.div`
  margin-bottom: 24px;
`

const PastLotterySearcher: React.FC<PastLotterySearcherProps> = ({ initialLotteryNumber, onSubmit }) => {
  const TranslateString = useI18n()

  const rounds = Array.from(Array(initialLotteryNumber))
    .map((_, i) => {
      return {
        label: `Round ${i + 1}`,
        value: i + 1,
      }
    })
    .reverse()

  const handleSortOptionChange = (option: RoundOptionProps): void => {
    onSubmit(option.value)
  }

  return (
    <Wrapper>
      <Text>{TranslateString(742, 'Select lottery round:')}</Text>
      <RoundSelect options={rounds} onChange={handleSortOptionChange} />
    </Wrapper>
  )
}

export default PastLotterySearcher
