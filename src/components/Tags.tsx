import React from 'react'
import styled from 'styled-components'
import { Tag, VerifiedIcon, CommunityIcon, Svg } from '@pancakeswap-libs/uikit'

const CoreTag = () => (
  <Tag variant="purple" outline startIcon={<VerifiedIcon />}>
    Core
  </Tag>
)

const CommunityTag = () => (
  <Tag variant="pink" outline startIcon={<CommunityIcon />}>
    Community
  </Tag>
)

// TODO Remove Btag and BinanceIcon once the uikit is integrated
const Btag = styled(Tag)`
  color: #f0b90b;
  border-color: #f0b90b;
  svg {
    fill: #f0b90b;
  }
`
const BinanceIcon = () => {
  return (
    <Svg viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8" fill="#F0B90B" />
      <path
        d="M5.01656 8.00006L3.79256 9.23256L2.56006 8.00006L3.79256 6.76756L5.01656 8.00006ZM8.00006 5.01656L10.1081 7.12456L11.3406 5.89206L9.23256 3.79256L8.00006 2.56006L6.76756 3.79256L4.66806 5.89206L5.90056 7.12456L8.00006 5.01656ZM12.2076 6.76756L10.9836 8.00006L12.2161 9.23256L13.4401 8.00006L12.2076 6.76756ZM8.00006 10.9836L5.89206 8.87556L4.66806 10.1081L6.77606 12.2161L8.00006 13.4401L9.23256 12.2076L11.3406 10.0996L10.1081 8.87556L8.00006 10.9836ZM8.00006 9.23256L9.23256 8.00006L8.00006 6.76756L6.76756 8.00006L8.00006 9.23256Z"
        fill="#FFFDFA"
      />
    </Svg>
  )
}

const BinanceTag = () => (
  <Btag outline startIcon={<BinanceIcon />}>
    Binance
  </Btag>
)

export { CoreTag, CommunityTag, BinanceTag }
