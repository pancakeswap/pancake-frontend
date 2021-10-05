import { useEffect, useState } from 'react'
import { getCollectionDistributionApi } from 'state/nftMarket/helpers'
import { ApiCollectionDistribution } from 'state/nftMarket/types'

interface State {
  isFetching: boolean
  data: ApiCollectionDistribution['data']
}

const useGetCollectionDistribution = (collectionAddress: string) => {
  const [state, setState] = useState<State>({ isFetching: false, data: null })

  useEffect(() => {
    const fetchTokens = async () => {
      setState((prevState) => ({ ...prevState, isFetching: true }))
      const apiResponse = await getCollectionDistributionApi(collectionAddress)
      setState({
        isFetching: false,
        data: apiResponse.data,
      })
    }

    fetchTokens()
  }, [collectionAddress, setState])

  return state
}

export default useGetCollectionDistribution
