import { ChainId, Token } from '@pancakeswap/sdk'
import { CHAIN_ID } from './networks'
import { defineTokens } from './tokens'

const { MAINNET } = ChainId

export const mainnetTokens = defineTokens({
  pokemoney: new Token(MAINNET, '0x32ff5b4C3B1744F0344D96fA2f87799Ed2805749', 18, 'PMY', 'Pokemoney Coin', ''),
} as const)

export const testnetTokens = defineTokens({} as const)

const tokens = () => {
  const chainId = CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    }, {} as typeof testnetTokens & typeof mainnetTokens)
  }

  return mainnetTokens
}

const unserializedTokens = tokens()

export default unserializedTokens
