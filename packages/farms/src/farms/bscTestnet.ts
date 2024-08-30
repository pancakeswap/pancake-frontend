import { ChainId } from '@pancakeswap/chains'
import { bscTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { getAddress } from 'viem'
import { defineFarmV3ConfigsFromUniversalFarm } from '../defineFarmV3Configs'
import { Protocol, SerializedFarmConfig, UniversalFarmConfig, UniversalFarmConfigV3 } from '../types'

const pinnedFarmConfig: UniversalFarmConfig[] = []

export const bscTestnetFarmConfig: UniversalFarmConfig[] = [
  ...pinnedFarmConfig,
  {
    pid: 1,
    chainId: ChainId.BSC_TESTNET,
    protocol: Protocol.V3,
    lpAddress: '0x5147173E452AE4dd23dcEe7BaAaaAB7318F16F6B',
    token0: bscTestnetTokens.usdt,
    token1: bscTestnetTokens.wbnb,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 2,
    chainId: ChainId.BSC_TESTNET,
    protocol: Protocol.V3,
    lpAddress: '0xe62C422c1E8083CE3b4526Ff0b16388354AB6E64',
    token0: bscTestnetTokens.cake2,
    token1: bscTestnetTokens.wbnb,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 3,
    chainId: ChainId.BSC_TESTNET,
    protocol: Protocol.V3,
    lpAddress: '0xc0E0F94a79Aabc6c655f308Da21D6EbDE64b0995',
    token0: bscTestnetTokens.mockB,
    token1: bscTestnetTokens.mockA,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 4,
    chainId: ChainId.BSC_TESTNET,
    protocol: Protocol.V3,
    lpAddress: '0xf7f2894abd4beE559521D754c5D481730E1C7d8C',
    token0: bscTestnetTokens.mockB,
    token1: bscTestnetTokens.mockA,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 5,
    chainId: ChainId.BSC_TESTNET,
    protocol: Protocol.V3,
    lpAddress: '0x5d9550E870D42Ae03Fab91508cC5722A80CF0b5e',
    token0: bscTestnetTokens.mockB,
    token1: bscTestnetTokens.mockA,
    feeAmount: FeeAmount.HIGH,
  },
  {
    pid: 6,
    chainId: ChainId.BSC_TESTNET,
    protocol: Protocol.V3,
    lpAddress: '0x427d29C609A85AA3aaF87Aff65C392D72588ceC2',
    token0: bscTestnetTokens.cake2,
    token1: bscTestnetTokens.busd,
    feeAmount: FeeAmount.MEDIUM,
  },
]

export default bscTestnetFarmConfig

/** @deprecated */
export const legacyV3BscTestnetFarmConfig = defineFarmV3ConfigsFromUniversalFarm(
  bscTestnetFarmConfig.filter((farm): farm is UniversalFarmConfigV3 => farm.protocol === Protocol.V3),
)

/** @deprecated */
export const legacyFarmConfig: SerializedFarmConfig[] = [
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
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: getAddress(p.lpAddress),
}))
