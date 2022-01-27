import { useEffect, useState } from 'react'
import { getCollectionDistributionApi, getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ApiCollectionDistribution, ApiResponseCollectionTokens, ApiSingleTokenData } from 'state/nftMarket/types'
import { getPancakeRabbitsAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import { pancakeBunniesAddress } from '../constants'

interface State {
  isFetching: boolean
  data: ApiCollectionDistribution['data']
}

const useGetCollectionDistribution = (collectionAddress: string) => {
  const [state, setState] = useState<State>({ isFetching: false, data: null })

  useEffect(() => {
    const fetchTokens = async () => {
      setState((prevState) => ({ ...prevState, isFetching: true }))
      const apiResponse = await getCollectionDistributionApi<ApiCollectionDistribution>(collectionAddress)
      setState({
        isFetching: false,
        data: apiResponse.data,
      })
    }

    fetchTokens()
  }, [collectionAddress, setState])

  return state
}

interface StatePB {
  isFetching: boolean
  data: Record<string, ApiSingleTokenData & { tokenCount: number }>
}

export const useGetCollectionDistributionPB = () => {
  const [state, setState] = useState<StatePB>({ isFetching: false, data: null })

  useEffect(() => {
    const fetchTokens = async () => {
      setState((prevState) => ({ ...prevState, isFetching: true }))
      let apiResponse: ApiResponseCollectionTokens
      try {
        apiResponse = await getNftsFromCollectionApi(pancakeBunniesAddress)
      } catch (error) {
        setState((prevState) => ({ ...prevState, isFetching: false }))
        return
      }
      // Use on chain data to get most updated totalSupply and bunnyCount data. Nft Api Data not updated frequently.
      const tokenIds = Object.keys(apiResponse.attributesDistribution)
      const bunnyCountCalls = tokenIds.map((tokenId) => ({
        address: getPancakeRabbitsAddress(),
        name: 'bunnyCount',
        params: [tokenId],
      }))
      try {
        const response = await multicallv2(pancakeRabbitsAbi, bunnyCountCalls)
        const tokenListResponse = response.reduce((obj, tokenCount, index) => {
          return {
            ...obj,
            [tokenIds[index]]: { ...apiResponse.data[index], tokenCount: tokenCount[0].toNumber() },
          }
        }, {})
        setState({
          isFetching: false,
          data: tokenListResponse,
        })
      } catch (error) {
        // Use nft api data if on chain multicall fails
        const tokenListResponse = Object.entries(apiResponse.data).reduce((obj, [tokenId, tokenData]) => {
          return {
            ...obj,
            [tokenId]: { ...tokenData, tokenCount: apiResponse.attributesDistribution[tokenId] },
          }
        }, {})
        setState({ isFetching: false, data: tokenListResponse })
      }
    }

    fetchTokens()
  }, [])

  return state
}

export default useGetCollectionDistribution
