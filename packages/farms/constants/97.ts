import { bscTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { FarmConfigV3, SerializedFarmConfig } from '@pancakeswap/farms'

export const farmsV3 = [
  {
    pid: 1,
    lpSymbol: 'USDT-BNB LP',
    lpAddress: '0x137957f79CA4d8C5eb11916Da8E0f33E29470b48',
    token: bscTestnetTokens.usdt,
    quoteToken: bscTestnetTokens.wbnb,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 2,
    lpSymbol: 'USDT-MSIX LP',
    lpAddress: '0x590E303f602DDAd3E37C9984fDde9f4dB64Ec5F7',
    token: bscTestnetTokens.usdt,
    quoteToken: bscTestnetTokens.msix,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 3,
    lpSymbol: 'MockB-MockA LP (0.05%)',
    lpAddress: '0x72C82FE7aa756dAAD72bC371E14BEfEE43060454',
    token: bscTestnetTokens.mockB,
    quoteToken: bscTestnetTokens.mockA,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 4,
    lpSymbol: 'BUSD-CAKE LP',
    lpAddress: '0xA37267D2AE419a48333924796d11bFdd04a466D5',
    token: bscTestnetTokens.busd,
    quoteToken: bscTestnetTokens.cake,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 5,
    lpSymbol: 'MockB-MockA LP (0.01%)',
    lpAddress: '0xa776e0C72b9F3890Bfd19cc60C3cD41e31E84696',
    token: bscTestnetTokens.mockB,
    quoteToken: bscTestnetTokens.mockA,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 6,
    lpSymbol: 'MockB-MockA LP (1%)',
    lpAddress: '0xE70a66945E99fB3Ac701A155CFfB2Ce3C95a9016',
    token: bscTestnetTokens.mockB,
    quoteToken: bscTestnetTokens.mockA,
    feeAmount: FeeAmount.HIGH,
  },
  {
    pid: 7,
    lpSymbol: 'WBNB-CAKE LP',
    lpAddress: '0x45B3515d59FEbDB6260139e134eF3aA661dd1045',
    token: bscTestnetTokens.wbnb,
    quoteToken: bscTestnetTokens.cake,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 8,
    lpSymbol: 'WBNB-CAKE2 LP',
    lpAddress: '0xa31AD03f273FeD1283D271A0b9382159Fa72d860',
    token: bscTestnetTokens.wbnb,
    quoteToken: bscTestnetTokens.cake2,
    feeAmount: FeeAmount.MEDIUM,
  },
] satisfies FarmConfigV3[]

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'CAKE',
    lpAddress: '0x36e3E4fF6471559b19F66bD10985534d5e214D44',
    token: bscTestnetTokens.syrup,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'BUSD-CAKE LP',
    lpAddress: '0xb98C30fA9f5e9cf6749B7021b4DDc0DBFe73b73e',
    token: bscTestnetTokens.busd,
    quoteToken: bscTestnetTokens.cake,
  },
  {
    pid: 4,
    lpSymbol: 'CAKE-BNB LP',
    lpAddress: '0xa96818CA65B57bEc2155Ba5c81a70151f63300CD',
    token: bscTestnetTokens.cake,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 10,
    lpSymbol: 'BNB-BUSD LP',
    lpAddress: '0x4E96D2e92680Ca65D58A0e2eB5bd1c0f44cAB897',
    token: bscTestnetTokens.wbnb,
    quoteToken: bscTestnetTokens.busd,
  },
  {
    pid: 9,
    lpSymbol: 'BUSD-USDC LP',
    lpAddress: '0x7CA885d338462790DD1B5416ebe6bec75ee045a1',
    token: bscTestnetTokens.mockBusd, // coins[0]
    quoteToken: bscTestnetTokens.usdc, // coins[1]
    stableSwapAddress: '0xd5E56CD4c8111643a94Ee084df31F44055a1EC9F',
    infoStableSwapAddress: '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546',
    stableLpFee: 0.0002,
    stableLpFeeRateOfTotalFee: 0.5,
  },
  {
    pid: 11,
    lpSymbol: 'USDT-BUSD LP',
    lpAddress: '0x9Fa2Ef2C3dF6F903F4b73047311e861C51a11B60',
    token: bscTestnetTokens.usdt, // coins[0]
    quoteToken: bscTestnetTokens.mockBusd, // coins[1]
    stableSwapAddress: '0xc418d68751Cbe0407C8fdd90Cde73cE95b892f39',
    infoStableSwapAddress: '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546',
    stableLpFee: 0.0002,
    stableLpFeeRateOfTotalFee: 0.5,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
