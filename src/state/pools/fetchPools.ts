import poolsConfig from 'sushi/lib/constants/pools'
import sousChefABI from 'sushi/lib/abi/sousChef.json'
import cakeABI from 'sushi/lib/abi/sushi.json'
import wbnbABI from 'sushi/lib/abi/weth.json'
import addresses from 'sushi/lib/constants/contracts'
import { QuoteToken } from 'sushi/lib/constants/types'
import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress[CHAIN_ID],
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress[CHAIN_ID],
      name: 'bonusEndBlock',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toNumber(),
      endBlock: new BigNumber(endBlock).toNumber(),
    }
  })
}

export const fetchPoolsTotalStatking = async () => {
  const cakePools = poolsConfig.filter((p) => p.stakingTokenName !== QuoteToken.BNB)
  const bnbPool = poolsConfig.filter((p) => p.stakingTokenName === QuoteToken.BNB)

  const callsCakePools = cakePools.map((poolConfig) => {
    return {
      address: addresses.sushi[CHAIN_ID],
      name: 'balanceOf',
      params: [poolConfig.contractAddress[CHAIN_ID]],
    }
  })

  const callsBnbPools = bnbPool.map((poolConfig) => {
    return {
      address: addresses.wbnb[CHAIN_ID],
      name: 'balanceOf',
      params: [poolConfig.contractAddress[CHAIN_ID]],
    }
  })

  const cakePoolsTotalStaked = await multicall(cakeABI, callsCakePools)
  const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)

  return [
    ...cakePools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(cakePoolsTotalStaked[index]).toNumber(),
    })),
    ...bnbPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toNumber(),
    })),
  ]
}
