import { ChainId } from '@pancakeswap/chains'
import {
  ERC20Token,
  Ether,
  Trade as V2Trade,
  Route as V2Route,
  Pair,
  CurrencyAmount,
  TradeType,
  Percent,
} from '@pancakeswap/sdk'
import { FeeOptions, Trade as V3Trade, Route as V3Route, Pool } from '@pancakeswap/v3-sdk'
import { PoolType, SmartRouterTrade, V2Pool, V3Pool } from '@pancakeswap/smart-router/evm'
import { parseEther, parseUnits, Address, WalletClient, zeroAddress } from 'viem'
import { convertPoolToV3Pool, fixtureAddresses, getStablePool } from './fixtures/address'
import { getPublicClient, getWalletClient } from './fixtures/clients'
import { PancakeUniversalSwapRouter } from '../src'
import { PancakeSwapOptions } from '../src/utils/types'
import { buildMixedRouteTrade, buildStableTrade, buildV2Trade, buildV3Trade } from './utils/buildTrade'
import { makePermit, signEIP2098Permit, signPermit } from './utils/permit'
import { Permit2Permit } from '../src/utils/inputTokens'

const swapOptions = (options: Partial<PancakeSwapOptions>): PancakeSwapOptions => {
  let slippageTolerance = new Percent(5, 100)
  if (options.fee) slippageTolerance = slippageTolerance.add(options.fee.fee)
  return {
    slippageTolerance,
    recipient: zeroAddress,
    ...options,
  }
}

