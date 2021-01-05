import React from 'react'
import styled from 'styled-components'
import { ifosConfig } from 'sushi/lib/constants'
import { Ifo } from 'sushi/lib/constants/types'
import IfoCard from './components/IfoCard'

const IfoCardWrapper = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textSubtle};
  padding-bottom: 40px;
  padding-top: 40px;
  display: flex;
  justify-content: space-around;
`

const Wrapper = styled.div`
  margin-bottom: 32px;
  display: inline-flex;
`
const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)
const PastIfo = () => {
  return (
    <IfoCardWrapper>
      {inactiveIfo.map((ifo) => (
        <Wrapper key={ifo.id}>
          <IfoCard ifo={ifo} />
        </Wrapper>
      ))}
    </IfoCardWrapper>
  )
}

export default PastIfo
