import React, { useEffect, useState } from 'react';
import { CardsLayout, Heading, useMatchBreakpoints } from '@rug-zombie-libs/uikit'
import './Collectibles.Styles.css'
import CollectiblesCard from './CollectiblesCard';
import { nftUserInfo } from '../../../../redux/fetch'
import { useMultiCall, useNftOwnership } from '../../../../hooks/useContract'
import CollectibleTabButtons from '../CollectibleTabButtons'
import { nfts } from '../../../../redux/get'

const RARITIES = ['Biblical', 'Legendary', 'Mythic', 'Rare', 'Uncommon', 'Common']

const Collectibles: React.FC = () => {
  const contract = useNftOwnership()
  const [updateUserInfo, setUpdateUserInfo] = useState(false)
  const [updateEvery, setUpdateEvery] = useState(false)
  const [filter, setFilter] = useState(0)
  useEffect(() => {
    if(!updateUserInfo) {
      nftUserInfo(contract, { update: updateUserInfo, setUpdate: setUpdateUserInfo });
    }
  }, [contract, updateUserInfo])

  let currentNfts = []
  switch (filter) {
    case 1:
      currentNfts = nfts().filter(nft => nft.userInfo.ownedIds.length > 0)
      break
    case 2:
      currentNfts = nfts().filter(nft => nft.userInfo.ownedIds.length === 0)
      break
    default:
      currentNfts = nfts()
      break
  }

  const refresh = () => {
    nftUserInfo(contract, { update: updateEvery, setUpdate: setUpdateEvery });
  }

  return (
    <>
      <CollectibleTabButtons setFilter={setFilter}/>
      {RARITIES.map((rarity) => {
        const nftsByRarity = currentNfts.map((nft) => {
          return nft.rarity === rarity ? <CollectiblesCard id={nft.id} key={nft.id} refresh={refresh}/> : null
        })

        return <>
          <Heading className='cardHeader' size="lg" textTransform="capitalize" color='text'>
            {nftsByRarity.length !== 0 ? rarity : null}
          </Heading>
          <CardsLayout className="collectibles">
            {nftsByRarity}
          </CardsLayout>
        </>
      })}
    </>
  )
}

export default Collectibles
