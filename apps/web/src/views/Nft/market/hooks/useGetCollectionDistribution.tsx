import { useEffect, useState } from 'react'
import { getCollectionDistributionApi, getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ApiCollectionDistribution, ApiResponseCollectionTokens, ApiSingleTokenData } from 'state/nftMarket/types'
import { getPancakeBunniesAddress } from 'utils/addressHelpers'
import mapValues from 'lodash/mapValues'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/chains'
import { pancakeBunniesABI } from 'config/abi/pancakeBunnies'
import { useQuery } from '@tanstack/react-query'
import { pancakeBunniesAddress } from '../constants'

const useGetCollectionDistribution = (collectionAddress: string | undefined) => {
  const { data, status } = useQuery({
    queryKey: ['distribution', collectionAddress],
    queryFn: async () => (await getCollectionDistributionApi<ApiCollectionDistribution>(collectionAddress!))?.data,
    enabled: Boolean(collectionAddress),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return {
    data,
    isFetching: status !== 'success',
  }
}

interface StatePB {
  isFetching: boolean
  data: Record<string, ApiSingleTokenData & { tokenCount: number }>
}

export const useGetCollectionDistributionPB = () => {
  const [state, setState] = useState<StatePB>({ isFetching: false, data: {} })

  useEffect(() => {
    const fetchTokens = async () => {
      setState((prevState) => ({ ...prevState, isFetching: true }))
      let apiResponse: ApiResponseCollectionTokens | null | undefined = null
      try {
        apiResponse = await getNftsFromCollectionApi(pancakeBunniesAddress)
        if (!apiResponse) {
          setState((prevState) => ({ ...prevState, isFetching: false }))
          return
        }
      } catch (error) {
        setState((prevState) => ({ ...prevState, isFetching: false }))
        return
      }
      // Use on chain data to get most updated totalSupply and bunnyCount data. Nft Api Data not updated frequently.
      const tokenIds = Object.keys(apiResponse.attributesDistribution)
      try {
        const response = await publicClient({ chainId: ChainId.BSC }).multicall({
          contracts: tokenIds.map(
            (tokenId) =>
              ({
                address: getPancakeBunniesAddress(),
                functionName: 'bunnyCount',
                abi: pancakeBunniesABI,
                args: [Number(tokenId)],
              } as const),
          ),
          allowFailure: false,
        })
        const tokenListResponse = response.reduce((obj, tokenCount, index) => {
          return {
            ...obj,
            [tokenIds[index]]: { ...apiResponse?.data[index], tokenCount: Number(tokenCount) },
          }
        }, {})
        setState({
          isFetching: false,
          data: tokenListResponse,
        })
      } catch (error) {
        // Use nft api data if on chain multicall fails
        const tokenListResponse = mapValues(apiResponse.data, (tokenData, tokenId) => ({
          ...tokenData,
          tokenCount: apiResponse?.attributesDistribution[tokenId] ?? 0,
        }))
        setState({ isFetching: false, data: tokenListResponse })
      }
    }

    fetchTokens()
  }, [])

  return state
}

export default useGetCollectionDistribution
