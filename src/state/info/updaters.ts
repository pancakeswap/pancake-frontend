import { useEffect, useMemo } from 'react'
import useFetchedTokenDatas from 'state/info/queries/tokens/tokenData'
import useTopTokenAddresses from 'state/info/queries/tokens/topTokens'
import { useAddTokenKeys, useAllTokenData, useClearTokenData, useGetChainName, useUpdateTokenData } from './hooks'

export const TokenUpdater = (): null => {
  const updateTokenDatas = useUpdateTokenData()
  const clearTokenData = useClearTokenData()
  const addTokenKeys = useAddTokenKeys()

  const allTokenData = useAllTokenData()
  const addresses = useTopTokenAddresses()
  const chainName = useGetChainName()

  // add top tokens on first load
  useEffect(() => {
    if (addresses.length > 0) {
      addTokenKeys(addresses)
    }
  }, [addTokenKeys, addresses])

  // detect for which addresses we havent loaded token data yet
  const unfetchedTokenAddresses = useMemo(() => {
    return Object.keys(allTokenData).reduce((accum: string[], key) => {
      const tokenData = allTokenData[key]
      if (!tokenData.data) {
        accum.push(key)
      }
      return accum
    }, [])
  }, [allTokenData])

  // fetch data for unfetched tokens and update them
  const { error: tokenDataError, data: tokenDatas } = useFetchedTokenDatas(chainName, unfetchedTokenAddresses)
  useEffect(() => {
    if (tokenDatas && !tokenDataError) {
      updateTokenDatas(Object.values(tokenDatas))
    }
  }, [tokenDataError, tokenDatas, updateTokenDatas])

  useEffect(() => {
    clearTokenData()
  }, [chainName, clearTokenData])

  return null
}
