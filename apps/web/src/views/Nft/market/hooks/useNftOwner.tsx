import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { useErc721CollectionContract } from 'hooks/useContract'
import { NftToken } from 'state/nftMarket/types'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { NOT_ON_SALE_SELLER } from 'config/constants'

const useNftOwner = (nft: NftToken, isOwnNft = false) => {
  const { account } = useWeb3React()
  const [owner, setOwner] = useState(null)
  const [isLoadingOwner, setIsLoadingOwner] = useState(true)
  const { reader: collectionContract } = useErc721CollectionContract(nft.collectionAddress)
  const currentSeller = nft.marketData?.currentSeller
  const pancakeProfileAddress = getPancakeProfileAddress()
  const { tokenId } = nft

  useEffect(() => {
    const getOwner = async () => {
      try {
        if (isOwnNft && account) {
          setOwner(account)
        } else {
          const tokenOwner = await collectionContract.ownerOf(tokenId)
          if (tokenOwner.toLowerCase() !== pancakeProfileAddress.toLowerCase()) {
            setOwner(tokenOwner)
          } else {
            setOwner(null)
          }
        }
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
  }, [account, isOwnNft, currentSeller, collectionContract, tokenId, pancakeProfileAddress])

  return { owner, isLoadingOwner }
}

export default useNftOwner
