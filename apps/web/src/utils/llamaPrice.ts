import { defiLlamaChainNames } from '@pancakeswap/chains'
import { CAKE } from '@pancakeswap/tokens'
import { getCakePriceFromOracle } from 'hooks/useCakePrice'

// use for fetch usd outside of the liquidity pools on PancakeSwap
export const fetchTokenUSDValue = async (chainId: number, tokenAddresses: string[]) => {
  if (!tokenAddresses.length || !defiLlamaChainNames[chainId]) return new Map<string, string>()

  const list = tokenAddresses.map((address) => `${defiLlamaChainNames[chainId]}:${address}`).join(',')

  let tokenPriceArray: { coins: { [key: string]: { price: string } } } = {
    coins: {},
  }

  await fetch(`https://coins.llama.fi/prices/current/${list}`).then(async (res) => {
    const data = await res.json()
    tokenPriceArray = {
      coins: {
        ...tokenPriceArray.coins,
        ...data.coins,
      },
    }
  })

  const commonTokenUSDValue = new Map<string, string>()

  const cakeAddress = tokenAddresses
    .map((address) =>
      address.toLowerCase() === CAKE?.[chainId]?.address?.toLowerCase()
        ? `${defiLlamaChainNames[chainId]}:${address}`
        : '',
    )
    .filter(Boolean)

  if (cakeAddress.length > 0) {
    const cakePrice = parseFloat(await getCakePriceFromOracle())
    cakeAddress.forEach((address) => {
      tokenPriceArray = {
        coins: {
          ...tokenPriceArray.coins,
          [address]: {
            price: cakePrice.toString(),
          },
        },
      }
    })
  }

  Object.entries(tokenPriceArray.coins || {}).forEach(([key, value]) => {
    const [, address] = key.split(':')
    commonTokenUSDValue.set(address, value.price)
  })

  return commonTokenUSDValue
}
