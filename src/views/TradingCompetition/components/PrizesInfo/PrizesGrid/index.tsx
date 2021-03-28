import React from 'react'
import styled from 'styled-components'
import HeadingRow from './HeadingRow'

const Wrapper = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: repeat(6, 1fr);
  margin-bottom: 24px;
`

const PrizesGrid = () => {
  return (
    <Wrapper>
      <HeadingRow />
      <span>Tabmenu</span>
      <span>Table</span>
    </Wrapper>
  )
}

export default PrizesGrid
