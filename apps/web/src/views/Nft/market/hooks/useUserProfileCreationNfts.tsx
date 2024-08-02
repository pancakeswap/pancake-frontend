import { useProfile } from 'state/profile/hooks'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { getProfileContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { ChainId } from '@pancakeswap/chains'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { NftLocation } from 'state/nftMarket/types'
import { useNftsForAddress } from './useNftsForAddress'

export const useUserProfileCreationNfts = () => {
  const { address: account } = useAccount()
  const { isLoading: isProfileFetching, profile } = useProfile()
  const { nfts, isLoading: isUserNftLoading } = useNftsForAddress({
    account: account || '',
    profile,
    isProfileFetching,
  })

  const { data: userProfileCreationNfts = [], status } = useQuery({
    queryKey: ['userProfileCreationNfts', account],
    queryFn: async () => {
      const nftsInWallet = nfts.filter((nft) => nft.location === NftLocation.WALLET)
      const nftsByCollection = Array.from(
        nftsInWallet.reduce((acc, value) => {
          acc.add(value.collectionAddress)
          return acc
        }, new Set<string>()),
      )

      if (nftsByCollection.length > 0) {
        const profileContract = getProfileContract()
        const nftRole = await profileContract.read.NFT_ROLE()
        const pancakeProfileAddress = getPancakeProfileAddress()
        const collectionRoles = await publicClient({ chainId: ChainId.BSC }).multicall({
          contracts: nftsByCollection.map((collectionAddress) => ({
            abi: pancakeProfileABI,
            address: pancakeProfileAddress,
            functionName: 'hasRole',
            args: [nftRole, collectionAddress],
          })),
          allowFailure: false,
        })

        return nftsInWallet.filter((nft) => collectionRoles[nftsByCollection.indexOf(nft.collectionAddress)])
      }
      return []
    },
    enabled: !isUserNftLoading && nfts.length > 0,
  })

  return { userProfileCreationNfts, isLoading: isProfileFetching || isUserNftLoading || status !== 'success' }
}
