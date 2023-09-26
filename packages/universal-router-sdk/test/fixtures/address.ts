import { ChainId } from '@pancakeswap/chains'
import { CurrencyAmount, ERC20Token, Pair, computePairAddress, pancakePairV2ABI } from '@pancakeswap/sdk'
import { CAKE, ETHER, USDC, USDT, WETH9 } from './constants/tokens'
import { V2_FACTORY_ADDRESSES } from './constants/addresses'
import { Provider, getPublicClient } from './clients'

const fixtureTokensAddresses = (chainId: ChainId) => {
  return {
    ETHER: ETHER.on(chainId),
    USDC: USDC[chainId],
    USDT: USDT[chainId],
    CAKE: CAKE[chainId],
    WETH: WETH9[chainId],
  }
}

const getPair = (tokenA: ERC20Token, tokenB: ERC20Token) => {
  return async (getClient: Provider) => {
    // eslint-disable-next-line no-console
    console.assert(tokenA.chainId === tokenB.chainId, 'Invalid token pair')
    const chainId = tokenA.chainId as ChainId
    const client = getClient({ chainId })
    const pairAddress = computePairAddress({ factoryAddress: V2_FACTORY_ADDRESSES[chainId], tokenA, tokenB })

    const [reserve0, reserve1] = await client.readContract({
      abi: pancakePairV2ABI,
      address: pairAddress,
      functionName: 'getReserves',
    })
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

    return new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1))
  }
}

export const fixtureAddresses = async (chainId: ChainId) => {
  const tokens = fixtureTokensAddresses(chainId)
  const { ETHER, USDC, USDT, WETH } = tokens

  const v2Pairs = {
    WETH_USDC_V2: await getPair(WETH, USDC)(getPublicClient),
  }

  const v3Pools = {}

  return {
    ...tokens,
    ...v2Pairs,
    ...v3Pools,
  }
}
