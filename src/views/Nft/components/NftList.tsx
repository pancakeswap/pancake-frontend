import React from 'react'
import orderBy from 'lodash/orderBy'
import Container from 'components/layout/Container'
import nfts from 'sushi/lib/constants/nfts'
import NftCard from './NftCard'
import NftGrid from './NftGrid'

const NftList = () => {
  return (
    <Container>
      <NftGrid>
        {orderBy(nfts, 'sortOrder').map((nft) => (
          <div key={nft.name}>
            <NftCard nft={nft} />
          </div>
        ))}
      </NftGrid>
    </Container>
  )
}

export default NftList
