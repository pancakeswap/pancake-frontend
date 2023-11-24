import { ChainId } from '@pancakeswap/chains'
import { vaultsConfigChainMap } from '@pancakeswap/position-managers/constants'
import { positionManagerAdapterABI, positionManagerWrapperABI } from '@pancakeswap/position-managers/src/abi'
import { pancakeV3PoolABI } from '@pancakeswap/smart-router/evm/abis/IPancakeV3Pool'
import { publicClient } from 'utils/client'
import { describe, expect, it } from 'vitest'

const mainnetVaults = [vaultsConfigChainMap[ChainId.BSC], vaultsConfigChainMap[ChainId.ETHEREUM]]

function hasDuplicates(array: any[]) {
  return new Set(array).size !== array.length
}

describe('Config position manger Vault', () => {
  it.each(mainnetVaults)('All farm has an unique pid', (...vaults) => {
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
    'Config check adapter address & fee tier',
    () => {
      it.each(mainnetVaults.flat())('Config check adapter address & fee tier', async (vault) => {
        const client = publicClient({ chainId: vault.currencyA.chainId })
        const [adapterAddress] = await client.multicall({
          contracts: [
            {
              abi: positionManagerWrapperABI,
              address: vault.address,
              functionName: 'adapterAddr',
            },
          ],
          allowFailure: false,
        })
        const [poolAddress] = await client.multicall({
          contracts: [
            {
              abi: positionManagerAdapterABI,
              address: adapterAddress,
              functionName: 'pool',
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

        expect(vault.adapterAddress).toBe(adapterAddress)
        expect(vault.feeTier).toBe(fee)
      })
    },
    {
      timeout: 30_000,
    },
  )
})
