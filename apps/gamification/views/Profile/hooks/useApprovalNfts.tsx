import { useReadContracts } from '@pancakeswap/wagmi'
import { NftToken } from 'hooks/useProfile/nft/types'
import fromPairs from 'lodash/fromPairs'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { erc721Abi } from 'viem'

export const useApprovalNfts = (nftsInWallet: NftToken[]) => {
  const { data } = useReadContracts({
    contracts: nftsInWallet.map(
      (f) =>
        ({
          abi: erc721Abi,
          address: f.collectionAddress,
          functionName: 'getApproved',
          args: [BigInt(f.tokenId)],
        } as const),
    ),
    watch: true,
  })

  const profileAddress = getPancakeProfileAddress()

  const approvedTokenIds = Array.isArray(data)
    ? fromPairs(
        data
          .flat()
          .map((result, index) => [
            nftsInWallet[index].tokenId,
            profileAddress.toLowerCase() === result?.result?.toLowerCase(),
          ]),
      )
    : null

  return { data: approvedTokenIds }
}
