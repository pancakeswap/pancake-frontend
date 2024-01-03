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
import { Trade as V3Trade, Route as V3Route, Pool } from '@pancakeswap/v3-sdk'
import { PoolType, SmartRouterTrade, V2Pool, V3Pool } from '@pancakeswap/smart-router/evm'
import { describe, it, expect, beforeEach } from 'vitest'
import { parseEther, parseUnits, Address, WalletClient, isHex, stringify } from 'viem'
import { convertPoolToV3Pool, fixtureAddresses, getStablePool } from './fixtures/address'
import { getPublicClient, getWalletClient } from './fixtures/clients'
import { PancakeSwapUniversalRouter, ROUTER_AS_RECIPIENT } from '../src'
import { PancakeSwapOptions, Permit2Signature } from '../src/entities/types'
import { buildMixedRouteTrade, buildStableTrade, buildV2Trade, buildV3Trade } from './utils/buildTrade'
import { makePermit, signEIP2098Permit, signPermit } from './utils/permit'
import { decodeUniversalCalldata } from './utils/calldataDecode'
import { CommandType } from '../src/utils/routerCommands'
import { SENDER_AS_RECIPIENT } from '../src/utils/constants'

const TEST_RECIPIENT_ADDRESS = '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa' as const
const TEST_FEE_RECIPIENT_ADDRESS = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB' as const

const swapOptions = (options: Partial<PancakeSwapOptions>): PancakeSwapOptions => {
  let slippageTolerance = new Percent(5, 100)
  if (options.fee) slippageTolerance = slippageTolerance.add(options.fee.fee)
  return {
    slippageTolerance,
    ...options,
  }
}

const TEST_FEE = 500n

const feeOptions = {
  recipient: TEST_FEE_RECIPIENT_ADDRESS,
  fee: new Percent(TEST_FEE, 10000n),
}

