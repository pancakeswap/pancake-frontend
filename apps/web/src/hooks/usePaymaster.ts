import isZero from '@pancakeswap/utils/isZero'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { Address, Hex, hexToBigInt, isAddress, stringify } from 'viem'
import { eip712WalletActions } from 'viem/zksync'

import { ChainId } from '@pancakeswap/chains'
import { ZyfiResponse } from 'config/paymaster'
import { useWalletClient } from 'wagmi'
import { useGasToken } from './useGasToken'

interface SwapCall {
  address: Address
  calldata: Hex
  value?: Hex
}

/**
 * Zyfi Paymaster for the zkSync chain
 */
export const usePaymaster = () => {
  const chain = useActiveChainId()
  const { data: walletClient } = useWalletClient()

  const [gasToken] = useGasToken()

  /**
   * Check if the Paymaster for zkSync is available
   */
  const isPaymasterAvailable = useMemo(() => {
    return chain && chain.chainId === ChainId.ZKSYNC
  }, [chain])

  /**
   * Check if a paymaster token is selected.
   * Default is the native token to pay gas
   */
  const isPaymasterTokenActive = useMemo(() => {
    return gasToken.isToken && gasToken.address && isAddress(gasToken.address)
  }, [gasToken])

  async function sendPaymasterTransaction(
    call: SwapCall & {
      gas?: string | bigint | undefined
    },
    account: Address,
  ) {
    if (!gasToken.isToken) throw new Error('Selected gas token is not an ERC20 token. Unsupported by Paymaster.')

    const response = await fetch(`https://api.zyfi.org/api/erc20_paymaster/v1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringify({
        feeTokenAddress: gasToken.address,
        gasLimit: call.gas,
        txData: {
          from: account,
          to: call.address,
          value: call.value,
          data: call.calldata,
        },
      }),
    })

    if (!response.ok) throw new Error('Failed to send paymaster transaction')

    const txResponse: ZyfiResponse = await response.json()

    const newTx = {
      account,
      to: txResponse.txData.to,
      value: txResponse.txData.value && !isZero(txResponse.txData.value) ? hexToBigInt(txResponse.txData.value) : 0n,
      chainId: ChainId.ZKSYNC,
      gas: BigInt(txResponse.gasLimit),
      maxFeePerGas: BigInt(txResponse.txData.maxFeePerGas),
      maxPriorityFeePerGas: BigInt(0),
      data: call.calldata,
      gasPerPubdata: BigInt(txResponse.txData.customData.gasPerPubdata),
      paymaster: txResponse.txData.customData.paymasterParams.paymaster,
      paymasterInput: txResponse.txData.customData.paymasterParams.paymasterInput,
    }

    if (walletClient) {
      // Extend Viem's zkSync utils
      const client = walletClient.extend(eip712WalletActions())
      const hash = await client.sendTransaction(newTx)
      return hash
    }

    throw new Error('Failed to execute paymaster transaction')
  }

  return {
    isPaymasterAvailable,
    isPaymasterTokenActive,
    sendPaymasterTransaction,
  }
}
