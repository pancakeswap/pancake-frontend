import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useErc721CollectionContract } from 'hooks/useContract'
import { NftToken } from 'state/nftMarket/types'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { safeGetAddress } from 'utils'
import { useQuery } from '@tanstack/react-query'

const useNftOwner = (nft: NftToken, isOwnNft = false) => {
  const { address: account } = useAccount()
  const [owner, setOwner] = useState<string | null>(null)
  const [isLoadingOwner, setIsLoadingOwner] = useState(true)
  const collectionContract = useErc721CollectionContract(nft.collectionAddress)
  const currentSeller = nft.marketData?.currentSeller
  const pancakeProfileAddress = getPancakeProfileAddress()
  const { collectionAddress, tokenId } = nft
  const { data: tokenOwner } = useQuery({
    queryKey: ['nft', 'ownerOf', collectionAddress, tokenId],
    queryFn: async () => {
      if (!collectionContract) return undefined
      return collectionContract.read.ownerOf([BigInt(tokenId)])
    },
    enabled: Boolean(collectionAddress && tokenId),
  })

  useEffect(() => {
    const getOwner = async () => {
      try {
        if (isOwnNft && account) {
          setOwner(account)
        } else if (tokenOwner && safeGetAddress(tokenOwner) !== safeGetAddress(pancakeProfileAddress)) {
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
