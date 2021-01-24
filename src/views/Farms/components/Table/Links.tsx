import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface CellProps {
  bsc
}

const Container = styled.div`
  display: block;
  text-align: left;

  & a {
    color: ${({ theme }) => theme.colors.primary};
    white-space: nowrap;
    display: block;
  }
`

const Links: React.FunctionComponent<CellProps> = ({ bsc }) => {
  return (
    <>
      <Container>
        <Link to={bsc}>View on BSCScan</Link>
        <Link to="/farms">View on Info</Link>
      </Container>
    </>
  )
}

export default Links
