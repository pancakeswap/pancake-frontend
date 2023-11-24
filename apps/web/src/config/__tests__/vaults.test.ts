import { ChainId } from '@pancakeswap/chains'
import { vaultsConfigChainMap } from '@pancakeswap/position-managers/constants'
import { positionManagerWrapperABI } from '@pancakeswap/position-managers/src/abi'
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
    'Config tokens',
    () => {
      it.each(mainnetVaults)('vault has the correct key,', async (vault) => {
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
        expect(vault.adapterAddress).toBe(adapterAddress)
      })
    },
    {
      timeout: 30_000,
    },
  )
})
