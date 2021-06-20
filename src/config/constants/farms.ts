import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  // {
  //   pid: 0,
  //   lpSymbol: 'ZMBE',
  //   lpAddresses: {
  //     97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
  //     56: '0x632ad2e26a78d89a841d756523fd03c6beb4bf13',
  //   },
  //   token: tokens.syrup,
  //   quoteToken: tokens.zmbe,
  // },
  // {
  //   pid: 252,
  //   lpSymbol: 'ZMBE-ADA LP',
  //   lpAddresses: {
  //     97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e', // todo fix addresses
  //     56: '0x8107a88173992cac53d76cf42a8561fb14c88f4d',
  //   },
  //   token: tokens.zmbe,
  //   quoteToken: tokens.ada,
  // },
  // {
  //   pid: 251,
  //   lpSymbol: 'CAKE-BNB LP',
  //   lpAddresses: {
  //     97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
  //     56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
  //   },
  //   token: tokens.cake,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 2,
  //   lpSymbol: 'BUSD-BNB LP',
  //   lpAddresses: {
  //     97: '0x2f7682b64b88149ba3250aee32db712964de5fa9',
  //     56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
  //   },
  //   token: tokens.busd,
  //   quoteToken: tokens.wbnb,
  // },
  // /**
  //  * All farms below here are from v1 and are to be set to 0x
  //  */
  // {
  //   pid: 1,
  //   lpSymbol: 'CAKE-BNB LP',
  //   lpAddresses: {
  //     97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
  //     56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
  //   },
  //   token: tokens.cake,
  //   quoteToken: tokens.wbnb,
  // },
]

export default farms