describe('PancakeSwap Universal Router Trade', () => {
  const chainId = ChainId.ETHEREUM
  const liquidity = parseEther('1000')

  let wallet: WalletClient

  let ETHER: Ether
  let USDC: ERC20Token
  let USDT: ERC20Token
  let WETH: ERC20Token
  let WETH_USDC_V2: Pair
  let USDC_USDT_V2: Pair
  let WETH_USDC_V3_MEDIUM: Pool
  let USDC_USDT_V3_LOW: Pool
  let UNIVERSAL_ROUTER: Address
  let PERMIT2: Address

  beforeEach(async () => {
    ;({
      UNIVERSAL_ROUTER,
      PERMIT2,
      ETHER,
      USDC,
      USDT,
      WETH,
      WETH_USDC_V2,
      USDC_USDT_V2,
      USDC_USDT_V3_LOW,
      WETH_USDC_V3_MEDIUM,
    } = await fixtureAddresses(chainId, liquidity))
    wallet = getWalletClient({ chainId })
  })

  describe('v2', () => {
    it('should encode a single exactInput ETH->USDC Swap', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode a single exactInput ETH->USDC Swap, with USDC fee', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const feeOptions = {
        recipient: zeroAddress,
        fee: new Percent(5, 100),
      }
      const options = swapOptions({
        fee: feeOptions,
      })

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode a exactInput ETH->USDC->USDT Swap', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2, USDC_USDT_V2], ETHER, USDT),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT
      )
      const v2Pools: V2Pool[] = [
        {
          type: PoolType.V2,
          reserve0: WETH_USDC_V2.reserve0,
          reserve1: WETH_USDC_V2.reserve1,
        },
        {
          type: PoolType.V2,
          reserve0: USDC_USDT_V2.reserve0,
          reserve1: USDC_USDT_V2.reserve1,
        },
      ]
      const trade = buildV2Trade(v2Trade, v2Pools)
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode a exactInput ETH->USDC->USDT Swap, with USDT fee', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2, USDC_USDT_V2], ETHER, USDT),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT
      )
      const v2Pools: V2Pool[] = [
        {
          type: PoolType.V2,
          reserve0: WETH_USDC_V2.reserve0,
          reserve1: WETH_USDC_V2.reserve1,
        },
        {
          type: PoolType.V2,
          reserve0: USDC_USDT_V2.reserve0,
          reserve1: USDC_USDT_V2.reserve1,
        },
      ]
      const trade = buildV2Trade(v2Trade, v2Pools)
      const feeOptions: FeeOptions = {
        recipient: zeroAddress,
        fee: new Percent(5, 100),
      }
      const options = swapOptions({ fee: feeOptions })

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode a single exactInput USDC->ETH Swap', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode a single exactInput USDC->ETH Swap, with WETH fee', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const feeOptions = {
        recipient: zeroAddress,
        fee: new Percent(5, 100),
      }
      const options = swapOptions({
        fee: feeOptions,
      })

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode a single exactInput USDC->ETH swap, with permit2', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])

      const permit = makePermit(USDC.address, UNIVERSAL_ROUTER)
      const signature = await signPermit(permit, wallet, PERMIT2)
      const permit2Permit: Permit2Permit = {
        ...permit,
        signature,
      }

      const options = swapOptions({
        inputTokenPermit: permit2Permit,
      })

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode a single exactInput USDC->ETH swap, with EIP-2098 permit', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])

      const permit = makePermit(USDC.address, UNIVERSAL_ROUTER)
      const signature = await signEIP2098Permit(permit, wallet, PERMIT2)
      const permit2Permit: Permit2Permit = {
        ...permit,
        signature,
      }

      const options = swapOptions({
        inputTokenPermit: permit2Permit,
      })

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode exactInput USDT->USDC->ETH swap', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([USDC_USDT_V2, WETH_USDC_V2], USDT, ETHER),
        CurrencyAmount.fromRawAmount(USDT, amountIn),
        TradeType.EXACT_INPUT
      )
      const v2Pools: V2Pool[] = [
        {
          type: PoolType.V2,
          reserve0: USDC_USDT_V2.reserve0,
          reserve1: USDC_USDT_V2.reserve1,
        },
        {
          type: PoolType.V2,
          reserve0: WETH_USDC_V2.reserve0,
          reserve1: WETH_USDC_V2.reserve1,
        },
      ]
      const trade = buildV2Trade(v2Trade, v2Pools)
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode exactOutput ETH-USDC swap', async () => {
      const amountOut = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(USDC, amountOut),
        TradeType.EXACT_OUTPUT
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).not.toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })

    it('should encode exactOutput USDC-ETH swap', async () => {
      const amountOut = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, amountOut),
        TradeType.EXACT_OUTPUT
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
  })

  describe('v3', () => {
    it('should encode a single exactInput ETH-USDC swap', async () => {
      const amountIn = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })
    it('should encode a single exactInput ETH-USDC swap, with a fee', async () => {
      const amountIn = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])

      const feeOptions: FeeOptions = {
        fee: new Percent(5, 100),
        recipient: zeroAddress,
      }
      const options = swapOptions({
        fee: feeOptions,
      })

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })
    it('should encode a single exactInput USDC->ETH swap', async () => {
      const amountIn = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
    it('should encode a single exactInput USDC->ETH swap, with a fee', async () => {
      const amountIn = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)
      const trade = buildV3Trade(v3Trade, [v3Pool])

      const feeOptions: FeeOptions = {
        fee: new Percent(5, 100),
        recipient: zeroAddress,
      }
      const options = swapOptions({
        fee: feeOptions,
      })

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
    it('should encode a single exactInput USDC->ETH swap, with permit2', async () => {
      const amountIn = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])

      const permit = makePermit(USDC.address, UNIVERSAL_ROUTER)
      const signature = await signPermit(permit, wallet, PERMIT2)
      const permit2Permit: Permit2Permit = {
        ...permit,
        signature,
      }
      const options = swapOptions({
        inputTokenPermit: permit2Permit,
      })

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
    it('should encode a exactInput ETH->USDC->USDT swap', async () => {
      const amountIn = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM, USDC_USDT_V3_LOW], ETHER, USDT),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT
      )
      const v3Pool: V3Pool[] = [convertPoolToV3Pool(WETH_USDC_V3_MEDIUM), convertPoolToV3Pool(USDC_USDT_V3_LOW)]

      const trade = buildV3Trade(v3Trade, v3Pool)
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })
    it('should encode a single exactOutput ETH->USDC swap', async () => {
      const amountOut = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], ETHER, USDC),
        CurrencyAmount.fromRawAmount(USDC, amountOut),
        TradeType.EXACT_OUTPUT
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).not.toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
    it('should encode a single exactOutput USDC->ETH swap', async () => {
      const amountOut = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], USDC, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, amountOut),
        TradeType.EXACT_OUTPUT
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
    it('should encode a exactOutput ETH->USDC->USDT swap', async () => {
      const amountOut = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM, USDC_USDT_V3_LOW], ETHER, USDT),
        CurrencyAmount.fromRawAmount(USDT, amountOut),
        TradeType.EXACT_OUTPUT
      )
      const v3Pool: V3Pool[] = [convertPoolToV3Pool(WETH_USDC_V3_MEDIUM), convertPoolToV3Pool(USDC_USDT_V3_LOW)]

      const trade = buildV3Trade(v3Trade, v3Pool)
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).not.toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
    it('should encode a exactOutput USDT->USDC->ETH swap', async () => {
      const amountOut = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([USDC_USDT_V3_LOW, WETH_USDC_V3_MEDIUM], USDT, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, amountOut),
        TradeType.EXACT_OUTPUT
      )
      const v3Pool: V3Pool[] = [convertPoolToV3Pool(USDC_USDT_V3_LOW), convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)]

      const trade = buildV3Trade(v3Trade, v3Pool)
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
  })
  describe('mixed', () => {
    it('should encodes a mixed exactInput ETH-v3->USDC-v2->USDT swap', async () => {
      const amountIn = parseEther('1')

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V3_MEDIUM, USDC_USDT_V2]
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })

    it('should encodes a mixed exactInput ETH-v2->USDC-v3->USDT swap', async () => {
      const amountIn = parseEther('1')

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V2, USDC_USDT_V3_LOW]
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })

    it('should encodes a mixed exactInput ETH-v2->USDC-v2->USDT swap', async () => {
      const amountIn = parseEther('1')

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V2, USDC_USDT_V2]
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })

    it('should encodes a mixed exactInput USDT-v2->USDC-v3->ETH swap', async () => {
      const amountIn = parseUnits('1000', 6)

      const trade = await buildMixedRouteTrade(
        USDT,
        CurrencyAmount.fromRawAmount(USDT, amountIn),
        TradeType.EXACT_INPUT,
        [USDC_USDT_V2, WETH_USDC_V3_MEDIUM]
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
  })
  describe('multi-route', () => {
    it('should encode a multi-route exactInput v2 ETH-USDC & v3 ETH-USDC', async () => {
      const amountIn = parseEther('1')
      const v2Trade = buildV2Trade(
        new V2Trade(
          new V2Route([WETH_USDC_V2], ETHER, USDC),
          CurrencyAmount.fromRawAmount(ETHER, amountIn),
          TradeType.EXACT_INPUT
        ),
        [
          {
            type: PoolType.V2,
            reserve0: WETH_USDC_V2.reserve0,
            reserve1: WETH_USDC_V2.reserve1,
          },
        ]
      )
      const v3Trade = buildV3Trade(
        await V3Trade.fromRoute(
          new V3Route([WETH_USDC_V3_MEDIUM], ETHER, USDC),
          CurrencyAmount.fromRawAmount(ETHER, amountIn),
          TradeType.EXACT_INPUT
        ),
        [convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)]
      )

      v2Trade.routes[0].percent = 50
      v3Trade.routes[0].percent = 50

      const options = swapOptions({})
      const trade: SmartRouterTrade<TradeType.EXACT_INPUT> = {
        tradeType: TradeType.EXACT_INPUT,
        inputAmount: CurrencyAmount.fromRawAmount(ETHER, amountIn * 2n),
        outputAmount: CurrencyAmount.fromRawAmount(USDC, amountIn),
        routes: [...v2Trade.routes, ...v3Trade.routes],
        gasEstimate: 0n,
        gasEstimateInUSD: CurrencyAmount.fromRawAmount(ETHER, amountIn),
      }

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)
      expect(BigInt(value)).toEqual(amountIn * 2n)
      expect(calldata).toMatchSnapshot()
    })
  })
})

