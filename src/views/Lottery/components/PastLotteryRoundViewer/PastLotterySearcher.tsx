import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Text, Input, Button } from '@pancakeswap-libs/uikit'
import useSushi from 'hooks/useSushi'
import useI18n from 'hooks/useI18n'
import { getLotteryContract, getLotteryIssueIndex } from '../../../../sushi/lotteryUtils'

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
`

const PastLotterySearcher = ({ inputNumber, setInputNumber, onSubmit }) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Text>Select lottery number:</Text>
      <SearchWrapper>
        <Input
          value={inputNumber}
          type="number"
          onChange={(event) => {
            setInputNumber(parseInt(event.currentTarget.value))
          }}
        />
        <StyledButton size="sm" onClick={onSubmit}>
          Search
        </StyledButton>
      </SearchWrapper>
    </Wrapper>
  )
}

export default PastLotterySearcher
