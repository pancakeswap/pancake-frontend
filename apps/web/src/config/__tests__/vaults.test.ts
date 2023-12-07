import { ChainId } from '@pancakeswap/chains'
import { VAULTS_CONFIG_BY_CHAIN } from '@pancakeswap/position-managers'
import { positionManagerAdapterABI, positionManagerWrapperABI } from '@pancakeswap/position-managers/src/abi'
import { pancakeV3PoolABI } from '@pancakeswap/v3-sdk'
import { publicClient } from 'utils/client'
import { Address } from 'viem'
import { describe, expect, it } from 'vitest'

const mainnetVaults = [
  VAULTS_CONFIG_BY_CHAIN[ChainId.BSC],
  VAULTS_CONFIG_BY_CHAIN[ChainId.ETHEREUM],
  VAULTS_CONFIG_BY_CHAIN[ChainId.ARBITRUM_ONE],
  VAULTS_CONFIG_BY_CHAIN[ChainId.BASE],
  VAULTS_CONFIG_BY_CHAIN[ChainId.ZKSYNC],
  VAULTS_CONFIG_BY_CHAIN[ChainId.POLYGON_ZKEVM],
]

function hasDuplicates(array: any[]) {
  return new Set(array).size !== array.length
}

describe('Config position manger Vault', () => {
  it.each(mainnetVaults)('All vaults has an unique id', (...vaults) => {
    const ids = vaults.map((vault) => vault.id)
    expect(hasDuplicates(ids)).toBeFalsy()
  })

  it.each(mainnetVaults.flat())('All tokens same chainId', (vault) => {
    expect(vault.currencyA.chainId === vault.currencyB.chainId).toBeTruthy()
  })

  it.each(mainnetVaults.flat())('All tokens same chainId', (vault) => {
    expect(vault.currencyA.chainId === vault.currencyB.chainId).toBeTruthy()
  })

  describe.concurrent(
    'Config check adapter address, fee tier, reward token, token0, token1',
    () => {
      it.each(mainnetVaults.flat())('Config check adapter address & fee tier', async (vault) => {
        const client = publicClient({ chainId: vault.currencyA.chainId })
        let adapterAddressForTest: Address = '0x'
        const [adapterAddr, rewardTokenAddress] = await client.multicall({
          contracts: [
            {
              abi: positionManagerWrapperABI,
              address: vault.address,
              functionName: 'adapterAddr',
            },
            {
              abi: positionManagerWrapperABI,
              address: vault.address,
              functionName: 'rewardToken',
            },
          ],
          allowFailure: false,
        })
        // this is for some wrapper contract is not update the address of adapter
        if (adapterAddr === '0x0000000000000000000000000000000000000000') adapterAddressForTest = vault.adapterAddress
        else adapterAddressForTest = adapterAddr

        const [poolAddress, token0Address, token1Address] = await client.multicall({
          contracts: [
            {
              abi: positionManagerAdapterABI,
              address: adapterAddressForTest,
              functionName: 'pool',
            },
            {
              abi: positionManagerAdapterABI,
              address: adapterAddressForTest,
              functionName: 'token0',
            },
            {
              abi: positionManagerAdapterABI,
              address: adapterAddressForTest,
              functionName: 'token1',
            },
          ],
          allowFailure: false,
        })
        const [fee] = await client.multicall({
          contracts: [
            {
              abi: pancakeV3PoolABI,
              address: poolAddress,
              functionName: 'fee',
            },
          ],
          allowFailure: false,
        })

        expect(
          vault.adapterAddress,
          "Expected 'adapterAddress' to be the same as the value from the smart contract",
        ).toBe(adapterAddressForTest)
        expect(vault.feeTier, "Expected 'feeTier' to be the same as the value from the smart contract").toBe(fee)
        expect(
          vault.earningToken.isToken ? vault.earningToken.address : '0x',
          "Expected 'earningToken' to be the same as the value from the smart contract",
        ).toBe(rewardTokenAddress)
        expect(
          vault.currencyA.isToken ? vault.currencyA.address : '0x',
          "Expected 'currencyA' address to be the same as the value from the smart contract",
        ).toBe(token0Address)
        expect(
          vault.currencyB.isToken ? vault.currencyB.address : '0x',
          "Expected 'currencyB' address to be the same as the value from the smart contract",
        ).toBe(token1Address)
      })
    },
    {
      timeout: 30_000,
    },
  )
})
