import { useEffect, useState } from 'react'
import { useContractForCollection } from 'hooks/useContract'
import { NftToken } from 'state/nftMarket/types'

const NOT_ON_SALE_SELLER = '0x0000000000000000000000000000000000000000'

const useNftOwner = (nft: NftToken) => {
  const [owner, setOwner] = useState(null)
  const [isLoadingOwner, setIsLoadingOwner] = useState(true)
  const collectionContract = useContractForCollection(nft.collectionAddress)
  const currentSeller = nft.marketData?.currentSeller
  const { tokenId } = nft

  useEffect(() => {
    const getOwner = async () => {
      try {
        const tokenOwner = await collectionContract.ownerOf(tokenId)
        setOwner(tokenOwner)
      } catch (error) {
        setOwner(null)
      } finally {
        setIsLoadingOwner(false)
      }
    }

    if (currentSeller && currentSeller !== NOT_ON_SALE_SELLER) {
      setOwner(currentSeller)
      setIsLoadingOwner(false)
    } else {
      getOwner()
    }
  }, [currentSeller, collectionContract, tokenId])

  return { owner, isLoadingOwner }
}

export default useNftOwner
