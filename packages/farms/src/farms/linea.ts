import { ChainId } from '@pancakeswap/chains'
import { lineaTokens } from '@pancakeswap/tokens'
import { FeeAmount, Pool } from '@pancakeswap/v3-sdk'
import { defineFarmV3ConfigsFromUniversalFarm } from '../defineFarmV3Configs'
import { Protocol, SerializedFarmConfig, UniversalFarmConfig, UniversalFarmConfigV3 } from '../types'

const pinnedFarmConfig: UniversalFarmConfig[] = [
  {
    pid: 9,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.usdc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOWEST,
    lpAddress: Pool.getAddress(lineaTokens.usdc, lineaTokens.weth, FeeAmount.LOWEST),
  },
  {
    pid: 12,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.usdt,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOWEST,
    lpAddress: Pool.getAddress(lineaTokens.usdt, lineaTokens.weth, FeeAmount.LOWEST),
  },
  {
    pid: 1,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.usdc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(lineaTokens.usdc, lineaTokens.weth, FeeAmount.LOW),
  },
  {
    pid: 8,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.usdt,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(lineaTokens.usdt, lineaTokens.weth, FeeAmount.LOW),
  },

  {
    pid: 2,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.usdc,
    token1: lineaTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
    lpAddress: Pool.getAddress(lineaTokens.usdc, lineaTokens.usdt, FeeAmount.LOWEST),
  },
  {
    pid: 10,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.wbtc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOWEST,
    lpAddress: Pool.getAddress(lineaTokens.wbtc, lineaTokens.weth, FeeAmount.LOWEST),
  },
  {
    pid: 3,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.wbtc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(lineaTokens.wbtc, lineaTokens.weth, FeeAmount.LOW),
  },
]

export const lineaFarmConfig: UniversalFarmConfig[] = [
  ...pinnedFarmConfig,
  {
    pid: 14,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.foxy,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.HIGH,
    lpAddress: Pool.getAddress(lineaTokens.foxy, lineaTokens.weth, FeeAmount.HIGH),
  },
  {
    pid: 13,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.ezETH,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(lineaTokens.ezETH, lineaTokens.weth, FeeAmount.LOW),
  },

  {
    pid: 11,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.cake,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.HIGH,
    lpAddress: Pool.getAddress(lineaTokens.cake, lineaTokens.weth, FeeAmount.HIGH),
  },

  {
    pid: 7,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.wstETH,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(lineaTokens.wstETH, lineaTokens.weth, FeeAmount.LOW),
  },
  {
    pid: 6,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.wstETH,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOWEST,
    lpAddress: Pool.getAddress(lineaTokens.wstETH, lineaTokens.weth, FeeAmount.LOWEST),
  },

  {
    pid: 4,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.usdc,
    token1: lineaTokens.dai,
    feeAmount: FeeAmount.LOWEST,
    lpAddress: Pool.getAddress(lineaTokens.usdc, lineaTokens.dai, FeeAmount.LOWEST),
  },
  {
    pid: 5,
    chainId: ChainId.LINEA,
    protocol: Protocol.V3,
    token0: lineaTokens.usdc,
    token1: lineaTokens.axlusdc,
    feeAmount: FeeAmount.LOWEST,
    lpAddress: Pool.getAddress(lineaTokens.usdc, lineaTokens.axlusdc, FeeAmount.LOWEST),
  },
]

export default lineaFarmConfig

/** @deprecated */
export const legacyV3LineaFarmConfig = defineFarmV3ConfigsFromUniversalFarm(
  lineaFarmConfig.filter((farm): farm is UniversalFarmConfigV3 => farm.protocol === Protocol.V3),
)

/** @deprecated */
export const legacyFarmConfig: SerializedFarmConfig[] = []
