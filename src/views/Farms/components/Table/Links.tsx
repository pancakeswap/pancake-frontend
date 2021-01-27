import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import useI18n from 'hooks/useI18n'

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
  const TranslateString = useI18n()

  return (
    <>
      <Container>
        <Link to={bsc}>{TranslateString(356, 'View on BscScan')}</Link>
        <Link to="/farms">View on Info</Link>
      </Container>
    </>
  )
}

export default Links
