import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled.div`
  display: flex;
  margin: 24px 0 24px;
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
  const { t } = useTranslation()

  return (
    <Wrapper>
      <LegendItem>
        <Circle isPoolSize />
        <Text>{t('Pool Size')}</Text>
      </LegendItem>
      <LegendItem>
        <Circle />
        <Text>{t('Burned')}</Text>
      </LegendItem>
    </Wrapper>
  )
}

export default Legend
