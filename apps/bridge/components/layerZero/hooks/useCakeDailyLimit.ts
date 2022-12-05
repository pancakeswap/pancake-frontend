import useSWR from 'swr'
import { AptosBridgeForm } from 'components/layerZero/types'
import multicallv2 from 'utils/multicall'
import AptosBridgeAbi from 'config/constants/abi/aptosBridge.json'
import { getAptosBridge } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from '@pancakeswap/utils/bigNumber'

interface CakeDailyLimit {
  paused: boolean
  isWhitelistAddress: boolean
  limitAmount: string
}

enum LayerZeroChainId {
  'BSC' = 10102,
  'APTOS' = 10108,
}

const CHAIN_ID = 97

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
    limitAmount: '0',
  }

  const { data } = useSWR(
    evmAddress && aptosAddress && srcCurrency?.symbol === 'CAKE' && dstCurrency?.symbol === 'CAKE'
      ? ['AptosBridgeForm', inputAmount]
      : null,
    async () => {
      try {
        const isAptosInSrcInput = srcCurrency?.chainId === LayerZeroChainId.APTOS
        const [[paused], [isWhitelistAddress], [inputTokenAmount], [outputTokenAmount]] = await multicallv2({
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
              name: isAptosInSrcInput ? 'chainIdToInboundCap' : 'chainIdToOutboundCap',
              params: [isAptosInSrcInput ? srcCurrency?.chainId : dstCurrency?.chainId],
            },
            {
              address: contractAddress,
              name: isAptosInSrcInput ? 'chainIdToReceivedTokenAmount' : 'chainIdToSentTokenAmount',
              params: [isAptosInSrcInput ? srcCurrency?.chainId : dstCurrency?.chainId],
            },
          ],
        })

        const limitAmount = new BigNumber(inputTokenAmount.toString())
          .minus(outputTokenAmount.toString())
          .div(BIG_TEN.pow(18))
          .toString()

        return {
          paused,
          isWhitelistAddress,
          limitAmount,
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
