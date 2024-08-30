import isZero from '@pancakeswap/utils/isZero'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { Address, Hex, hexToBigInt, isAddress, stringify } from 'viem'

import { ChainId } from '@pancakeswap/chains'
import { ZyfiResponse } from 'config/paymaster'
import { publicClient } from 'utils/viem'
import { eip712WalletActions } from 'viem/zksync'
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
    account?: Address,
  ) {
    if (!account) throw new Error('An active wallet connection is required to send paymaster transaction')
    if (!gasToken.isToken) throw new Error('Selected gas token is not an ERC20 token. Unsupported by Paymaster.')
    if (!isPaymasterAvailable || !isPaymasterTokenActive) throw new Error('Paymaster is not available or active.')

    const response = await fetch('/api/paymaster', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringify({
        call,
        account,
        gasTokenAddress: gasToken.address,
      }),
    })

    if (!response.ok) throw new Error('Failed to send paymaster transaction')

    const txResponse: ZyfiResponse = await response.json()

    const zkPublicClient = publicClient({ chainId: ChainId.ZKSYNC })

    const nonce = await zkPublicClient.getTransactionCount({
      address: account,
    })

    const newTx = {
      account,
      nonce,
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

    if (!walletClient) {
      throw new Error('Failed to execute paymaster transaction')
    }

    const client: any = walletClient.extend(eip712WalletActions() as any)

    const txReq = await client.prepareTransactionRequest(newTx)
    const signature = await client.signTransaction(txReq)
    const hash = await zkPublicClient.sendRawTransaction({
      serializedTransaction: signature,
    })

    return hash
  }

  return {
    isPaymasterAvailable,
    isPaymasterTokenActive,
    sendPaymasterTransaction,
  }
}
