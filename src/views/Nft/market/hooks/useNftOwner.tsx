import { useWeb3React } from '@pancakeswap/wagmi'
import { useEffect, useState } from 'react'
import { useErc721CollectionContract } from 'hooks/useContract'
import { NftToken } from 'state/nftMarket/types'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import useSWR from 'swr'

const useNftOwner = (nft: NftToken, isOwnNft = false) => {
  const { account } = useWeb3React()
  const [owner, setOwner] = useState(null)
  const [isLoadingOwner, setIsLoadingOwner] = useState(true)
  const { reader: collectionContract } = useErc721CollectionContract(nft.collectionAddress)
  const currentSeller = nft.marketData?.currentSeller
  const pancakeProfileAddress = getPancakeProfileAddress()
  const { collectionAddress, tokenId } = nft
  const { data: tokenOwner } = useSWR(
    collectionContract ? ['nft', 'ownerOf', collectionAddress, tokenId] : null,
    async () => collectionContract.ownerOf(tokenId),
  )

  useEffect(() => {
    const getOwner = async () => {
      try {
        if (isOwnNft && account) {
          setOwner(account)
        } else if (tokenOwner && tokenOwner.toLowerCase() !== pancakeProfileAddress.toLowerCase()) {
          setOwner(tokenOwner)
        } else {
          setOwner(null)
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
  }, [account, isOwnNft, currentSeller, collectionContract, tokenId, tokenOwner, pancakeProfileAddress])

  return { owner, isLoadingOwner }
}

export default useNftOwner
