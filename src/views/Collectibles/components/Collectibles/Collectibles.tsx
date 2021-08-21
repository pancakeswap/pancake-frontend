import React from 'react';
import styled from 'styled-components'
import { CardsLayout } from '@rug-zombie-libs/uikit'
import './Collectibles.Styles.css'
import nfts from 'redux/nfts';
import CollectiblesCard from './CollectiblesCard';

const StyledMain = styled.div`
  padding: 20px;
  display: grid;
  background: #101820;
`


const Collectibles:React.FC = () => {
  return (
    <StyledMain>
      <CardsLayout>
        {nfts.map((nft) => (
          <CollectiblesCard nft={nft} />
        ))}
      </CardsLayout>
    </StyledMain>
  )
}

export default Collectibles
