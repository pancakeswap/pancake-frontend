import { useEffect, useState } from 'react'
import { getLpContract } from 'utils/contractHelpers'
import { Token } from '@pancakeswap/sdk'
import { multicallv2 } from '../utils/multicall'
import lpTokenAbi from '../config/abi/lpToken.json'
import bep20Abi from '../config/abi/erc20.json'

export interface LPToken {
  token0: Token
  token1: Token
  name: string
}

const useLPToken = (tokenAddress: string) => {
  const [lpToken, setLPToken] = useState<LPToken>(null)

  useEffect(() => {
    const fetchLPToken = async () => {
      const contract = getLpContract(tokenAddress)
      try {
        const lpCalls = ['token0', 'token1'].map((method) => ({
          address: tokenAddress,
          name: method,
        }))
        const [[token0Address], [token1Address]] = await multicallv2(lpTokenAbi, lpCalls)

        const tokenCalls = [token0Address, token1Address].map((address) => ({
          address,
          name: 'symbol',
        }))
        const [[token0Symbol], [token1Symbol]] = await multicallv2(bep20Abi, tokenCalls)

        const network = await contract.provider.getNetwork()
        setLPToken({
          token0: new Token(network.chainId, token0Address, 18, token0Symbol),
          token1: new Token(network.chainId, token1Address, 18, token1Symbol),
          name: `${token0Symbol} - ${token1Symbol} LP`,
        })
      } catch (e) {
        console.error(e)
        setLPToken(null)
      }
    }

    fetchLPToken()
  }, [tokenAddress])

  return lpToken
}

export default useLPToken
