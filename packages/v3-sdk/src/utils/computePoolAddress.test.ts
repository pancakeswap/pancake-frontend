import { Token } from '@pancakeswap/sdk'
import { describe, it, expect } from 'vitest'
import { FeeAmount } from '../constants'
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

  it.todo('should correctly compute the pool address zkSync', () => {
    const USDC = new Token(280, '0x0faF6df7054946141266420b43783387A78d82A9', 6, 'USDC', 'USD Coin')
    const WETH = new Token(280, '0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0', 18, 'WETH')
    const result = computePoolAddress({
      deployerAddress: '0x71df5b7ea5355180EAb2A54de8aA534016040008',
      fee: FeeAmount.MEDIUM,
      tokenA: USDC,
      tokenB: WETH,
    })

    expect(result).toEqual('0x25f728a155C883aa9bFfa8474b3e5Cd82B89e055')
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
