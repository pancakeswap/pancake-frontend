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
import { FeeOptions } from '@pancakeswap/v3-sdk'
import { PoolType, V2Pool } from '@pancakeswap/smart-router/evm'
import { hexToString, parseEther, parseUnits, Address, WalletClient, zeroAddress } from 'viem'
import { fixtureAddresses, getStablePool } from './fixtures/address'
import { getPublicClient, getWalletClient } from './fixtures/clients'
import { PancakeUniSwapRouter } from '../src'
import { PancakeSwapOptions } from '../src/utils/types'
import { buildStableTrade, buildV2Trade } from './utils/buildTrade'
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
  let UNIVERSAL_ROUTER: Address
  let PERMIT2: Address

  beforeEach(async () => {
    ;({ UNIVERSAL_ROUTER, PERMIT2, ETHER, USDC, USDT, WETH, WETH_USDC_V2, USDC_USDT_V2 } = await fixtureAddresses(
      chainId,
      liquidity
    ))
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value).toString()).toEqual(amountIn.toString())
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value).toString()).toEqual(amountIn.toString())
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value).toString()).toEqual(amountIn.toString())
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value).toString()).toEqual(amountIn.toString())
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      expect(hexToString(value)).toEqual('0')
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      expect(BigInt(value).toString()).toEqual('0')
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      expect(hexToString(value)).toEqual('0')
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)
      console.log(calldata)
      const x =
        '0x24856bc30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020a080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000ffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000ffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad0000000000000000000000000000000000000000000000000000ffffffffffff00000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000040726fa9e4e2cb57366858cbc4d96ac1e56b3c3a28d6dc0d829348fe2ad567213ceb002dba85f6b9990b3eb7579cef45dd476c02023d72c7389432f0be98e2401c00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000000000389fd97f00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      expect(hexToString(value)).toEqual('0')
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      // console.log(calldata)
      // const x = '0x24856bc30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020a080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000ffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000ffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad0000000000000000000000000000000000000000000000000000ffffffffffff00000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000040726fa9e4e2cb57366858cbc4d96ac1e56b3c3a28d6dc0d829348fe2ad567213ceb002dba85f6b9990b3eb7579cef45dd476c02023d72c7389432f0be98e2401c00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000000000389fd97f00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      expect(hexToString(value)).toEqual('0')
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      expect(hexToString(value)).not.toEqual('0')
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

      const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

      expect(hexToString(value)).toEqual('0')
      expect(calldata).toMatchSnapshot()
    })
  })

  describe.skip('v3', () => {})
  describe.skip('mixed v2 & v3', () => {})
  describe.skip('multi-route', () => {})
})

describe('PancakeSwap StableSwap Through Universal Router, BSC Network Only', () => {
  const chainId = ChainId.BSC
  const liquidity = parseEther('1000')

  let wallet: WalletClient

  let USDC: ERC20Token
  let USDT: ERC20Token
  let BUSD: ERC20Token
  let UNIVERSAL_ROUTER: Address
  let PERMIT2: Address

  beforeEach(async () => {
    ;({ UNIVERSAL_ROUTER, PERMIT2, USDC, USDT, BUSD } = await fixtureAddresses(chainId, liquidity))
    wallet = getWalletClient({ chainId })
  })

  it('should encode a single exactInput USDT->USDC swap', async () => {
    const amountIn = parseUnits('1000', 6)

    const stablePool = await getStablePool(USDT, USDC, getPublicClient)
    const trade = buildStableTrade(USDT, CurrencyAmount.fromRawAmount(USDT, amountIn), [stablePool])

    const options = swapOptions({})

    const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

    expect(hexToString(value)).toEqual('0')
    expect(calldata).toMatchSnapshot()
  })
  it('should encode a single exactInput USDT->USDC swap, with fee', async () => {
    const amountIn = parseUnits('1000', 6)

    const stablePool = await getStablePool(USDT, USDC, getPublicClient)
    const trade = buildStableTrade(USDT, CurrencyAmount.fromRawAmount(USDT, amountIn), [stablePool])

    const feeOptions: FeeOptions = {
      recipient: zeroAddress,
      fee: new Percent(5, 100),
    }
    const options = swapOptions({ fee: feeOptions })

    const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

    expect(hexToString(value)).toEqual('0')
    expect(calldata).toMatchSnapshot()
  })
  it('should encode a single exactInput USDT->USDC swap, with permit2', async () => {
    const amountIn = parseUnits('1000', 6)

    const stablePool = await getStablePool(USDT, USDC, getPublicClient)
    const trade = buildStableTrade(USDT, CurrencyAmount.fromRawAmount(USDT, amountIn), [stablePool])

    const permit = makePermit(USDC.address, UNIVERSAL_ROUTER)
    const signature = await signPermit(permit, wallet, PERMIT2)
    const permit2Permit: Permit2Permit = {
      ...permit,
      signature,
    }
    const options = swapOptions({
      inputTokenPermit: permit2Permit,
    })

    const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)

    expect(hexToString(value)).toEqual('0')
    expect(calldata).toMatchSnapshot()
  })
  it('should encode a exactInput USDT->USDC->BUSD swap', async () => {
    const amountIn = parseUnits('1000', 6)

    const USDT_USDC_POOL = await getStablePool(USDT, USDC, getPublicClient)
    const USDC_BUSD_POOL = await getStablePool(USDC, BUSD, getPublicClient)

    const trade = buildStableTrade(USDT, CurrencyAmount.fromRawAmount(USDT, amountIn), [USDT_USDC_POOL, USDC_BUSD_POOL])

    const options = swapOptions({})
    const { calldata, value } = PancakeUniSwapRouter.swapERC20CallParameters(trade, options)
    expect(hexToString(value)).toEqual('0')
    expect(calldata).toMatchSnapshot()
  })
})
