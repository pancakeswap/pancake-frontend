import { ERC20Token, Pair } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { safeGetAddress } from 'utils'
import memoize from 'lodash/memoize'

const getLpAddress = memoize(
  (token1: string | ERC20Token | undefined, token2: string | ERC20Token | undefined, chainId: number = ChainId.BSC) => {
    let token1AsTokenInstance = token1
    let token2AsTokenInstance = token2
    if (!token1 || !token2) {
      return null
    }
    if (typeof token1 === 'string' || token1 instanceof String) {
      const checksummedToken1Address = safeGetAddress(token1)
      if (!checksummedToken1Address) {
        return null
      }
      token1AsTokenInstance = new ERC20Token(chainId, checksummedToken1Address, 18, 'Cake-LP')
    }
    if (typeof token2 === 'string' || token2 instanceof String) {
      const checksummedToken2Address = safeGetAddress(token2)
      if (!checksummedToken2Address) {
        return null
      }
      token2AsTokenInstance = new ERC20Token(chainId, checksummedToken2Address, 18, 'Cake-LP')
    }
    return Pair.getAddress(token1AsTokenInstance as ERC20Token, token2AsTokenInstance as ERC20Token)
  },
  (token1, token2, chainId) => {
    // @ts-ignore
    return `${token1?.address || token1}#${token2?.address || token2}#${chainId}`
  },
)

export default getLpAddress
