import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'

const IfoCardWrapper = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textSubtle};
  padding-bottom: 40px;
  padding-top: 40px;
`
const NothingText = styled(Text)`
  display: flex;
  justify-content: center;
`

const PastIfo = () => {
  return (
    <IfoCardWrapper>
      <NothingText bold fontSize="24px" color="secondary">
        There’s nothing here yet!
      </NothingText>
    </IfoCardWrapper>
  )
}

export default PastIfo
