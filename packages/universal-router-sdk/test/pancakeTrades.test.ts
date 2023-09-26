import { CurrencyAmount as PancakeCurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Wallet, utils } from 'ethers'
import { PublicClient, WalletClient } from 'viem'
import { PancakeUniSwapRouter } from '../src/SwapRouterPancake'
import { PoolType, RouteType } from '../src/utils/types'
import { FORGE_PERMIT2_ADDRESS, FORGE_ROUTER_ADDRESS } from './utils/addresses'
import { getBalancesEthers, getViemClient } from './utils/client'
import {
  PANCAKE_ETHER,
  PANCAKE_USDC,
  PANCAKE_WETH,
  getPancakePair,
  getPancakePool,
  getProvider,
  makeV2Trade,
  makeV3Pool,
  makeV3Trade,
  pancakeSwapOptions,
} from './utils/pancakeswapData'
import { generatePermitSignature, makePermit, toInputPermit } from './utils/permit2'

// import ERC20ABI from '../abis/ERC20.json'

// note: these tests aren't testing much but registering calldata to interop file
// for use in forge fork tests
describe('PancakeSwap', () => {
  let walletClient: WalletClient
  let publicClient: PublicClient

  beforeEach(async () => {
    const { goerliTestnetClient, goerliTestnetPublicClient } = await getViemClient()
    walletClient = goerliTestnetClient
    publicClient = goerliTestnetPublicClient
  })

  describe('v2', () => {
    it('encodes a single exactInput ETH->USDC swap', async () => {
      const pancakeInputEther = PancakeCurrencyAmount.fromRawAmount(PANCAKE_ETHER, 1n * 10n ** 10n)
      const { reserve0, reserve1 } = await getPancakePair(PANCAKE_WETH, PANCAKE_USDC)
      const r1 = PancakeCurrencyAmount.fromRawAmount(PANCAKE_WETH, BigInt(Number(reserve0)))
      const r2 = PancakeCurrencyAmount.fromRawAmount(PANCAKE_USDC, BigInt(Number(reserve1)))
      const provider = await getProvider()
      const signer = new Wallet('be69567da8668dae832436a18c303ed76836f008dc5e3e3b5eee1684154a7ddd', provider)

      const v2PancakeTrade = makeV2Trade(
        [{ type: PoolType.V2, reserve0: r1, reserve1: r2 }],
        PANCAKE_ETHER,
        PANCAKE_USDC,
        pancakeInputEther,
        TradeType.EXACT_INPUT
      )
      const pcsopts = pancakeSwapOptions({})
      const { value, calldata } = await PancakeUniSwapRouter.swapERC20CallParameters(v2PancakeTrade as any, pcsopts)

      const tx = {
        to: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        data: calldata,
        value: value,
        gasLimit: 300000,
      }

      await signer.estimateGas(tx)
    })
  })
  it('PERMIS2 TEST', async () => {
    const pancakeInputUsdc = utils.parseUnits('1000', 6).toString()
    const pancakeInputuSDC2 = PancakeCurrencyAmount.fromRawAmount(PANCAKE_USDC, 1000n * 10n ** 6n)
    const provider = await getProvider()
    const signer = new Wallet('be69567da8668dae832436a18c303ed76836f008dc5e3e3b5eee1684154a7ddd', provider)

    const { reserve0, reserve1 } = await getPancakePair(PANCAKE_USDC, PANCAKE_WETH)

    const r1 = PancakeCurrencyAmount.fromRawAmount(PANCAKE_USDC, BigInt(Number(reserve0)))
    const r2 = PancakeCurrencyAmount.fromRawAmount(PANCAKE_WETH, BigInt(Number(reserve1)))

    const v2PancakeTrade = makeV2Trade(
      [{ type: PoolType.V2, reserve0: r1, reserve1: r2 }],
      PANCAKE_USDC,
      PANCAKE_WETH,
      pancakeInputuSDC2,
      TradeType.EXACT_INPUT
    )
    const permit = makePermit(PANCAKE_USDC.address, pancakeInputUsdc, undefined, FORGE_ROUTER_ADDRESS)
    const signature = await generatePermitSignature(permit, signer, 5, FORGE_PERMIT2_ADDRESS)
    const opts = pancakeSwapOptions({ inputTokenPermit: toInputPermit(signature, permit) })

    const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters([v2PancakeTrade] as any, opts)
  })
  describe('v3', () => {
    it('encodes a single exactInput ETH->USDC swap', async () => {
      const pancakeInputEther = PancakeCurrencyAmount.fromRawAmount(PANCAKE_ETHER, 1n * 10n ** 16n)

      const provider = await getProvider()
      const signer = new Wallet('be69567da8668dae832436a18c303ed76836f008dc5e3e3b5eee1684154a7ddd', provider)
      const { nativeBalance: nativeBalanceBefore, tokenBalance: tokenBalanceBefore } = await getBalancesEthers(
        PANCAKE_USDC
      )

      const pool = await getPancakePool(PANCAKE_WETH, PANCAKE_USDC, FeeAmount.MEDIUM)
      const PANCAKE_WETH_USDC_V3 = makeV3Pool(
        PANCAKE_WETH,
        PANCAKE_USDC,
        pool.liquidity.toString(),
        pool.tick.toString()
      )

      const v3Trade = await makeV3Trade(
        [PANCAKE_WETH_USDC_V3],
        PANCAKE_ETHER,
        PANCAKE_USDC,
        pancakeInputEther,
        TradeType.EXACT_INPUT
      )
      const pcsopts = pancakeSwapOptions({})

      const { value, calldata } = await PancakeUniSwapRouter.swapERC20CallParameters(v3Trade as any, pcsopts)

      const tx = {
        to: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        data: calldata,
        value: value,
        gasLimit: 300000,
      }

      await signer.estimateGas(tx)
    })
  })

  describe('mixed route', () => {
    it('encodes a single exactInput ETH->USDC swap', async () => {
      const pancakeInputEther = PancakeCurrencyAmount.fromRawAmount(PANCAKE_ETHER, 1n * 10n ** 14n)

      const provider = await getProvider()
      const signer = new Wallet('be69567da8668dae832436a18c303ed76836f008dc5e3e3b5eee1684154a7ddd', provider)

      const { reserve0, reserve1 } = await getPancakePair(PANCAKE_WETH, PANCAKE_USDC)
      const r1 = PancakeCurrencyAmount.fromRawAmount(PANCAKE_WETH, BigInt(Number(reserve0)))
      const r2 = PancakeCurrencyAmount.fromRawAmount(PANCAKE_USDC, BigInt(Number(reserve1)))
      const v2PancakeTrade = makeV2Trade(
        [{ type: PoolType.V2, reserve0: r1, reserve1: r2 }],
        PANCAKE_ETHER,
        PANCAKE_USDC,
        pancakeInputEther,
        TradeType.EXACT_INPUT
      )

      const pool = await getPancakePool(PANCAKE_WETH, PANCAKE_USDC, FeeAmount.HIGH)
      const PANCAKE_WETH_USDC_V3 = makeV3Pool(
        PANCAKE_WETH,
        PANCAKE_USDC,
        pool.liquidity.toString(),
        pool.tick.toString()
      )
      const v3Trade = await makeV3Trade(
        [PANCAKE_WETH_USDC_V3],
        PANCAKE_ETHER,
        PANCAKE_USDC,
        pancakeInputEther,
        TradeType.EXACT_INPUT
      )

      const mixedRouteTrade1 = {
        ...v2PancakeTrade,
        routes: v2PancakeTrade.routes.map((r) => ({ ...r, type: RouteType.MIXED })),
      }
      const mixedRouteTrade2 = {
        ...v3Trade,
        routes: v3Trade.routes.map((r) => ({ ...r, type: RouteType.MIXED })),
      }

      const pcsopts = pancakeSwapOptions({})
      const { value, calldata } = await PancakeUniSwapRouter.swapERC20CallParameters(
        [mixedRouteTrade1, mixedRouteTrade2] as any,
        pcsopts
      )
      // console.log(calldata, value)

      const tx = {
        to: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        data: calldata,
        value: value,
        gasLimit: 300000,
      }

      await signer.estimateGas(tx)
    })
  })
})