describe('PancakeSwap StableSwap Through Universal Router, BSC Network Only', () => {
  const chainId = ChainId.BSC
  const liquidity = parseEther('1000')

  let wallet: WalletClient

  let ETHER: Ether
  let USDC: ERC20Token
  let USDT: ERC20Token
  let BUSD: ERC20Token
  let USDC_USDT_V2: Pair
  let USDC_USDT_V3_LOW: Pool
  let WETH_USDC_V2: Pair
  let WETH_USDC_V3_MEDIUM: Pool
  let UNIVERSAL_ROUTER: Address
  let PERMIT2: Address

  beforeEach(async () => {
    ;({
      UNIVERSAL_ROUTER,
      PERMIT2,
      USDC,
      USDT,
      BUSD,
      ETHER,
      WETH_USDC_V2,
      WETH_USDC_V3_MEDIUM,
      USDC_USDT_V2,
      USDC_USDT_V3_LOW,
    } = await fixtureAddresses(chainId, liquidity))
    wallet = getWalletClient({ chainId })
  })

  describe('mixed', () => {
    it('should encodes a mixed exactInput USDT-stable->USDC-v3->ETH swap', async () => {
      const amountIn = parseUnits('1000', 6)

      const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)

      const trade = await buildMixedRouteTrade(
        USDT,
        CurrencyAmount.fromRawAmount(USDT, amountIn),
        TradeType.EXACT_INPUT,
        [stablePool, WETH_USDC_V3_MEDIUM]
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
    it('should encodes a mixed exactInput USDT-stable->USDC-v2->ETH swap', async () => {
      const amountIn = parseUnits('1000', 6)

      const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)

      const trade = await buildMixedRouteTrade(
        USDT,
        CurrencyAmount.fromRawAmount(USDT, amountIn),
        TradeType.EXACT_INPUT,
        [stablePool, WETH_USDC_V2]
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
    it('should encodes a mixed exactInput ETH-v2->USDC-stable->USDT swap', async () => {
      const amountIn = parseEther('1')

      const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V2, stablePool]
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })
    it('should encodes a mixed exactInput ETH-v3->USDC-stable->USDT swap', async () => {
      const amountIn = parseEther('1')

      const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V3_MEDIUM, stablePool]
      )
      const options = swapOptions({})

      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()
    })
  })

  describe('multi-route', () => {
    it('should encode a multi-route exactOutput v2 USDT-USDC & v3 USDT-USDC & stable USDT-USDC', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = buildV2Trade(
        new V2Trade(
          new V2Route([USDC_USDT_V2], USDT, USDC),
          CurrencyAmount.fromRawAmount(USDT, amountIn),
          TradeType.EXACT_INPUT
        ),
        [
          {
            type: PoolType.V2,
            reserve0: USDC_USDT_V2.reserve0,
            reserve1: USDC_USDT_V2.reserve1,
          },
        ]
      )
      const v3Trade = buildV3Trade(
        await V3Trade.fromRoute(
          new V3Route([USDC_USDT_V3_LOW], USDT, USDC),
          CurrencyAmount.fromRawAmount(USDT, amountIn),
          TradeType.EXACT_INPUT
        ),
        [convertPoolToV3Pool(USDC_USDT_V3_LOW)]
      )

      const stableTrade = buildStableTrade(USDT, USDC, CurrencyAmount.fromRawAmount(USDT, amountIn), [
        await getStablePool(USDT, USDC, getPublicClient, liquidity),
      ])

      v2Trade.routes[0].percent = 30
      v3Trade.routes[0].percent = 30
      stableTrade.routes[0].percent = 40

      const options = swapOptions({})
      const trade: SmartRouterTrade<TradeType.EXACT_INPUT> = {
        tradeType: TradeType.EXACT_INPUT,
        inputAmount: CurrencyAmount.fromRawAmount(USDT, amountIn * 3n),
        outputAmount: CurrencyAmount.fromRawAmount(USDC, amountIn),
        routes: [...v2Trade.routes, ...v3Trade.routes, ...stableTrade.routes],
        gasEstimate: 0n,
        gasEstimateInUSD: CurrencyAmount.fromRawAmount(USDT, amountIn),
      }
      const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()
    })
  })

  it('should encode a single exactInput USDT->USDC swap', async () => {
    const amountIn = parseUnits('1000', 6)

    const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)
    const trade = buildStableTrade(USDT, USDC, CurrencyAmount.fromRawAmount(USDT, amountIn), [stablePool])

    const options = swapOptions({})

    const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

    expect(BigInt(value)).toEqual(0n)
    expect(calldata).toMatchSnapshot()
  })
  it('should encode a single exactInput USDT->USDC swap, with fee', async () => {
    const amountIn = parseUnits('1000', 6)

    const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)
    const trade = buildStableTrade(USDT, USDC, CurrencyAmount.fromRawAmount(USDT, amountIn), [stablePool])

    const feeOptions: FeeOptions = {
      recipient: zeroAddress,
      fee: new Percent(5, 100),
    }
    const options = swapOptions({ fee: feeOptions })

    const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

    expect(BigInt(value)).toEqual(0n)
    expect(calldata).toMatchSnapshot()
  })
  it('should encode a single exactInput USDT->USDC swap, with permit2', async () => {
    const amountIn = parseUnits('1000', 6)

    const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)
    const trade = buildStableTrade(USDT, USDC, CurrencyAmount.fromRawAmount(USDT, amountIn), [stablePool])

    const permit = makePermit(USDC.address, UNIVERSAL_ROUTER)
    const signature = await signPermit(permit, wallet, PERMIT2)
    const permit2Permit: Permit2Permit = {
      ...permit,
      signature,
    }
    const options = swapOptions({
      inputTokenPermit: permit2Permit,
    })

    const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)

    expect(BigInt(value)).toEqual(0n)
    expect(calldata).toMatchSnapshot()
  })
  it('should encode a exactInput USDT->USDC->BUSD swap', async () => {
    const amountIn = parseUnits('1000', 6)

    const USDT_USDC_POOL = await getStablePool(USDT, USDC, getPublicClient, liquidity)
    const USDC_BUSD_POOL = await getStablePool(USDC, BUSD, getPublicClient)

    const trade = buildStableTrade(USDT, BUSD, CurrencyAmount.fromRawAmount(USDT, amountIn), [
      USDT_USDC_POOL,
      USDC_BUSD_POOL,
    ])

    const options = swapOptions({})
    const { calldata, value } = PancakeUniversalSwapRouter.swapERC20CallParameters(trade, options)
    expect(BigInt(value)).toEqual(0n)
    expect(calldata).toMatchSnapshot()
  })
})
