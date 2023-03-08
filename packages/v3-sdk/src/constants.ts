import { ChainId } from '@pancakeswap/sdk'

// TODO: add BSC mainnet FACTORY_ADDRESS
export const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

export const FACTORY_ADDRESSES: any = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.GOERLI]: '0x6e906fC1d75c9559E4E8b0F1Fa002C4a9724988f',
  [ChainId.BSC_TESTNET]: '0x6C816814D8c03F6B4e55c7965d9814B151336775',
}

// Temp: ETHEREUM & ETHEREUM using FACTORY_ADDRESSES to pass Unit Test
export const DEPLOYER_ADDRESSES: any = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.GOERLI]: '0x6e906fC1d75c9559E4E8b0F1Fa002C4a9724988f',
  [ChainId.BSC_TESTNET]: '0x4fdbcAD9aD3B53506651D64261264683C2F03915',
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

// TODO: add BSC mainnet POOL_INIT_CODE_HASH
export const POOL_INIT_CODE_HASH = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'

// TODO: v3 swap address update
export const POOL_INIT_CODE_HASHES: any = {
  [ChainId.ETHEREUM]: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
  [ChainId.GOERLI]: '0x589f56062cee9ba1b76b4392e1fde4b21ef19a99fa464344e41e500088948cea',
  [ChainId.BSC_TESTNET]: '0x047312aa3f95acba47c2ee85f24a2291a3f51b126a03123d203291dae8494736',
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
  [FeeAmount.LOWEST]: 2,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
}
