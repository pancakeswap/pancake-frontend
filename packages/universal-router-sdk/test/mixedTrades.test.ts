import { expect } from 'chai'
import { UnwrapWETH } from '../src/entities/protocols/unwrapWETH'
import { SwapRouter, ROUTER_AS_RECIPIENT, WETH_ADDRESS, SeaportTrade } from '../src'
import { utils, Wallet } from 'ethers'
import { LooksRareV2Data, LooksRareV2Trade } from '../src/entities/protocols/looksRareV2'
import { looksRareV2Orders } from './orders/looksRareV2'
import { seaportV1_4DataETHRecent } from './orders/seaportV1_4'
import { Trade as V2Trade, Route as RouteV2, Pair } from '@uniswap/v2-sdk'
import { Trade as V3Trade, Route as RouteV3, Pool } from '@uniswap/v3-sdk'
import { generatePermitSignature, makePermit } from './utils/permit2'

import { UniswapTrade } from '../src'
import { CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { registerFixture } from './forge/writeInterop'
import { buildTrade, getUniswapPools, swapOptions, DAI, ETHER, WETH, USDC } from './utils/uniswapData'
import {
  FORGE_PERMIT2_ADDRESS,
  FORGE_ROUTER_ADDRESS,
  FORGE_SENDER_ADDRESS,
  TEST_RECIPIENT_ADDRESS,
} from './utils/addresses'
import { ETH_ADDRESS } from '../src/utils/constants'
import { hexToDecimalString } from './utils/hexToDecimalString'

describe('SwapRouter.swapCallParameters', () => {
  const wallet = new Wallet(utils.zeroPad('0x1234', 32))

  describe('erc20 --> nft', async () => {
    const looksRareV2Data: LooksRareV2Data = {
      apiOrder: looksRareV2Orders[0],
      taker: TEST_RECIPIENT_ADDRESS,
    }
    const looksRareV2Trade = new LooksRareV2Trade([looksRareV2Data])
    const looksRareV2Value = looksRareV2Trade.getTotalPrice()

    const invalidLooksRareV2Data: LooksRareV2Data = {
      ...looksRareV2Data,
      apiOrder: { ...looksRareV2Data.apiOrder, itemIds: ['1'] },
    }

    const invalidLooksRareV2Trade = new LooksRareV2Trade([invalidLooksRareV2Data])

    const seaportTrade = new SeaportTrade([seaportV1_4DataETHRecent])
    const seaportValue = seaportTrade.getTotalPrice(ETH_ADDRESS)

    let WETH_USDC_V3: Pool
    let USDC_DAI_V2: Pair
    let WETH_USDC_V2: Pair

    beforeEach(async () => {
      ;({ WETH_USDC_V3, USDC_DAI_V2, WETH_USDC_V2 } = await getUniswapPools(15360000))
    })

    it('erc20 -> 1 looksrare nft', async () => {
      const erc20Trade = buildTrade([
        await V3Trade.fromRoute(
          new RouteV3([WETH_USDC_V3], USDC, ETHER),
          CurrencyAmount.fromRawAmount(ETHER, looksRareV2Value.toString()),
          TradeType.EXACT_OUTPUT
        ),
      ])
      const opts = swapOptions({ recipient: ROUTER_AS_RECIPIENT })
      const uniswapTrade = new UniswapTrade(erc20Trade, opts)

      const methodParameters = SwapRouter.swapCallParameters([uniswapTrade, looksRareV2Trade], {
        sender: FORGE_SENDER_ADDRESS,
      })
      registerFixture('_ERC20_FOR_1_LOOKSRARE_NFT', methodParameters)
      expect(methodParameters.value).to.eq('0x00')
    })

    it('weth -> 1 looksrare nft with Permit', async () => {
      const permit2Data = makePermit(WETH_ADDRESS(1), looksRareV2Value.toString(), '0', FORGE_ROUTER_ADDRESS)
      const signature = await generatePermitSignature(permit2Data, wallet, 1, FORGE_PERMIT2_ADDRESS)
      const UnwrapWETHData = {
        ...permit2Data,
        signature,
      }
      const UnwrapWETHCommand = new UnwrapWETH(looksRareV2Value, 1, UnwrapWETHData)

      const methodParameters = SwapRouter.swapCallParameters([UnwrapWETHCommand, looksRareV2Trade], {
        sender: FORGE_ROUTER_ADDRESS,
      })
      registerFixture('_PERMIT_AND_WETH_FOR_1_LOOKSRARE_NFT', methodParameters)
      expect(methodParameters.value).to.eq('0x00')
    })

    it('weth -> 1 looksrare nft without Permit', async () => {
      const UnwrapWETHCommand = new UnwrapWETH(looksRareV2Value, 1)

      const methodParameters = SwapRouter.swapCallParameters([UnwrapWETHCommand, looksRareV2Trade], {
        sender: FORGE_SENDER_ADDRESS,
      })
      registerFixture('_WETH_FOR_1_LOOKSRARE_NFT', methodParameters)
      expect(methodParameters.value).to.eq('0x00')
    })

    it('erc20 + eth -> 1 looksrare nft', async () => {
      const halfOrderPriceWETH = CurrencyAmount.fromRawAmount(WETH, looksRareV2Trade.getTotalPrice().div(2).toString())
      const halfLooksRarePriceUSDC = (await WETH_USDC_V3.getInputAmount(halfOrderPriceWETH))[0]
      const erc20Trade = buildTrade([
        await V3Trade.fromRoute(
          new RouteV3([WETH_USDC_V3], USDC, ETHER),
          halfLooksRarePriceUSDC, // do not send enough USDC to cover entire cost
          TradeType.EXACT_INPUT
        ),
      ])
      const opts = swapOptions({ recipient: ROUTER_AS_RECIPIENT })
      const uniswapTrade = new UniswapTrade(erc20Trade, opts)

      const methodParameters = SwapRouter.swapCallParameters([uniswapTrade, looksRareV2Trade], {
        sender: FORGE_SENDER_ADDRESS,
      })
      registerFixture('_ERC20_AND_ETH_FOR_1_LOOKSRARE_NFT', methodParameters)
      expect(methodParameters.value).to.not.eq('0')
    })

    it('erc20 -> 1 looksRare nft & 1 seaport nft', async () => {
      const totalValue = looksRareV2Value.add(seaportValue).toString()

      const erc20Trade = buildTrade([
        await V3Trade.fromRoute(
          new RouteV3([WETH_USDC_V3], USDC, ETHER),
          CurrencyAmount.fromRawAmount(ETHER, totalValue),
          TradeType.EXACT_OUTPUT
        ),
      ])
      const opts = swapOptions({ recipient: ROUTER_AS_RECIPIENT })
      const uniswapTrade = new UniswapTrade(erc20Trade, opts)

      const methodParameters = SwapRouter.swapCallParameters([uniswapTrade, looksRareV2Trade, seaportTrade], {
        sender: FORGE_SENDER_ADDRESS,
      })
      registerFixture('_ERC20_FOR_1_LOOKSRARE_NFT_1_SEAPORT_NFT', methodParameters)
      expect(methodParameters.value).to.eq('0x00')
    })

    it('erc20 + eth -> 1 looksRare nft & 1 seaport nft1', async () => {
      const erc20Trade = buildTrade([
        await V3Trade.fromRoute(
          new RouteV3([WETH_USDC_V3], USDC, ETHER),
          CurrencyAmount.fromRawAmount(ETHER, looksRareV2Value.toString()),
          TradeType.EXACT_OUTPUT
        ),
      ])
      const opts = swapOptions({ recipient: ROUTER_AS_RECIPIENT })
      const uniswapTrade = new UniswapTrade(erc20Trade, opts)

      const methodParameters = SwapRouter.swapCallParameters([uniswapTrade, looksRareV2Trade, seaportTrade], {
        sender: FORGE_SENDER_ADDRESS,
      })
      registerFixture('_ERC20_AND_ETH_FOR_1_LOOKSRARE_NFT_1_SEAPORT_NFT', methodParameters)
      expect(hexToDecimalString(methodParameters.value)).to.eq(seaportValue.toString())
    })

    it('2 erc20s -> 1 NFT', async () => {
      const erc20Trade1 = buildTrade([
        await V3Trade.fromRoute(
          new RouteV3([WETH_USDC_V3], USDC, ETHER),
          CurrencyAmount.fromRawAmount(ETHER, looksRareV2Value.div(2).toString()),
          TradeType.EXACT_OUTPUT
        ),
      ])
      const erc20Trade2 = buildTrade([
        new V2Trade(
          new RouteV2([USDC_DAI_V2, WETH_USDC_V2], DAI, ETHER),
          CurrencyAmount.fromRawAmount(ETHER, looksRareV2Value.div(2).toString()),
          TradeType.EXACT_OUTPUT
        ),
      ])
      const opts = swapOptions({ recipient: ROUTER_AS_RECIPIENT })
      const uniswapTrade1 = new UniswapTrade(erc20Trade1, opts)
      const uniswapTrade2 = new UniswapTrade(erc20Trade2, opts)

      const methodParameters = SwapRouter.swapCallParameters([uniswapTrade1, uniswapTrade2, looksRareV2Trade], {
        sender: FORGE_SENDER_ADDRESS,
      })
      registerFixture('_2_ERC20s_FOR_1_NFT', methodParameters)
      expect(methodParameters.value).to.eq('0x00')
    })

    it('erc20 -> 1 invalid NFT', async () => {
      const erc20Trade = buildTrade([
        await V3Trade.fromRoute(
          new RouteV3([WETH_USDC_V3], USDC, ETHER),
          CurrencyAmount.fromRawAmount(ETHER, looksRareV2Value.toString()),
          TradeType.EXACT_OUTPUT
        ),
      ])
      const opts = swapOptions({ recipient: ROUTER_AS_RECIPIENT })
      const uniswapTrade = new UniswapTrade(erc20Trade, opts)

      const methodParameters = SwapRouter.swapCallParameters([uniswapTrade, invalidLooksRareV2Trade], {
        sender: FORGE_SENDER_ADDRESS,
      })
      registerFixture('_ERC20_FOR_1_INVALID_NFT', methodParameters)
      expect(methodParameters.value).to.eq('0x00')
    })

    it('erc20 -> 2 NFTs partial fill', async () => {
      const totalValue = looksRareV2Value.add(seaportValue).toString()

      const erc20Trade = buildTrade([
        await V3Trade.fromRoute(
          new RouteV3([WETH_USDC_V3], USDC, ETHER),
          CurrencyAmount.fromRawAmount(ETHER, totalValue),
          TradeType.EXACT_OUTPUT
        ),
      ])
      const opts = swapOptions({ recipient: ROUTER_AS_RECIPIENT })
      const uniswapTrade = new UniswapTrade(erc20Trade, opts)

      // invalid looks rare trade to make it a partial fill
      const methodParameters = SwapRouter.swapCallParameters([uniswapTrade, invalidLooksRareV2Trade, seaportTrade], {
        sender: FORGE_SENDER_ADDRESS,
      })
      registerFixture('_ERC20_FOR_NFTS_PARTIAL_FILL', methodParameters)
      expect(methodParameters.value).to.eq('0x00')
    })
  })
})
