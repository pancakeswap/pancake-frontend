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
import { hexToString, parseEther } from 'viem'
import { fixtureAddresses } from './fixtures/address'
import { PancakeUniSwapRouter, PancakeSwapOptions, PancakeSwapTrade } from '../src'

describe('PancakeSwap Universal Router Trade', () => {
  const chainId = ChainId.ETHEREUM
  let ETHER: Ether
  let USDC: ERC20Token
  let USDT: ERC20Token
  let WETH: ERC20Token
  let WETH_USDC_V2: Pair

  beforeAll(async () => {
    ;({ ETHER, USDC, USDT, WETH, WETH_USDC_V2 } = await fixtureAddresses(chainId))
  })

  describe('v2', () => {
    it('should encode a single exactIn ETH -> USDC Swap', async () => {})
  })
  describe('v3', () => {})
  describe('mixed v2 & v3', () => {})
  describe('multi-route', () => {})
})