describe('PancakeSwap Universal Router Trade', () => {
  const chainId = ChainId.ETHEREUM
  const liquidity = parseEther('1000')

  let wallet: WalletClient

  let ETHER: Ether
  let USDC: ERC20Token
  let USDT: ERC20Token
  let WETH_USDC_V2: Pair
  let USDC_USDT_V2: Pair
  let WETH_USDC_V3_MEDIUM: Pool
  let WETH_USDC_V3_LOW: Pool
  let USDC_USDT_V3_LOW: Pool
  let UNIVERSAL_ROUTER: Address
  let PERMIT2: Address

  expect.addSnapshotSerializer({
    serialize(val) {
      return stringify(decodeUniversalCalldata(val), null, 2)
    },
    test(val) {
      return val && isHex(val)
    },
  })

  beforeEach(async () => {
    ;({
      UNIVERSAL_ROUTER,
      PERMIT2,
      ETHER,
      USDC,
      USDT,
      WETH_USDC_V2,
      USDC_USDT_V2,
      USDC_USDT_V3_LOW,
      WETH_USDC_V3_LOW,
      WETH_USDC_V3_MEDIUM,
    } = await fixtureAddresses(chainId, liquidity))
    wallet = getWalletClient({ chainId })
  })

  describe('v2', () => {
    it('should encode a single exactInput ETH->USDC Swap, without fee, without recipient', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)
    })
    it('should encode a single exactInput ETH->USDC Swap, without fee, with recipient', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({
        recipient: TEST_RECIPIENT_ADDRESS,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(TEST_RECIPIENT_ADDRESS)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)
    })
    it('should encode a single exactInput ETH->USDC Swap, with fee, without recipient', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])

      const options = swapOptions({
        fee: feeOptions,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(4)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual('PAY_PORTION')
      expect(decodedCommands[2].args[0].name).toEqual('token')
      expect(decodedCommands[2].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[2].args[1].name).toEqual('recipient')
      expect(decodedCommands[2].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[2].args[2].name).toEqual('bips')
      expect(decodedCommands[2].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[3].command).toEqual('SWEEP')
      expect(decodedCommands[3].args[0].name).toEqual('token')
      expect(decodedCommands[3].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[3].args[1].name).toEqual('recipient')
      expect(decodedCommands[3].args[1].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[3].args[2].name).toEqual('amountMin')
      expect(decodedCommands[3].args[2].value).toBeGreaterThan(0n)
    })
    it('should encode a single exactInput ETH->USDC Swap, with fee, with recipient', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({
        fee: feeOptions,
        recipient: TEST_RECIPIENT_ADDRESS,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(4)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.PAY_PORTION])
      expect(decodedCommands[2].args[0].name).toEqual('token')
      expect(decodedCommands[2].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[2].args[1].name).toEqual('recipient')
      expect(decodedCommands[2].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[2].args[2].name).toEqual('bips')
      expect(decodedCommands[2].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[3].command).toEqual(CommandType[CommandType.SWEEP])
      expect(decodedCommands[3].args[0].name).toEqual('token')
      expect(decodedCommands[3].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[3].args[1].name).toEqual('recipient')
      expect(decodedCommands[3].args[1].value).toEqual(TEST_RECIPIENT_ADDRESS)
      expect(decodedCommands[3].args[2].name).toEqual('amountMin')
      expect(decodedCommands[3].args[2].value).toBeGreaterThan(0n)
    })

    it('should encode a exactInput ETH->USDC->USDT Swap, without fee, without recipient', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2, USDC_USDT_V2], ETHER, USDT),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
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

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)
    })
    it('should encode a exactInput ETH->USDC->USDT Swap, with fee, without recipient', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2, USDC_USDT_V2], ETHER, USDT),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
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
      const options = swapOptions({ fee: feeOptions })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(4)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.PAY_PORTION])
      expect(decodedCommands[2].args[0].name).toEqual('token')
      expect(decodedCommands[2].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[2].args[1].name).toEqual('recipient')
      expect(decodedCommands[2].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[2].args[2].name).toEqual('bips')
      expect(decodedCommands[2].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[3].command).toEqual(CommandType[CommandType.SWEEP])
      expect(decodedCommands[3].args[0].name).toEqual('token')
      expect(decodedCommands[3].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[3].args[1].name).toEqual('recipient')
      expect(decodedCommands[3].args[1].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[3].args[2].name).toEqual('amountMin')
      expect(decodedCommands[3].args[2].value).toBeGreaterThan(0n)
    })
    it('should encode a exactInput ETH->USDC->USDT Swap, without fee, with recipient', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2, USDC_USDT_V2], ETHER, USDT),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
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

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)
    })
    it('should encode a exactInput ETH->USDC->USDT Swap, with fee, with recipient', async () => {
      const amountIn = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2, USDC_USDT_V2], ETHER, USDT),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
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
      const options = swapOptions({ fee: feeOptions, recipient: TEST_RECIPIENT_ADDRESS })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(4)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.PAY_PORTION])
      expect(decodedCommands[2].args[0].name).toEqual('token')
      expect(decodedCommands[2].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[2].args[1].name).toEqual('recipient')
      expect(decodedCommands[2].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[2].args[2].name).toEqual('bips')
      expect(decodedCommands[2].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[3].command).toEqual(CommandType[CommandType.SWEEP])
      expect(decodedCommands[3].args[0].name).toEqual('token')
      expect(decodedCommands[3].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[3].args[1].name).toEqual('recipient')
      expect(decodedCommands[3].args[1].value).toEqual(TEST_RECIPIENT_ADDRESS)
      expect(decodedCommands[3].args[2].name).toEqual('amountMin')
      expect(decodedCommands[3].args[2].value).toBeGreaterThan(0n)
    })

    it('should encode a single exactInput USDC->ETH Swap', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
    it('should encode a single exactInput USDC->ETH Swap, with fee', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({
        fee: feeOptions,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.PAY_PORTION])
      expect(decodedCommands[1].args[0].name).toEqual('token')
      expect(decodedCommands[1].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[1].args[1].name).toEqual('recipient')
      expect(decodedCommands[1].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[1].args[2].name).toEqual('bips')
      expect(decodedCommands[1].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
    it('should encode a single exactInput USDC->ETH Swap, with recipient', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({
        recipient: TEST_RECIPIENT_ADDRESS,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(TEST_RECIPIENT_ADDRESS)
    })
    it('should encode a single exactInput USDC->ETH Swap, with fee, with recipient', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({
        recipient: TEST_RECIPIENT_ADDRESS,
        fee: feeOptions,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.PAY_PORTION])
      expect(decodedCommands[1].args[0].name).toEqual('token')
      expect(decodedCommands[1].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[1].args[1].name).toEqual('recipient')
      expect(decodedCommands[1].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[1].args[2].name).toEqual('bips')
      expect(decodedCommands[1].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(TEST_RECIPIENT_ADDRESS)
    })

    it('should encode a single exactInput USDC->ETH swap, with permit2', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])

      const permit = makePermit(USDC.address, UNIVERSAL_ROUTER)
      const signature = await signPermit(permit, wallet, PERMIT2)
      const permit2Permit: Permit2Signature = {
        ...permit,
        signature,
      }

      const options = swapOptions({
        inputTokenPermit: permit2Permit,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.PERMIT2_PERMIT])

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(true)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })

    it('should encode a single exactInput USDC->ETH swap, with EIP-2098 permit', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])

      const permit = makePermit(USDC.address, UNIVERSAL_ROUTER)
      const signature = await signEIP2098Permit(permit, wallet, PERMIT2)
      const permit2Permit: Permit2Signature = {
        ...permit,
        signature,
      }

      const options = swapOptions({
        inputTokenPermit: permit2Permit,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.PERMIT2_PERMIT])

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(true)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })

    it('should encode exactInput USDT->USDC->ETH swap', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = new V2Trade(
        new V2Route([USDC_USDT_V2, WETH_USDC_V2], USDT, ETHER),
        CurrencyAmount.fromRawAmount(USDT, amountIn),
        TradeType.EXACT_INPUT,
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

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[3].name).toEqual('path')
      expect((decodedCommands[0].args[3].value as string[]).length).toEqual(3)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })

    it('should encode exactOutput ETH->USDC swap', async () => {
      const amountOut = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(USDC, amountOut),
        TradeType.EXACT_OUTPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).not.toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_OUT])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountOut')
      expect(decodedCommands[1].args[1].value).toEqual(amountOut)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountMin')
      expect(decodedCommands[2].args[1].value).toEqual(0n)
    })

    it('should encode exactOutput ETH->USDC swap, with fee', async () => {
      const amountOut = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(USDC, amountOut),
        TradeType.EXACT_OUTPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({
        fee: feeOptions,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).not.toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(5)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_OUT])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountOut')
      expect(decodedCommands[1].args[1].value).toEqual(amountOut)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual('PAY_PORTION')
      expect(decodedCommands[2].args[0].name).toEqual('token')
      expect(decodedCommands[2].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[2].args[1].name).toEqual('recipient')
      expect(decodedCommands[2].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[2].args[2].name).toEqual('bips')
      expect(decodedCommands[2].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[3].command).toEqual('SWEEP')
      expect(decodedCommands[3].args[0].name).toEqual('token')
      expect(decodedCommands[3].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[3].args[1].name).toEqual('recipient')
      expect(decodedCommands[3].args[1].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[3].args[2].name).toEqual('amountMin')
      expect(decodedCommands[3].args[2].value).toBeGreaterThan(0n)

      expect(decodedCommands[4].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[4].args[0].name).toEqual('recipient')
      expect(decodedCommands[4].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[4].args[1].name).toEqual('amountMin')
      expect(decodedCommands[4].args[1].value).toEqual(0n)
    })
    it('should encode exactOutput ETH->USDC swap, with fee, with recipient', async () => {
      const amountOut = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(USDC, amountOut),
        TradeType.EXACT_OUTPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({
        fee: feeOptions,
        recipient: TEST_RECIPIENT_ADDRESS,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).not.toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(5)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_OUT])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountOut')
      expect(decodedCommands[1].args[1].value).toEqual(amountOut)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual('PAY_PORTION')
      expect(decodedCommands[2].args[0].name).toEqual('token')
      expect(decodedCommands[2].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[2].args[1].name).toEqual('recipient')
      expect(decodedCommands[2].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[2].args[2].name).toEqual('bips')
      expect(decodedCommands[2].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[3].command).toEqual('SWEEP')
      expect(decodedCommands[3].args[0].name).toEqual('token')
      expect(decodedCommands[3].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[3].args[1].name).toEqual('recipient')
      expect(decodedCommands[3].args[1].value).toEqual(TEST_RECIPIENT_ADDRESS)
      expect(decodedCommands[3].args[2].name).toEqual('amountMin')
      expect(decodedCommands[3].args[2].value).toBeGreaterThan(0n)

      expect(decodedCommands[4].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[4].args[0].name).toEqual('recipient')
      expect(decodedCommands[4].args[0].value).toEqual(TEST_RECIPIENT_ADDRESS)
      expect(decodedCommands[4].args[1].name).toEqual('amountMin')
      expect(decodedCommands[4].args[1].value).toEqual(0n)
    })

    it('should encode exactOutput USDC-ETH swap', async () => {
      const amountOut = parseEther('1')
      const v2Trade = new V2Trade(
        new V2Route([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, amountOut),
        TradeType.EXACT_OUTPUT,
      )
      const v2Pool: V2Pool = {
        type: PoolType.V2,
        reserve0: WETH_USDC_V2.reserve0,
        reserve1: WETH_USDC_V2.reserve1,
      }
      const trade = buildV2Trade(v2Trade, [v2Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_OUT])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountOut')
      expect(decodedCommands[0].args[1].value).toEqual(amountOut)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
  })

  describe('v3', () => {
    it('should encode a single exactInput ETH->USDC swap', async () => {
      const amountIn = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)
    })

    it('should encode a single exactInput ETH->USDC swap, with a fee', async () => {
      const amountIn = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])
      const options = swapOptions({
        fee: feeOptions,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(4)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual('PAY_PORTION')
      expect(decodedCommands[2].args[0].name).toEqual('token')
      expect(decodedCommands[2].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[2].args[1].name).toEqual('recipient')
      expect(decodedCommands[2].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[2].args[2].name).toEqual('bips')
      expect(decodedCommands[2].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[3].command).toEqual('SWEEP')
      expect(decodedCommands[3].args[0].name).toEqual('token')
      expect(decodedCommands[3].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[3].args[1].name).toEqual('recipient')
      expect(decodedCommands[3].args[1].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[3].args[2].name).toEqual('amountMin')
      expect(decodedCommands[3].args[2].value).toBeGreaterThan(0n)
    })

    it('should encode a single exactInput USDC->ETH swap', async () => {
      const amountIn = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
    it('should encode a single exactInput USDC->ETH swap, with a fee', async () => {
      const amountIn = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)
      const trade = buildV3Trade(v3Trade, [v3Pool])

      const options = swapOptions({
        fee: feeOptions,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.PAY_PORTION])
      expect(decodedCommands[1].args[0].name).toEqual('token')
      expect(decodedCommands[1].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[1].args[1].name).toEqual('recipient')
      expect(decodedCommands[1].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
      expect(decodedCommands[1].args[2].name).toEqual('bips')
      expect(decodedCommands[1].args[2].value).toEqual(TEST_FEE)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
    it('should encode a single exactInput USDC->ETH swap, with permit2', async () => {
      const amountIn = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])

      const permit = makePermit(USDC.address, UNIVERSAL_ROUTER)
      const signature = await signPermit(permit, wallet, PERMIT2)
      const permit2Permit: Permit2Signature = {
        ...permit,
        signature,
      }
      const options = swapOptions({
        inputTokenPermit: permit2Permit,
      })

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.PERMIT2_PERMIT])

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(true)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })

    it('should encode a exactInput ETH->USDC->USDT swap', async () => {
      const amountIn = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM, USDC_USDT_V3_LOW], ETHER, USDT),
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
      )
      const v3Pool: V3Pool[] = [convertPoolToV3Pool(WETH_USDC_V3_MEDIUM), convertPoolToV3Pool(USDC_USDT_V3_LOW)]

      const trade = buildV3Trade(v3Trade, v3Pool)
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)
    })
    it('should encode a single exactOutput ETH->USDC swap', async () => {
      const amountOut = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], ETHER, USDC),
        CurrencyAmount.fromRawAmount(USDC, amountOut),
        TradeType.EXACT_OUTPUT,
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).not.toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_OUT])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountOut')
      expect(decodedCommands[1].args[1].value).toEqual(amountOut)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountMin')
      expect(decodedCommands[2].args[1].value).toEqual(0n)
    })
    it('should encode a single exactOutput USDC->ETH swap', async () => {
      const amountOut = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM], USDC, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, amountOut),
        TradeType.EXACT_OUTPUT,
      )
      const v3Pool: V3Pool = convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)

      const trade = buildV3Trade(v3Trade, [v3Pool])
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_OUT])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountOut')
      expect(decodedCommands[0].args[1].value).toEqual(amountOut)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
    it('should encode a exactOutput ETH->USDC->USDT swap', async () => {
      const amountOut = parseUnits('1000', 6)
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([WETH_USDC_V3_MEDIUM, USDC_USDT_V3_LOW], ETHER, USDT),
        CurrencyAmount.fromRawAmount(USDT, amountOut),
        TradeType.EXACT_OUTPUT,
      )
      const v3Pool: V3Pool[] = [convertPoolToV3Pool(WETH_USDC_V3_MEDIUM), convertPoolToV3Pool(USDC_USDT_V3_LOW)]

      const trade = buildV3Trade(v3Trade, v3Pool)
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).not.toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_OUT])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountOut')
      expect(decodedCommands[1].args[1].value).toEqual(amountOut)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountMin')
      expect(decodedCommands[2].args[1].value).toEqual(0n)
    })
    it('should encode a exactOutput USDT->USDC->ETH swap', async () => {
      const amountOut = parseEther('1')
      const v3Trade = await V3Trade.fromRoute(
        new V3Route([USDC_USDT_V3_LOW, WETH_USDC_V3_MEDIUM], USDT, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, amountOut),
        TradeType.EXACT_OUTPUT,
      )
      const v3Pool: V3Pool[] = [convertPoolToV3Pool(USDC_USDT_V3_LOW), convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)]

      const trade = buildV3Trade(v3Trade, v3Pool)
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_OUT])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountOut')
      expect(decodedCommands[0].args[1].value).toEqual(amountOut)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
  })
  describe('mixed', () => {
    it('should encodes a mixed exactInput ETH-v3->USDC-v2->USDT swap', async () => {
      const amountIn = parseEther('1')

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V3_MEDIUM, USDC_USDT_V2],
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(USDC_USDT_V2.liquidityToken.address)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountIn')
      expect(decodedCommands[2].args[1].value).toBeGreaterThan(0n)
      expect(decodedCommands[2].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[2].args[4].value).toEqual(false)
    })

    it('should encodes a mixed exactInput ETH-v2->USDC-v3->USDT swap', async () => {
      const amountIn = parseEther('1')

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V2, USDC_USDT_V3_LOW],
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      // v2 support address aliases, no need to assigned to v3 pool address
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[3].name).toEqual('path')
      expect((decodedCommands[1].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountIn')
      expect(decodedCommands[2].args[1].value).toBeGreaterThan(0n)
      expect(decodedCommands[2].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[2].args[4].value).toEqual(false)
    })

    it('should encodes a mixed exactInput ETH-v2->USDC-v2->USDT swap', async () => {
      const amountIn = parseEther('1')

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V2, USDC_USDT_V2],
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[3].name).toEqual('path')
      expect((decodedCommands[1].args[3].value as string[]).length).toEqual(3)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)
    })

    it('should encodes a mixed exactInput ETH-v3->USDC-v3->USDT swap', async () => {
      const amountIn = parseEther('1')

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V3_MEDIUM, USDC_USDT_V3_LOW],
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(2)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)
    })

    it('should encodes a mixed exactInput USDT-v2->USDC-v3->ETH swap', async () => {
      const amountIn = parseUnits('1000', 6)

      const trade = await buildMixedRouteTrade(
        USDT,
        CurrencyAmount.fromRawAmount(USDT, amountIn),
        TradeType.EXACT_INPUT,
        [USDC_USDT_V2, WETH_USDC_V3_MEDIUM],
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      // v2 support address aliases, no need to assigned to v3 pool address
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[3].name).toEqual('path')
      expect((decodedCommands[0].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[0].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toBeGreaterThan(0n)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
  })
  describe('multi-route', () => {
    it('should encode a split exactInput with 2 routes: v2 ETH-USDC & v3 ETH-USDC', async () => {
      const amountIn = parseEther('1')
      const v2Trade = buildV2Trade(
        new V2Trade(
          new V2Route([WETH_USDC_V2], ETHER, USDC),
          CurrencyAmount.fromRawAmount(ETHER, amountIn),
          TradeType.EXACT_INPUT,
        ),
        [
          {
            type: PoolType.V2,
            reserve0: WETH_USDC_V2.reserve0,
            reserve1: WETH_USDC_V2.reserve1,
          },
        ],
      )
      const v3Trade = buildV3Trade(
        await V3Trade.fromRoute(
          new V3Route([WETH_USDC_V3_MEDIUM], ETHER, USDC),
          CurrencyAmount.fromRawAmount(ETHER, amountIn),
          TradeType.EXACT_INPUT,
        ),
        [convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)],
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

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)
      expect(BigInt(value)).toEqual(amountIn * 2n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      // v2 support address aliases, no need to assigned to v3 pool address
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[3].name).toEqual('path')
      expect((decodedCommands[1].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountIn')
      expect(decodedCommands[2].args[1].value).toEqual(amountIn)
      expect(decodedCommands[2].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[2].args[4].value).toEqual(false)
    })
    it('should encode a split exactInput with 3 routes: v2 ETH-USDC & v3 ETH-USDC & v3 ETH-USDC', async () => {
      const amountIn = parseEther('2')
      const v2Trade = buildV2Trade(
        new V2Trade(
          new V2Route([WETH_USDC_V2], ETHER, USDC),
          CurrencyAmount.fromRawAmount(ETHER, (amountIn * 5000n) / 10000n),
          TradeType.EXACT_INPUT,
        ),
        [
          {
            type: PoolType.V2,
            reserve0: WETH_USDC_V2.reserve0,
            reserve1: WETH_USDC_V2.reserve1,
          },
        ],
      )

      const v3Trade = buildV3Trade(
        await V3Trade.fromRoute(
          new V3Route([WETH_USDC_V3_MEDIUM], ETHER, USDC),
          CurrencyAmount.fromRawAmount(ETHER, (amountIn * 2500n) / 10000n),
          // CurrencyAmount.fromRawAmount(ETHER, amountIn),
          TradeType.EXACT_INPUT,
        ),
        [convertPoolToV3Pool(WETH_USDC_V3_MEDIUM)],
      )

      const v3Trade2 = buildV3Trade(
        await V3Trade.fromRoute(
          new V3Route([WETH_USDC_V3_LOW], ETHER, USDC),
          CurrencyAmount.fromRawAmount(ETHER, (amountIn * 2500n) / 10000n),
          // CurrencyAmount.fromRawAmount(ETHER, amountIn),
          TradeType.EXACT_INPUT,
        ),
        [convertPoolToV3Pool(WETH_USDC_V3_LOW)],
      )

      v2Trade.routes[0].percent = 50
      v3Trade.routes[0].percent = 25
      v3Trade2.routes[0].percent = 25

      const options = swapOptions({})
      const trade: SmartRouterTrade<TradeType.EXACT_INPUT> = {
        tradeType: TradeType.EXACT_INPUT,
        inputAmount: CurrencyAmount.fromRawAmount(ETHER, amountIn),
        outputAmount: CurrencyAmount.fromRawAmount(USDC, amountIn),
        routes: [...v2Trade.routes, ...v3Trade.routes, ...v3Trade2.routes],
        gasEstimate: 0n,
        gasEstimateInUSD: CurrencyAmount.fromRawAmount(ETHER, amountIn),
      }

      // FIXME: a valid trade should have the correct output amounts
      expect(trade.routes.reduce((acc, r) => acc + r.outputAmount.quotient, 0n)).toEqual(trade.outputAmount.quotient)

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)
      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(5)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      // v2 support address aliases, no need to assigned to v3 pool address
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual((amountIn * 5000n) / 10000n)
      expect(decodedCommands[1].args[3].name).toEqual('path')
      expect((decodedCommands[1].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountIn')
      expect(decodedCommands[2].args[1].value).toEqual((amountIn * 2500n) / 10000n)
      expect(decodedCommands[2].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[2].args[4].value).toEqual(false)

      expect(decodedCommands[3].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[3].args[0].name).toEqual('recipient')
      expect(decodedCommands[3].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[3].args[1].name).toEqual('amountIn')
      expect(decodedCommands[3].args[1].value).toEqual((amountIn * 2500n) / 10000n)
      expect(decodedCommands[3].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[3].args[4].value).toEqual(false)

      expect(decodedCommands[4].command).toEqual('SWEEP')
      expect(decodedCommands[4].args[0].name).toEqual('token')
      expect(decodedCommands[4].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[4].args[1].name).toEqual('recipient')
      expect(decodedCommands[4].args[1].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[4].args[2].name).toEqual('amountMin')
      expect(decodedCommands[4].args[2].value).toBeGreaterThan(0n)
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
  let WBNB_USDC_V2: Pair
  let USDC_USDT_V3_LOW: Pool
  let WETH_USDC_V2: Pair
  let WETH_USDC_V3_MEDIUM: Pool
  let WBNB_USDC_V3_MEDIUM: Pool
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
      WBNB_USDC_V2,
      WETH_USDC_V3_MEDIUM,
      WBNB_USDC_V3_MEDIUM,
      USDC_USDT_V2,
      USDC_USDT_V3_LOW,
    } = await fixtureAddresses(chainId, liquidity))
    wallet = getWalletClient({ chainId })
  })

  describe('mixed', () => {
    it('should encodes a mixed exactInput USDT-stable->USDC-v3->BNB swap', async () => {
      const amountIn = parseUnits('1000', 6)

      const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)

      const trade = await buildMixedRouteTrade(
        USDT,
        CurrencyAmount.fromRawAmount(USDT, amountIn),
        TradeType.EXACT_INPUT,
        [stablePool, WBNB_USDC_V3_MEDIUM],
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.STABLE_SWAP_EXACT_IN])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[3].name).toEqual('path')
      expect((decodedCommands[0].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[0].args[5].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[5].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toBeGreaterThan(0n)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
    it('should encodes a mixed exactInput USDT-stable->USDC-v2->BNB swap', async () => {
      const amountIn = parseUnits('1000', 6)

      const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)

      const trade = await buildMixedRouteTrade(
        USDT,
        CurrencyAmount.fromRawAmount(USDT, amountIn),
        TradeType.EXACT_INPUT,
        [stablePool, WBNB_USDC_V2],
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.STABLE_SWAP_EXACT_IN])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(WBNB_USDC_V2.liquidityToken.address)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[3].name).toEqual('path')
      expect((decodedCommands[0].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[0].args[5].name).toEqual('payerIsUser')
      expect(decodedCommands[0].args[5].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toBeGreaterThan(0n)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.UNWRAP_WETH])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    })
    it('should encodes a mixed exactInput BNB-v2->USDC-stable->USDT swap', async () => {
      const amountIn = parseEther('1')

      const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V2, stablePool],
      )

      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.STABLE_SWAP_EXACT_IN])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountIn')
      expect(decodedCommands[2].args[1].value).toBeGreaterThan(0n)
      expect(decodedCommands[2].args[3].name).toEqual('path')
      expect((decodedCommands[2].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[2].args[5].name).toEqual('payerIsUser')
      expect(decodedCommands[2].args[5].value).toEqual(false)
    })
    it('should encodes a mixed exactInput ETH-v3->USDC-stable->USDT swap', async () => {
      const amountIn = parseEther('1')

      const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)

      const trade = await buildMixedRouteTrade(
        ETHER,
        CurrencyAmount.fromRawAmount(ETHER, amountIn),
        TradeType.EXACT_INPUT,
        [WETH_USDC_V3_MEDIUM, stablePool],
      )
      const options = swapOptions({})

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(amountIn)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(3)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.WRAP_ETH])
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(false)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.STABLE_SWAP_EXACT_IN])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountIn')
      expect(decodedCommands[2].args[1].value).toBeGreaterThan(0n)
      expect(decodedCommands[2].args[3].name).toEqual('path')
      expect((decodedCommands[2].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[2].args[5].name).toEqual('payerIsUser')
      expect(decodedCommands[2].args[5].value).toEqual(false)
    })
  })

  describe('multi-route', () => {
    it('should encode a multi-route exactOutput v2 USDT-USDC & v3 USDT-USDC & stable USDT-USDC', async () => {
      const amountIn = parseUnits('1000', 6)
      const v2Trade = buildV2Trade(
        new V2Trade(
          new V2Route([USDC_USDT_V2], USDT, USDC),
          CurrencyAmount.fromRawAmount(USDT, amountIn),
          TradeType.EXACT_INPUT,
        ),
        [
          {
            type: PoolType.V2,
            reserve0: USDC_USDT_V2.reserve0,
            reserve1: USDC_USDT_V2.reserve1,
          },
        ],
      )
      const v3Trade = buildV3Trade(
        await V3Trade.fromRoute(
          new V3Route([USDC_USDT_V3_LOW], USDT, USDC),
          CurrencyAmount.fromRawAmount(USDT, amountIn),
          TradeType.EXACT_INPUT,
        ),
        [convertPoolToV3Pool(USDC_USDT_V3_LOW)],
      )

      const stableTrade = buildStableTrade(USDT, USDC, CurrencyAmount.fromRawAmount(USDT, amountIn), [
        await getStablePool(USDT, USDC, getPublicClient, liquidity),
      ])

      v2Trade.routes[0].percent = 33
      v3Trade.routes[0].percent = 33
      stableTrade.routes[0].percent = 33

      const options = swapOptions({})
      const trade: SmartRouterTrade<TradeType.EXACT_INPUT> = {
        tradeType: TradeType.EXACT_INPUT,
        inputAmount: CurrencyAmount.fromRawAmount(USDT, amountIn * 3n),
        outputAmount: CurrencyAmount.fromRawAmount(USDC, amountIn),
        routes: [...v2Trade.routes, ...v3Trade.routes, ...stableTrade.routes],
        gasEstimate: 0n,
        gasEstimateInUSD: CurrencyAmount.fromRawAmount(USDT, amountIn),
      }

      // FIXME: a valid trade should have the correct output amounts
      expect(trade.routes.reduce((acc, r) => acc + r.outputAmount.quotient, 0n)).toEqual(trade.outputAmount.quotient)

      const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value)).toEqual(0n)
      expect(calldata).toMatchSnapshot()

      const decodedCommands = decodeUniversalCalldata(calldata)
      expect(decodedCommands.length).toEqual(4)

      expect(decodedCommands[0].command).toEqual(CommandType[CommandType.V2_SWAP_EXACT_IN])
      // v2 support address aliases, no need to assigned to v3 pool address
      expect(decodedCommands[0].args[0].name).toEqual('recipient')
      expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[0].args[1].name).toEqual('amountIn')
      expect(decodedCommands[0].args[1].value).toEqual(amountIn)
      expect(decodedCommands[0].args[3].name).toEqual('path')
      expect((decodedCommands[0].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[0].args[4].value).toEqual(true)

      expect(decodedCommands[1].command).toEqual(CommandType[CommandType.V3_SWAP_EXACT_IN])
      expect(decodedCommands[1].args[0].name).toEqual('recipient')
      expect(decodedCommands[1].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[1].args[1].name).toEqual('amountIn')
      expect(decodedCommands[1].args[1].value).toEqual(amountIn)
      expect(decodedCommands[1].args[4].name).toEqual('payerIsUser')
      expect(decodedCommands[1].args[4].value).toEqual(true)

      expect(decodedCommands[2].command).toEqual(CommandType[CommandType.STABLE_SWAP_EXACT_IN])
      expect(decodedCommands[2].args[0].name).toEqual('recipient')
      expect(decodedCommands[2].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
      expect(decodedCommands[2].args[1].name).toEqual('amountIn')
      expect(decodedCommands[2].args[1].value).toBeGreaterThan(0n)
      expect(decodedCommands[2].args[3].name).toEqual('path')
      expect((decodedCommands[2].args[3].value as string[]).length).toEqual(2)
      expect(decodedCommands[2].args[5].name).toEqual('payerIsUser')
      expect(decodedCommands[2].args[5].value).toEqual(true)

      expect(decodedCommands[3].command).toEqual('SWEEP')
      expect(decodedCommands[3].args[0].name).toEqual('token')
      expect(decodedCommands[3].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
      expect(decodedCommands[3].args[1].name).toEqual('recipient')
      expect(decodedCommands[3].args[1].value).toEqual(SENDER_AS_RECIPIENT)
      expect(decodedCommands[3].args[2].name).toEqual('amountMin')
      expect(decodedCommands[3].args[2].value).toBeGreaterThan(0n)
    })
  })

  it('should encode a single exactInput USDT->USDC swap', async () => {
    const amountIn = parseUnits('1000', 6)

    const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)
    const trade = buildStableTrade(USDT, USDC, CurrencyAmount.fromRawAmount(USDT, amountIn), [stablePool])

    const options = swapOptions({})

    const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

    expect(BigInt(value)).toEqual(0n)
    expect(calldata).toMatchSnapshot()

    const decodedCommands = decodeUniversalCalldata(calldata)
    expect(decodedCommands.length).toEqual(1)

    expect(decodedCommands[0].command).toEqual(CommandType[CommandType.STABLE_SWAP_EXACT_IN])
    expect(decodedCommands[0].args[0].name).toEqual('recipient')
    expect(decodedCommands[0].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    expect(decodedCommands[0].args[1].name).toEqual('amountIn')
    expect(decodedCommands[0].args[1].value).toEqual(amountIn)
    expect(decodedCommands[0].args[3].name).toEqual('path')
    expect((decodedCommands[0].args[3].value as string[]).length).toEqual(2)
    expect(decodedCommands[0].args[5].name).toEqual('payerIsUser')
    expect(decodedCommands[0].args[5].value).toEqual(true)
  })
  it('should encode a single exactInput USDT->USDC swap, with fee', async () => {
    const amountIn = parseUnits('1000', 6)

    const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)
    const trade = buildStableTrade(USDT, USDC, CurrencyAmount.fromRawAmount(USDT, amountIn), [stablePool])

    const options = swapOptions({ fee: feeOptions })

    const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

    expect(BigInt(value)).toEqual(0n)
    expect(calldata).toMatchSnapshot()

    const decodedCommands = decodeUniversalCalldata(calldata)
    expect(decodedCommands.length).toEqual(3)

    expect(decodedCommands[0].command).toEqual(CommandType[CommandType.STABLE_SWAP_EXACT_IN])
    expect(decodedCommands[0].args[0].name).toEqual('recipient')
    expect(decodedCommands[0].args[0].value).toEqual(ROUTER_AS_RECIPIENT)
    expect(decodedCommands[0].args[1].name).toEqual('amountIn')
    expect(decodedCommands[0].args[1].value).toEqual(amountIn)
    expect(decodedCommands[0].args[3].name).toEqual('path')
    expect((decodedCommands[0].args[3].value as string[]).length).toEqual(2)
    expect(decodedCommands[0].args[5].name).toEqual('payerIsUser')
    expect(decodedCommands[0].args[5].value).toEqual(true)

    expect(decodedCommands[1].command).toEqual('PAY_PORTION')
    expect(decodedCommands[1].args[0].name).toEqual('token')
    expect(decodedCommands[1].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
    expect(decodedCommands[1].args[1].name).toEqual('recipient')
    expect(decodedCommands[1].args[1].value).toEqual(TEST_FEE_RECIPIENT_ADDRESS)
    expect(decodedCommands[1].args[2].name).toEqual('bips')
    expect(decodedCommands[1].args[2].value).toEqual(TEST_FEE)

    expect(decodedCommands[2].command).toEqual('SWEEP')
    expect(decodedCommands[2].args[0].name).toEqual('token')
    expect(decodedCommands[2].args[0].value).toEqual(trade.outputAmount.currency.wrapped.address)
    expect(decodedCommands[2].args[1].name).toEqual('recipient')
    expect(decodedCommands[2].args[1].value).toEqual(SENDER_AS_RECIPIENT)
    expect(decodedCommands[2].args[2].name).toEqual('amountMin')
    expect(decodedCommands[2].args[2].value).toBeGreaterThan(0n)
  })
  it('should encode a single exactInput USDT->USDC swap, with permit2', async () => {
    const amountIn = parseUnits('1000', 6)

    const stablePool = await getStablePool(USDT, USDC, getPublicClient, liquidity)
    const trade = buildStableTrade(USDT, USDC, CurrencyAmount.fromRawAmount(USDT, amountIn), [stablePool])

    const permit = makePermit(USDC.address, UNIVERSAL_ROUTER)
    const signature = await signPermit(permit, wallet, PERMIT2)
    const permit2Permit: Permit2Signature = {
      ...permit,
      signature,
    }
    const options = swapOptions({
      inputTokenPermit: permit2Permit,
    })

    const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)

    expect(BigInt(value)).toEqual(0n)
    expect(calldata).toMatchSnapshot()

    const decodedCommands = decodeUniversalCalldata(calldata)
    expect(decodedCommands.length).toEqual(2)

    expect(decodedCommands[0].command).toEqual(CommandType[CommandType.PERMIT2_PERMIT])

    expect(decodedCommands[1].command).toEqual(CommandType[CommandType.STABLE_SWAP_EXACT_IN])
    expect(decodedCommands[1].args[0].name).toEqual('recipient')
    expect(decodedCommands[1].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    expect(decodedCommands[1].args[1].name).toEqual('amountIn')
    expect(decodedCommands[1].args[1].value).toEqual(amountIn)
    expect(decodedCommands[1].args[3].name).toEqual('path')
    expect((decodedCommands[1].args[3].value as string[]).length).toEqual(2)
    expect(decodedCommands[1].args[5].name).toEqual('payerIsUser')
    expect(decodedCommands[1].args[5].value).toEqual(true)
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
    const { calldata, value } = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, options)
    expect(BigInt(value)).toEqual(0n)
    expect(calldata).toMatchSnapshot()

    const decodedCommands = decodeUniversalCalldata(calldata)
    expect(decodedCommands.length).toEqual(1)

    expect(decodedCommands[0].command).toEqual(CommandType[CommandType.STABLE_SWAP_EXACT_IN])
    expect(decodedCommands[0].args[0].name).toEqual('recipient')
    expect(decodedCommands[0].args[0].value).toEqual(SENDER_AS_RECIPIENT)
    expect(decodedCommands[0].args[1].name).toEqual('amountIn')
    expect(decodedCommands[0].args[1].value).toEqual(amountIn)
    expect(decodedCommands[0].args[3].name).toEqual('path')
    expect((decodedCommands[0].args[3].value as string[]).length).toEqual(3)
    expect(decodedCommands[0].args[5].name).toEqual('payerIsUser')
    expect(decodedCommands[0].args[5].value).toEqual(true)
  })
})
