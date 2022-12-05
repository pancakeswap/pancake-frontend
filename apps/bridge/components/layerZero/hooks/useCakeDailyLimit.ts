import useSWR from 'swr'
import { AptosBridgeForm } from 'components/layerZero/types'
import multicallv2 from 'utils/multicall'
import AptosBridgeAbi from 'config/constants/abi/aptosBridge.json'
import { getAptosBridge } from 'utils/addressHelpers'
import { ChainId } from '@pancakeswap/sdk'

interface CakeDailyLimit {
  paused: boolean
  isWhitelistAddress: boolean
  chainIdToInboundCap: string
  chainIdToReceivedTokenAmount: string
  chainIdToOutboundCap: string
  chainIdToSentTokenAmount: string
}

const CHAIN_ID = ChainId.BSC_TESTNET
export const LZ_APTOS_CHAIN_ID = 10108

const useCakeDailyLimit = ({
  evmAddress,
  aptosAddress,
  inputAmount,
  srcCurrency,
  dstCurrency,
}: AptosBridgeForm): CakeDailyLimit => {
  const contractAddress = getAptosBridge(CHAIN_ID)
  const initState = {
    paused: false,
    isWhitelistAddress: false,
    chainIdToInboundCap: '0',
    chainIdToReceivedTokenAmount: '0',
    chainIdToOutboundCap: '0',
    chainIdToSentTokenAmount: '0',
  }

  const { data } = useSWR(
    evmAddress && aptosAddress && srcCurrency?.symbol === 'CAKE' && dstCurrency?.symbol === 'CAKE'
      ? ['AptosBridgeForm', inputAmount]
      : null,
    async () => {
      try {
        const [
          [paused],
          [isWhitelistAddress],
          [chainIdToInboundCap],
          [chainIdToReceivedTokenAmount],
          [chainIdToOutboundCap],
          [chainIdToSentTokenAmount],
        ] = await multicallv2({
          chainId: CHAIN_ID,
          abi: AptosBridgeAbi,
          calls: [
            {
              address: contractAddress,
              name: 'paused',
            },
            {
              address: contractAddress,
              name: 'whitelist',
              params: [evmAddress],
            },
            {
              address: contractAddress,
              name: 'chainIdToInboundCap',
              params: [LZ_APTOS_CHAIN_ID],
            },
            {
              address: contractAddress,
              name: 'chainIdToReceivedTokenAmount',
              params: [LZ_APTOS_CHAIN_ID],
            },
            {
              address: contractAddress,
              name: 'chainIdToOutboundCap',
              params: [LZ_APTOS_CHAIN_ID],
            },
            {
              address: contractAddress,
              name: 'chainIdToSentTokenAmount',
              params: [LZ_APTOS_CHAIN_ID],
            },
          ],
        })

        return {
          paused,
          isWhitelistAddress,
          chainIdToInboundCap: chainIdToInboundCap.toString(),
          chainIdToReceivedTokenAmount: chainIdToReceivedTokenAmount.toString(),
          chainIdToOutboundCap: chainIdToOutboundCap.toString(),
          chainIdToSentTokenAmount: chainIdToSentTokenAmount.toString(),
        }
      } catch (error) {
        console.error('Failed to get aptos bridge info', error)
        return initState
      }
    },
  )

  return data || initState
}

export default useCakeDailyLimit
