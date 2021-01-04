import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Input, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface PastLotterySearcherProps {
  initialLotteryNumber: number
  onSubmit: (num: number) => void
}

const Wrapper = styled.div`
  margin-bottom: 24px;
`

const SearchWrapper = styled.div`
  position: relative;
`

const StyledButton = styled(Button).attrs({ type: 'submit' })`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translate(0%, -50%);
  width: auto;
`

const PastLotterySearcher: React.FC<PastLotterySearcherProps> = ({ initialLotteryNumber, onSubmit }) => {
  const [lotteryNumber, setLotteryNumber] = useState(initialLotteryNumber)
  const TranslateString = useI18n()

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    onSubmit(lotteryNumber)
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setLotteryNumber(parseInt(evt.currentTarget.value, 10))
  }

  return (
    <Wrapper>
      <Text>{TranslateString(999, 'Select lottery number:')}</Text>
      <form onSubmit={handleSubmit}>
        <SearchWrapper>
          <Input value={lotteryNumber} type="number" onChange={handleChange} />
          <StyledButton size="sm">{TranslateString(999, 'Search')}</StyledButton>
        </SearchWrapper>
      </form>
    </Wrapper>
  )
}

export default PastLotterySearcher
