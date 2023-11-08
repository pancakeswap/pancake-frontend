import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/chains'
import { getViemClients } from 'utils/viem'
import { CONTRACT_ADDRESS } from './fetchTokenAplPrice'

const API_URL = 'https://perp.pancakeswap.finance/bapi/futures/v1/public/future/apx/fee/info?chain=ARB'

export const fetchAlpBoostedPoolApr = async () => {
  const client = getViemClients({ chainId: ChainId.ARBITRUM_ONE })

  try {
    const [totalValue] = await client.multicall({
      contracts: [
        {
          abi: [
            {
              inputs: [],
              name: 'totalValue',
              outputs: [
                {
                  components: [
                    { internalType: 'address', name: 'tokenAddress', type: 'address' },
                    { internalType: 'int256', name: 'value', type: 'int256' },
                    { internalType: 'uint8', name: 'decimals', type: 'uint8' },
                    { internalType: 'int256', name: 'valueUsd', type: 'int256' },
                    { internalType: 'uint16', name: 'targetWeight', type: 'uint16' },
                    { internalType: 'uint16', name: 'feeBasisPoints', type: 'uint16' },
                    { internalType: 'uint16', name: 'taxBasisPoints', type: 'uint16' },
                    { internalType: 'bool', name: 'dynamicFee', type: 'bool' },
                  ],
                  internalType: 'struct IVault.LpItem[]',
                  name: 'lpItems',
                  type: 'tuple[]',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ] as const,
          address: CONTRACT_ADDRESS,
          functionName: 'totalValue',
        },
      ],
      allowFailure: false,
    })

    const sumTotalValue = totalValue.map((i) => i.valueUsd).reduce((a, b) => a + b, 0n)

    const response = await fetch(API_URL)
    const result = await response.json()

    const { alpFundingFee, alpTradingFee, alpLipFee } = result.data
    const fee = new BigNumber(alpFundingFee).plus(alpTradingFee).plus(alpLipFee)
    const feeApr = fee.div(sumTotalValue.toString())

    return feeApr.toNumber()
  } catch (error) {
    console.info('Fetch ALP boosted fee error: ', error)
    return 0
  }
}
