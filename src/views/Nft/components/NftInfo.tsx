import React, { useContext } from 'react'
import styled from 'styled-components'
import { NftProviderContext } from '../contexts/NftProvider'
import NftProgress from './NftProgress'
import NftProgressSimple from './NftProgressSimple'
import StatusCard from './StatusCard'

const StyledNtfInfo = styled.div`
  align-items: start;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const NftInfo = () => {
  const { canBurnNft } = useContext(NftProviderContext)

  if (!canBurnNft) {
    return <NftProgressSimple />
  }

  return (
    <StyledNtfInfo>
      <NftProgress />
      <StatusCard />
    </StyledNtfInfo>
  )
}

export default NftInfo
