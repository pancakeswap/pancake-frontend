import React, { useEffect, useState } from 'react';
import { CardsLayout, Heading } from '@rug-zombie-libs/uikit'
import './Collectibles.Styles.css'
import nfts from 'redux/nfts';
import CollectiblesCard from './CollectiblesCard';

const Collectibles: React.FC = () => {

  const [rarityArr, setRarityArray] = useState([]);

  const getRarityArray = () => {
    const rarityData = []
    for (let i = 0; i < nfts.length; i++) {
      if (nfts[i].rarity && !rarityData.includes(nfts[i].rarity)) {
        rarityData.push(nfts[i].rarity);
      }
    }
    return rarityData;
  }

  useEffect(() => {
    setRarityArray(getRarityArray());
  }, [])
  return (
    <>
      {rarityArr.map((rarity) => {
        return <>
          <Heading className='cardHeader' size="lg" textTransform="capitalize" color='text'>
            {rarity}
          </Heading>
          <CardsLayout className="collectibles">
            {nfts.map((nft) => {
              return nft.rarity === rarity ? <CollectiblesCard nft={nft} /> : null
            })}
          </CardsLayout>
        </>
      })}
    </>
  )
}

export default Collectibles
