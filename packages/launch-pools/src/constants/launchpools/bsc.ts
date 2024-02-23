import { PoolCategory, SerializedPool } from '@pancakeswap/pools'
import { bscTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

export const livePools: SerializedPool[] = [
  {
    sousId: 0,
    stakingToken: bscTokens.cake,
    earningToken: bscTokens.cake,
    contractAddress: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },
  {
    sousId: 370,
    stakingToken: bscTokens.cake,
    earningToken: bscTokens.defi,
    contractAddress: '0x887b8E18cb4aE23A4db11B365cc20fD0Cf00FEe0',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.01736',
    version: 3,
  },
  {
    sousId: 369,
    stakingToken: bscTokens.cake,
    earningToken: bscTokens.gtai,
    contractAddress: '0x2C52E3008E0506c9DD98492af49f31733a0a1AC9',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.0027',
    version: 3,
  },
  {
    sousId: 368,
    stakingToken: bscTokens.cake,
    earningToken: bscTokens.cgpt,
    contractAddress: '0x55c8BcEc0df2A61B6eF24815B3462293A27366a2',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.038',
    version: 3,
  },
  {
    sousId: 367,
    stakingToken: bscTokens.cake,
    earningToken: bscTokens.irl,
    contractAddress: '0x41cD0Fad28F8531De22617959bc943F1B3E12Bd8',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.0694444444444445',
    version: 3,
  },
  {
    sousId: 366,
    stakingToken: bscTokens.cake,
    earningToken: bscTokens.ckp,
    contractAddress: '0x87f0210c658c81e854e6022315cD68804944acaE',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.001929',
    version: 3,
  },
  {
    sousId: 365,
    stakingToken: bscTokens.cake,
    earningToken: bscTokens.ace,
    contractAddress: '0xafB6d6B64fe5007EeE87210B91638ddCeb9f326B',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.003858',
    isFinished: false,
    version: 3,
  },
].map((p) => ({
  ...p,
  contractAddress: getAddress(p.contractAddress),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

// known finished pools
const finishedPools = [
  {
    sousId: 364,
    stakingToken: bscTokens.cake,
    earningToken: bscTokens.csix,
    contractAddress: '0x692dF8297495f02f31a24A93D10Bd77D072840d7',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.5131',
    version: 3,
  },
].map((p) => ({
  ...p,
  isFinished: true,
  contractAddress: getAddress(p.contractAddress),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

export const launchPools: SerializedPool[] = [...livePools, ...finishedPools]
