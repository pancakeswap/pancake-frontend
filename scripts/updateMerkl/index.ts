import fs from 'fs'
import os from 'os'

type MerklConfigPool = {
  chainId: number
  // lp address
  address: `0x${string}`
  // link to merkl.angle.money
  link: string
}

type MerklPool = {
  ammName: string
  chainId: number
  pool: `0x${string}`
  token0: `0x${string}`
  token1: `0x${string}`
  symbolToken0: string
  symbolToken1: string
  aprs: Record<string, number>
}

type MerklConfig = {
  merkleRoot: string
  message: string
  pools: {
    [address: string]: MerklPool
  }
}

type MerklConfigResponse = {
  [chainId: number]: MerklConfig
}

export const chainIdToChainName = {
  1: 'ethereum',
  56: 'bnb smart chain',
  324: 'zkync',
  1101: 'polygon zkevm',
  8453: 'base',
  42161: 'arbitrum',
  59144: 'linea',
} as const

const fetchAllMerklConfig = async (): Promise<MerklConfigResponse> => {
  const response = await fetch('https://api.angle.money/v2/merkl')

  if (!response.ok) {
    throw new Error('Unable to fetch merkl config')
  }

  return response.json() as Promise<MerklConfigResponse>
}

const parseMerklConfig = (merklConfig: MerklConfig[]): MerklConfigPool[] => {
  const pools = merklConfig.reduce((acc, config) => {
    const _pools = Object.values(config.pools).filter(
      (pool) => Object.keys(pool.aprs).length > 1 && pool.ammName.toLowerCase().startsWith('pancakeswap'),
    )
    return [...acc, ..._pools]
  }, [] as MerklPool[])

  return pools.map((pool) => ({
    chainId: pool.chainId,
    address: pool.pool,
    link: encodeURI(`https://merkl.angle.money/${chainIdToChainName[pool.chainId]}/pool/2/${pool.pool}`),
  }))
}

const run = async () => {
  console.info('Fetching merkl config...')
  const merklConfig = await fetchAllMerklConfig()
  console.info('Fetched merkl config!', Object.keys(merklConfig).length)
  console.info('Parsing merkl config...')
  const merklPools = parseMerklConfig(Object.values(merklConfig))
  console.info('Writing merkl config...')

  fs.writeFile(`apps/web/src/config/constants/merklPools.json`, JSON.stringify(merklPools, null, 2) + os.EOL, (err) => {
    if (err) throw err
    console.info(` ✅ - merklPools.json has been updated!`)
  })
}

run()
