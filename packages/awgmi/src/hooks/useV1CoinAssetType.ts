import { Hex } from '@aptos-labs/ts-sdk'
import { fetchAptosView } from '@pancakeswap/awgmi/core'
import { useQueries, UseQueryOptions } from '@tanstack/react-query'

function convertHexStringToAsciiString(str: string) {
  const hex = Hex.fromHexInput(str).toStringWithoutPrefix()
  let converted = ''
  for (let i = 0; i < hex.length; i += 2) {
    converted += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16))
  }
  return converted
}

type Params = {
  networkName?: string
  assetTypes: string[]
} & Omit<UseQueryOptions<string>, 'queryKey'>

export function useV1CoinAssetTypes({ networkName, assetTypes, ...query }: Params) {
  return useQueries({
    queries: assetTypes.map((assetType) => {
      return {
        ...query,
        queryKey: ['useV1CoinAssetType', assetType],
        queryFn: async () => {
          const pairedInfo = await fetchAptosView({
            networkName,
            params: {
              typeArguments: [],
              function: '0x1::coin::paired_coin',
              functionArguments: [assetType],
            },
          })
          const pairedCoin = pairedInfo?.[0]?.vec?.[0]
          const moduleName = convertHexStringToAsciiString(pairedCoin.module_name)
          const structName = convertHexStringToAsciiString(pairedCoin.struct_name)
          return [pairedCoin.account_address, moduleName, structName].join('::')
        },
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
      }
    }),
  })
}
