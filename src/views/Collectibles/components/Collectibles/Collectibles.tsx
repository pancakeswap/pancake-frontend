import React from 'react';
import styled from 'styled-components'
import { CardsLayout } from '@rug-zombie-libs/uikit'
import './Collectibles.Styles.css'
import nfts from 'redux/nfts';
import CollectiblesCard from './CollectiblesCard';

const Collectibles:React.FC = () => {
  return (
    <CardsLayout className="collectibles">
      <>
        {nfts.map((nft) => (
          <CollectiblesCard nft={nft} />
        ))}
      </>
    </CardsLayout>
  )
}

export default Collectibles
