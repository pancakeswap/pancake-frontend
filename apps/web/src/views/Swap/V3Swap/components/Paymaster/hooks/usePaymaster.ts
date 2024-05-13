import { useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import isZero from '@pancakeswap/utils/isZero'
import { Address, Hex, hexToBigInt, isAddress, stringify } from 'viem'
import { eip712WalletActions, zkSync } from 'viem/zksync'
import { useWalletClient } from 'wagmi'
import { useAtomValue } from 'jotai'
import { feeTokenAddressAtom } from '../state/atoms'

import { ZyfiResponse } from '../types'
import { paymasterTokens } from '../config/config'

interface SwapCall {
  address: Address
  calldata: Hex
  value: Hex
}

/**
 * Zyfi Paymaster for the zkSync chain
 */
export const usePaymaster = () => {
  const chain = useActiveChainId()
  const { data: walletClient } = useWalletClient()

  const feeTokenAddress = useAtomValue(feeTokenAddressAtom)

  /**
   * Check if the Paymaster for zkSync is available
   */
  const isPaymasterAvailable = useMemo(() => {
    if (chain && chain.chainId === zkSync.id) return true

    return false
  }, [chain])

  /**
   * Check if a paymaster token is selected.
   * Default is the native token to pay gas
   */
  const isPaymasterTokenActive = useMemo(() => {
    return feeTokenAddress !== null && isAddress(feeTokenAddress)
  }, [feeTokenAddress])

  /**
   * Fetch the token list using internal config
   * and the Zyfi API for Markup/Discount information
   */
  const getPaymasterTokenlist = async () => {
    try {
      const response = await fetch('https://api.zyfi.org/api/erc20_paymaster/v1/batch', {
        method: 'POST',
        body: JSON.stringify({
          feeTokenAddresses: paymasterTokens.map((token) => token.address),
          gasLimit: '500000',
        }),
      })

      if (response.ok) {
        const tokenList: ZyfiResponse[] = await response.json()
        console.log('Paymaster Token List', tokenList)
        return tokenList
      }

      return []
    } catch (e) {
      console.error('Failed to fetch paymaster token list', e)
      return []
      // TODO: Add Datadog logger here?
    }
  }

  // async function previewPaymasterTransaction(call: SwapCall & { gas?: string | bigint | undefined }, account: Address) {
  //   const response = await fetch(`https://api.zyfi.org/api/erc20_paymaster/v1`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: stringify({
  //       feeTokenAddress,
  //       gasLimit: call.gas,
  //       txData: {
  //         from: account,
  //         to: call.address,
  //         value: call.value,
  //         data: call.calldata,
  //       },
  //     }),
  //   })

  //   if (response.ok) {
  //     const txResponse: ZyfiResponse = await response.json()
  //     return txResponse
  //   }

  //   return null
  // }

  async function executePaymasterTransaction(
    call: SwapCall & {
      gas?: string | bigint | undefined
    },
    account: Address,
    chainId?: number,
  ) {
    const response = await fetch(`https://api.zyfi.org/api/erc20_paymaster/v1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringify({
        feeTokenAddress,
        gasLimit: call.gas,
        txData: {
          from: account,
          to: call.address,
          value: call.value,
          data: call.calldata,
        },
      }),
    })

    if (response.ok) {
      const txResponse: ZyfiResponse = await response.json()
      console.debug('debug txResponse', txResponse)

      const newTx = {
        account,
        to: txResponse.txData.to,
        value: txResponse.txData.value && !isZero(txResponse.txData.value) ? hexToBigInt(txResponse.txData.value) : 0n,
        chainId: chainId || chain?.chainId || zkSync.id,
        gas: BigInt(txResponse.gasLimit),
        maxFeePerGas: BigInt(txResponse.txData.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(0),
        data: call.calldata,
        gasPerPubdata: BigInt(txResponse.txData.customData.gasPerPubdata),
        paymaster: txResponse.txData.customData.paymasterParams.paymaster,
        paymasterInput: txResponse.txData.customData.paymasterParams.paymasterInput,
      }

      if (walletClient) {
        // Extend with Viem's Utils for zkSync
        walletClient.extend(eip712WalletActions())

        const hash = await walletClient.sendTransaction(newTx)

        return hash
      }
    }

    return Promise.reject(new Error('Failed to execute paymaster transaction'))
  }

  return {
    isPaymasterAvailable,
    isPaymasterTokenActive,
    executePaymasterTransaction,
    getPaymasterTokenlist,
  }
}
