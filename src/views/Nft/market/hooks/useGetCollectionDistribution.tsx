import { useEffect, useState } from 'react'
import { getCollectionDistributionApi } from 'state/nftMarket/helpers'
import { ApiCollectionDistribution, ApiCollectionDistributionPB } from 'state/nftMarket/types'
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
  data: ApiCollectionDistributionPB['data']
}

export const useGetCollectionDistributionPB = () => {
  const [state, setState] = useState<StatePB>({ isFetching: false, data: null })

  useEffect(() => {
    const fetchTokens = async () => {
      setState((prevState) => ({ ...prevState, isFetching: true }))
      const apiResponse = await getCollectionDistributionApi<ApiCollectionDistributionPB>(pancakeBunniesAddress)
      setState({
        isFetching: false,
        data: apiResponse.data,
      })
    }

    fetchTokens()
  }, [setState])

  return state
}

export default useGetCollectionDistribution
