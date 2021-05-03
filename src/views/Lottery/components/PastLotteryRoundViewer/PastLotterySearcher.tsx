import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Input, Button } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'

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
const InputWrapper = styled.div`
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
`

const ButtonWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translate(0%, -50%);
  width: auto;
`

const PastLotterySearcher: React.FC<PastLotterySearcherProps> = ({ initialLotteryNumber, onSubmit }) => {
  const [lotteryNumber, setLotteryNumber] = useState(initialLotteryNumber)
  const [isError, setIsError] = useState(false)
  const { t } = useTranslation()

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    onSubmit(lotteryNumber)
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget.value) {
      const value = parseInt(evt.currentTarget.value, 10)

      // The max value will always be the initialLotteryNumber which equals
      // the latest lottery round
      setIsError(value > initialLotteryNumber)
      setLotteryNumber(value)
    } else {
      setLotteryNumber(initialLotteryNumber)
    }
  }

  return (
    <Wrapper>
      <Text>{t('Select lottery number:')}</Text>
      <form onSubmit={handleSubmit}>
        <SearchWrapper>
          <InputWrapper>
            <Input
              value={lotteryNumber}
              type="number"
              inputMode="numeric"
              min="0"
              isWarning={isError}
              max={initialLotteryNumber}
              onChange={handleChange}
            />
          </InputWrapper>
          <ButtonWrapper>
            <Button type="submit" scale="sm" disabled={isError}>
              {t('Search')}
            </Button>
          </ButtonWrapper>
        </SearchWrapper>
      </form>
    </Wrapper>
  )
}

export default PastLotterySearcher
