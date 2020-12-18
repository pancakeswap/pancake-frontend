import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Wrapper = styled.div`
  display: flex;
  margin: 36px 0 28px;
`

const LegendItem = styled.div`
  display: flex;
  margin-right: 18px;
  align-items: center;
`

const Circle = styled.div<{ isPoolSize?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${({ isPoolSize, theme }) => theme.colors[isPoolSize ? 'textSubtle' : 'primary']};
  margin-right: 6px;
`

const Legend = () => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <LegendItem>
        <Circle isPoolSize />
        <Text>{TranslateString(999, 'Pool Size')}</Text>
      </LegendItem>
      <LegendItem>
        <Circle />
        <Text>{TranslateString(999, 'Burned')}</Text>
      </LegendItem>
    </Wrapper>
  )
}

export default Legend
