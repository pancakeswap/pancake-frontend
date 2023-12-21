import { ChainId } from '@pancakeswap/chains'
import BigNumber from 'bignumber.js'
import { Address, PublicClient } from 'viem'

const WEEK = 7
const YEAR = 365
const API_URL = 'https://perp.pancakeswap.finance/bapi/futures/v1/public/future/apx/fee/info?chain='

const CONTRACT_ADDRESS: Record<number, Address> = {
  [ChainId.OPBNB]: '0x5A5454A6030FB50ceb3eb78977D140198A27be5e',
  [ChainId.ARBITRUM_ONE]: '0xB3879E95a4B8e3eE570c232B19d520821F540E48',
}

const CHAIN_NAME_MAP: Record<number, string> = {
  [ChainId.OPBNB]: 'OPBNB',
  [ChainId.ARBITRUM_ONE]: 'ARB',
}

export const fetchAlpBoostedPoolApr = async (client: PublicClient, chainId: ChainId) => {
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
          address: CONTRACT_ADDRESS?.[chainId],
          functionName: 'totalValue',
        },
      ],
      allowFailure: false,
    })

    const totalValueUsd = totalValue
      .map((i) => new BigNumber(i.valueUsd.toString()).div(1e18).toNumber())
      .reduce((a, b) => a + b, 0)

    const response = await fetch(`${API_URL}${CHAIN_NAME_MAP[chainId]}`)
    const result = await response.json()

    const { alpFundingFee, alpTradingFee, alpLipFee } = result.data
    const apr = new BigNumber(alpFundingFee).plus(alpTradingFee).plus(alpLipFee)
    const totalApr = apr.div(totalValueUsd.toString()).div(WEEK)

    const apy = totalApr.plus(1).exponentiatedBy(YEAR).minus(1).times(100)
    return apy.toNumber()
  } catch (error) {
    console.info('Fetch ALP boosted fee error: ', error)
    return 0
  }
}
