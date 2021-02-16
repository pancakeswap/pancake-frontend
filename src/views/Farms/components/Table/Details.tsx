import React from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, Button } from '@pancakeswap-libs/uikit'

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;

  button {
    margin-right: -16px;
  }
`

const Details: React.FunctionComponent = () => {
  return (
    <Container>
      <Button variant="text" size="sm">
        Details
        <ChevronDownIcon color="primary" />
      </Button>
    </Container>
  )
}

export default Details
