import { ChainId } from '@pancakeswap/sdk'

// BSC testnet
// export const FACTORY_ADDRESS = '0x64014BA9bFb1f77991C11e19A4caf8628Ba7e1e4'
export const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

// TODO: v3 swap address update
export const FACTORY_ADDRESSES: any = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.GOERLI]: '0x6e906fC1d75c9559E4E8b0F1Fa002C4a9724988f',
  [ChainId.BSC_TESTNET]: '0xB46d40a16E949270B44940B0482F1b0951a67046',
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

// BSC testnet
// export const POOL_INIT_CODE_HASH = '0x6e60bee46dd509cb7aa4e8b6342b6063a6ffd0c2b33c075ece472b3d55414b3a'
export const POOL_INIT_CODE_HASH = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'

// TODO: v3 swap address update
export const POOL_INIT_CODE_HASHES: any = {
  [ChainId.ETHEREUM]: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
  [ChainId.GOERLI]: '0x589f56062cee9ba1b76b4392e1fde4b21ef19a99fa464344e41e500088948cea',
  [ChainId.BSC_TESTNET]: '0x589f56062cee9ba1b76b4392e1fde4b21ef19a99fa464344e41e500088948cea',
}

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
}
