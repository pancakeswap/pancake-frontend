import React from 'react'
import styled from 'styled-components'
import { Text, Input, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Wrapper = styled.div`
  margin-bottom: 24px;
`

const SearchWrapper = styled.div`
  position: relative;
`

const StyledButton = styled(Button)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translate(0%, -50%);
  width: auto;
`

const PastLotterySearcher = ({ inputNumber, setInputNumber, onSubmit }) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Text>{TranslateString(999, 'Select lottery number:')}</Text>
      <SearchWrapper>
        <Input
          value={inputNumber}
          type="number"
          onChange={(event) => {
            setInputNumber(parseInt(event.currentTarget.value))
          }}
        />
        <StyledButton size="sm" onClick={onSubmit}>
          {TranslateString(999, 'Search')}
        </StyledButton>
      </SearchWrapper>
    </Wrapper>
  )
}

export default PastLotterySearcher
