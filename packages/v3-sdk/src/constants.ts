import { ChainId } from '@pancakeswap/sdk'

// TODO: add BSC mainnet FACTORY_ADDRESS
const FACTORY_ADDRESS = '0xD84787a01B0cad89fBCa231E6960cC0f3f18df34'

const FACTORY_ADDRESSES: any = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.GOERLI]: '0x6e906fC1d75c9559E4E8b0F1Fa002C4a9724988f',
  [ChainId.BSC_TESTNET]: '0xD84787a01B0cad89fBCa231E6960cC0f3f18df34',
}

// Temp: ETHEREUM & ETHEREUM using FACTORY_ADDRESSES to pass Unit Test
// TODO: v3 contract addresses PancakeV3PoolDeployer
export const DEPLOYER_ADDRESSES: any = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.GOERLI]: '0x6e906fC1d75c9559E4E8b0F1Fa002C4a9724988f',
  [ChainId.BSC_TESTNET]: '0xdb19f2052D2B1aD46Ed98C66336A5dAADEB13005',
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

// TODO: add BSC mainnet POOL_INIT_CODE_HASH
// TODO: v3 contract addresses POOL_INIT_CODE_HASH
export const POOL_INIT_CODE_HASH = '0x56b1a753ca30d0bd257a3f6a7b3f523ec029f77c1daeeb349c3ec9e2413f1365'

// TODO: v3 contract addresses POOL_INIT_CODE_HASH
export const POOL_INIT_CODE_HASHES: any = {
  [ChainId.ETHEREUM]: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
  [ChainId.GOERLI]: '0x589f56062cee9ba1b76b4392e1fde4b21ef19a99fa464344e41e500088948cea',
  [ChainId.BSC_TESTNET]: '0x56b1a753ca30d0bd257a3f6a7b3f523ec029f77c1daeeb349c3ec9e2413f1365',
}

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 2500,
  HIGH = 10000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 50,
  [FeeAmount.HIGH]: 200,
}
