import { ChainId, Token } from '@pancakeswap/sdk'
import { describe, it, expect } from 'vitest'
import { DEPLOYER_ADDRESSES, FeeAmount } from '../constants'
import { computePoolAddress } from './computePoolAddress'

describe('#computePoolAddress', () => {
  const deployerAddress = '0x1111111111111111111111111111111111111111'
  it('should correctly compute the pool address', () => {
    const tokenA = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
    const tokenB = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
    const result = computePoolAddress({
      deployerAddress,
      fee: FeeAmount.LOW,
      tokenA,
      tokenB,
    })

    expect(result).toEqual('0x993B1e86fFEf6609e47416212C17B0df746fa985')
  })

  it('should correctly compute the pool address zkSync', () => {
    const USDC = new Token(280, '0x0faF6df7054946141266420b43783387A78d82A9', 6, 'USDC', 'USD Coin')
    const WETH = new Token(280, '0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0', 18, 'WETH')
    const result = computePoolAddress({
      deployerAddress: DEPLOYER_ADDRESSES[ChainId.ZKSYNC_TESTNET],
      fee: FeeAmount.LOW,
      tokenA: USDC,
      tokenB: WETH,
    })

    expect(result).toEqual('0xfC02e31553A979a5827EE95e17bAE43ae79D6761')
  })

  it('should correctly compute the pool address2', () => {
    const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
    const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
    let tokenA = USDC
    let tokenB = DAI
    const resultA = computePoolAddress({
      deployerAddress,
      fee: FeeAmount.LOW,
      tokenA,
      tokenB,
    })

    tokenA = DAI

    tokenB = USDC
    const resultB = computePoolAddress({
      deployerAddress,
      fee: FeeAmount.LOW,
      tokenA,
      tokenB,
    })

    expect(resultA).toEqual(resultB)
  })
})
