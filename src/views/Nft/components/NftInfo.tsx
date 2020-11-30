import React from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Container from 'components/layout/Container'
import StatusCard from './StatusCard'
import NftProgress from './NftProgress'

const StyledNtfInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  padding-bottom: 24px;
  padding-top: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const NftInfo = () => {
  const { account } = useWallet()

  return (
    <Container>
      <StyledNtfInfo>
        <StatusCard />
        <NftProgress />
      </StyledNtfInfo>
    </Container>
  )
}

export default NftInfo
