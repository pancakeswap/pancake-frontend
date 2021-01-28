import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { LinkExternal } from '@pancakeswap-libs/uikit'

interface CellProps {
  bsc: string
  info: string
}

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  font-size: 0.875rem;

  svg {
    display: none;
  }
`

const Container = styled.div`
  display: block;
  text-align: left;

  & a {
    color: ${({ theme }) => theme.colors.primary};
    white-space: nowrap;
    display: block;
  }
`

const Links: React.FunctionComponent<CellProps> = ({ bsc, info }) => {
  const TranslateString = useI18n()

  return (
    <>
      <Container>
        <StyledLinkExternal href={bsc}>{TranslateString(356, 'View on BscScan')}</StyledLinkExternal>
        <StyledLinkExternal href={info}>{TranslateString(999, 'View on Info site')}</StyledLinkExternal>
      </Container>
    </>
  )
}

export default Links
