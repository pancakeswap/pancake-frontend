import { expect } from 'chai'
import JSBI from 'jsbi'
import { BigNumber, utils, Wallet } from 'ethers'
import { expandTo18Decimals } from '../src/utils/numbers'
import { SwapRouter, UniswapTrade } from '../src'
import { MixedRouteTrade, MixedRouteSDK } from '@uniswap/router-sdk'
import { Trade as V2Trade, Pair, Route as RouteV2 } from '@uniswap/v2-sdk'
import { Trade as V3Trade, Route as RouteV3, Pool, FeeOptions } from '@uniswap/v3-sdk'
import { generatePermitSignature, toInputPermit, makePermit, generateEip2098PermitSignature } from './utils/permit2'
import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { registerFixture } from './forge/writeInterop'
import { buildTrade, getUniswapPools, swapOptions, ETHER, DAI, USDC } from './utils/uniswapData'
import { hexToDecimalString } from './utils/hexToDecimalString'
import { FORGE_PERMIT2_ADDRESS, FORGE_ROUTER_ADDRESS, TEST_FEE_RECIPIENT_ADDRESS } from './utils/addresses'

const FORK_BLOCK = 16075500

// note: these tests aren't testing much but registering calldata to interop file
// for use in forge fork tests
describe('Uniswap', () => {
  const wallet = new Wallet(utils.zeroPad('0x1234', 32))
  let WETH_USDC_V2: Pair
  let USDC_DAI_V2: Pair
  let WETH_USDC_V3: Pool
  let WETH_USDC_V3_LOW_FEE: Pool
  let USDC_DAI_V3: Pool

  before(async () => {
    ;({ WETH_USDC_V2, USDC_DAI_V2, WETH_USDC_V3, USDC_DAI_V3, WETH_USDC_V3_LOW_FEE } = await getUniswapPools(
      FORK_BLOCK
    ))
  })

  describe('v2', () => {
    it('encodes a single exactInput ETH->USDC swap', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_1_ETH_FOR_USDC', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput ETH->USDC swap, with a fee', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const feeOptions: FeeOptions = { fee: new Percent(5, 100), recipient: TEST_FEE_RECIPIENT_ADDRESS }
      const opts = swapOptions({ fee: feeOptions })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_1_ETH_FOR_USDC_WITH_FEE', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes an exactInput ETH->USDC->DAI swap', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2, USDC_DAI_V2], ETHER, DAI),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_1_ETH_FOR_USDC_2_HOP', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes an exactInput ETH->USDC->DAI swap, with a fee', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2, USDC_DAI_V2], ETHER, DAI),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const feeOptions: FeeOptions = { fee: new Percent(5, 100), recipient: TEST_FEE_RECIPIENT_ADDRESS }
      const opts = swapOptions({ fee: feeOptions })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_1_ETH_FOR_USDC_2_HOP_WITH_FEE', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput USDC->ETH swap', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, inputUSDC),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_1000_USDC_FOR_ETH', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput USDC->ETH swap, with WETH fee', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, inputUSDC),
        TradeType.EXACT_INPUT
      )
      const feeOptions: FeeOptions = { fee: new Percent(5, 100), recipient: TEST_FEE_RECIPIENT_ADDRESS }
      const opts = swapOptions({ fee: feeOptions })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_1000_USDC_FOR_ETH_WITH_WETH_FEE', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput USDC->ETH swap with permit', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, inputUSDC),
        TradeType.EXACT_INPUT
      )
      const permit = makePermit(USDC.address, inputUSDC, undefined, FORGE_ROUTER_ADDRESS)
      const signature = await generatePermitSignature(permit, wallet, trade.route.chainId, FORGE_PERMIT2_ADDRESS)
      const opts = swapOptions({ inputTokenPermit: toInputPermit(signature, permit) })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_1000_USDC_FOR_ETH_PERMIT', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput USDC->ETH swap with EIP-2098 permit', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, inputUSDC),
        TradeType.EXACT_INPUT
      )
      const permit = makePermit(USDC.address, inputUSDC, undefined, FORGE_ROUTER_ADDRESS)
      const signature = await generateEip2098PermitSignature(permit, wallet, trade.route.chainId)
      const opts = swapOptions({ inputTokenPermit: toInputPermit(signature, permit) })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_1000_USDC_FOR_ETH_2098_PERMIT', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput USDC->ETH swap with permit with v recovery id', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, inputUSDC),
        TradeType.EXACT_INPUT
      )
      const permit = makePermit(USDC.address, inputUSDC, undefined, FORGE_ROUTER_ADDRESS)
      const originalSignature = await generatePermitSignature(
        permit,
        wallet,
        trade.route.chainId,
        FORGE_PERMIT2_ADDRESS
      )
      const { recoveryParam } = utils.splitSignature(originalSignature)
      // slice off current v
      let signature = originalSignature.substring(0, originalSignature.length - 2)
      // append recoveryParam as v
      signature += BigNumber.from(recoveryParam).toHexString().slice(2)
      // assert ethers sanitization technique works
      expect(utils.joinSignature(utils.splitSignature(signature))).to.eq(originalSignature)
      const opts = swapOptions({ inputTokenPermit: toInputPermit(signature, permit) })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_1000_USDC_FOR_ETH_PERMIT_V_RECOVERY_PARAM', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes an exactInput DAI->USDC->ETH swap', async () => {
      const inputDAI = utils.parseEther('10').toString()
      const trade = new V2Trade(
        new RouteV2([USDC_DAI_V2, WETH_USDC_V2], DAI, ETHER),
        CurrencyAmount.fromRawAmount(DAI, inputDAI),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_10_DAI_FOR_ETH_2_HOP', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactOutput ETH->USDC swap', async () => {
      const outputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(USDC, outputUSDC),
        TradeType.EXACT_OUTPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_ETH_FOR_1000_USDC', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.not.equal('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactOutput ETH->USDC swap, with a fee', async () => {
      // We must adjust the output amount for the 5% output fee
      const outputUSDC = utils.parseUnits('1000', 6)
      const adjustedOutputUSDC = outputUSDC
        .mul(10000)
        .div(10000 - 500)
        .toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(USDC, adjustedOutputUSDC),
        TradeType.EXACT_OUTPUT
      )
      const feeOptions: FeeOptions = { fee: new Percent(5, 100), recipient: TEST_FEE_RECIPIENT_ADDRESS }
      const opts = swapOptions({ fee: feeOptions })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_ETH_FOR_1000_USDC_WITH_FEE', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.not.equal('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactOutput USDC->ETH swap', async () => {
      const outputETH = utils.parseEther('1').toString()
      const trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], USDC, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, outputETH),
        TradeType.EXACT_OUTPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V2_USDC_FOR_1_ETH', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('v3', () => {
    it('encodes a single exactInput ETH->USDC swap', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_1_ETH_FOR_USDC', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput ETH->USDC swap, with a fee', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const feeOptions: FeeOptions = { fee: new Percent(5, 100), recipient: TEST_FEE_RECIPIENT_ADDRESS }
      const opts = swapOptions({ fee: feeOptions })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_1_ETH_FOR_USDC_WITH_FEE', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput USDC->ETH swap', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, inputUSDC),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_1000_USDC_FOR_ETH', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput USDC->ETH swap, with WETH fee', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, inputUSDC),
        TradeType.EXACT_INPUT
      )
      const feeOptions: FeeOptions = { fee: new Percent(5, 100), recipient: TEST_FEE_RECIPIENT_ADDRESS }
      const opts = swapOptions({ fee: feeOptions })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_1000_USDC_FOR_ETH_WITH_WETH_FEE', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput USDC->ETH swap with permit', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], USDC, ETHER),
        CurrencyAmount.fromRawAmount(USDC, inputUSDC),
        TradeType.EXACT_INPUT
      )
      const permit = makePermit(USDC.address, inputUSDC, undefined, FORGE_ROUTER_ADDRESS)
      const signature = await generatePermitSignature(
        permit,
        wallet,
        trade.swaps[0].route.chainId,
        FORGE_PERMIT2_ADDRESS
      )
      const opts = swapOptions({ inputTokenPermit: toInputPermit(signature, permit) })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_1000_USDC_FOR_ETH_PERMIT', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactInput ETH->USDC->DAI swap', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3, USDC_DAI_V3], ETHER, DAI),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_1_ETH_FOR_DAI_2_HOP', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactOutput ETH->USDC swap', async () => {
      const outputUSDC = utils.parseUnits('1000', 6).toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], ETHER, USDC),
        CurrencyAmount.fromRawAmount(USDC, outputUSDC),
        TradeType.EXACT_OUTPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_ETH_FOR_1000_USDC', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.not.equal('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a single exactOutput USDC->ETH swap', async () => {
      const outputEther = utils.parseEther('1').toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], USDC, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, outputEther),
        TradeType.EXACT_OUTPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_USDC_FOR_1_ETH', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes an exactOutput ETH->USDC->DAI swap', async () => {
      const outputDai = utils.parseEther('1000').toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3, USDC_DAI_V3], ETHER, DAI),
        CurrencyAmount.fromRawAmount(DAI, outputDai),
        TradeType.EXACT_OUTPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_ETH_FOR_1000_DAI_2_HOP', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.not.equal('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes an exactOutput DAI->USDC->ETH swap', async () => {
      const outputEther = utils.parseEther('1').toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([USDC_DAI_V3, WETH_USDC_V3], DAI, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, outputEther),
        TradeType.EXACT_OUTPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_DAI_FOR_1_ETH_2_HOP', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.equal('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes an exactOutput DAI->USDC->ETH swap, with WETH fee', async () => {
      // "exact output" of 1ETH. We must adjust for a 5% fee
      const outputEther = utils.parseEther('1')
      const adjustedOutputEther = outputEther
        .mul(10000)
        .div(10000 - 500)
        .toString()
      const trade = await V3Trade.fromRoute(
        new RouteV3([USDC_DAI_V3, WETH_USDC_V3], DAI, ETHER),
        CurrencyAmount.fromRawAmount(ETHER, adjustedOutputEther),
        TradeType.EXACT_OUTPUT
      )
      const feeOptions: FeeOptions = { fee: new Percent(5, 100), recipient: TEST_FEE_RECIPIENT_ADDRESS }
      const opts = swapOptions({ fee: feeOptions })
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_V3_DAI_FOR_1_ETH_2_HOP_WITH_WETH_FEE', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.equal('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('mixed (interleaved)', async () => {
    it('encodes a mixed exactInput v3ETH->v2USDC->DAI swap', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = await MixedRouteTrade.fromRoute(
        new MixedRouteSDK([WETH_USDC_V3, USDC_DAI_V2], ETHER, DAI),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_MIXED_1_ETH_FOR_DAI', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a mixed exactInput v2ETH->v3USDC->DAI swap', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = await MixedRouteTrade.fromRoute(
        new MixedRouteSDK([WETH_USDC_V2, USDC_DAI_V3], ETHER, DAI),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_MIXED_1_ETH_FOR_DAI_V2_FIRST', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a mixed exactInput v2ETH->v2USDC->DAI swap', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = await MixedRouteTrade.fromRoute(
        new MixedRouteSDK([WETH_USDC_V2, USDC_DAI_V2], ETHER, DAI),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_MIXED_1_ETH_FOR_DAI_V2_ONLY', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a mixed exactInput v3ETH->v3USDC->DAI swap', async () => {
      const inputEther = utils.parseEther('1').toString()
      const trade = await MixedRouteTrade.fromRoute(
        new MixedRouteSDK([WETH_USDC_V3, USDC_DAI_V3], ETHER, DAI),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_MIXED_1_ETH_FOR_DAI_V3_ONLY', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(inputEther)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a mixed exactInput v2DAI->v3USDC->ETH swap', async () => {
      const inputDai = utils.parseEther('1000').toString()
      const trade = await MixedRouteTrade.fromRoute(
        new MixedRouteSDK([USDC_DAI_V2, WETH_USDC_V3], DAI, ETHER),
        CurrencyAmount.fromRawAmount(DAI, inputDai),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([trade]), opts))
      registerFixture('_UNISWAP_MIXED_DAI_FOR_ETH', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('multi-route', async () => {
    it('encodes a split exactInput with 2 routes v3ETH->v3USDC & v2ETH->v2USDC swap', async () => {
      const inputEther = expandTo18Decimals(1)
      const v2Trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const v3Trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([v2Trade, v3Trade]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters(new UniswapTrade(buildTrade([v2Trade, v3Trade]), opts))
      registerFixture('_UNISWAP_SPLIT_TWO_ROUTES_ETH_TO_USDC', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(JSBI.multiply(inputEther, JSBI.BigInt(2)).toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes a split exactInput with 3 routes v3ETH->v3USDC & v2ETH->v2USDC swap', async () => {
      const inputEther = expandTo18Decimals(1)
      const v2Trade = new V2Trade(
        new RouteV2([WETH_USDC_V2], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const v3Trade1 = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )
      const v3Trade2 = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3_LOW_FEE], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
      )

      const opts = swapOptions({})
      const methodParameters = SwapRouter.swapERC20CallParameters(buildTrade([v2Trade, v3Trade1, v3Trade2]), opts)
      const methodParametersV2 = SwapRouter.swapCallParameters([
        new UniswapTrade(buildTrade([v2Trade, v3Trade1, v3Trade2]), opts),
      ])
      registerFixture('_UNISWAP_SPLIT_TWO_ROUTES_ETH_TO_USDC', methodParametersV2)
      registerFixture('_UNISWAP_SPLIT_THREE_ROUTES_ETH_TO_USDC', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(JSBI.multiply(inputEther, JSBI.BigInt(3)).toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })
})
