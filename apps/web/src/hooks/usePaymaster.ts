import { useCallback, useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import isZero from '@pancakeswap/utils/isZero'
import { Address, Hex, hexToBigInt, isAddress, stringify } from 'viem'
import { serializeTransaction } from 'viem/zksync'
import { useAtomValue } from 'jotai'

import { useWalletClient } from 'wagmi'
import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { paymasterTokens } from '../config/paymaster'
import { feeTokenAtom } from '../state/paymaster/atoms'
import { getEip712Domain } from '../utils/paymaster'

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

  const feeToken = useAtomValue(feeTokenAtom)

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
    return feeToken.isToken && feeToken.address && isAddress(feeToken.address)
  }, [feeToken])

  const getPaymasterTokenlist = useCallback(() => {
    return paymasterTokens
  }, [])

  async function sendPaymasterTransaction(
    call: SwapCall & {
      gas?: string | bigint | undefined
    },
    account: Address,
  ) {
    if (!feeToken.isToken)
      return Promise.reject(new Error('Selected gas token is not an ERC20 token. Unsupported by Paymaster.'))

    const response = await fetch(`https://api.zyfi.org/api/erc20_paymaster/v1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringify({
        feeTokenAddress: feeToken.address,
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
      const txResponse: any = await response.json()
      console.debug('debug txResponse', txResponse)

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

      // Viem's zkSync Utils. If not working, use EIP-712 normally
      // const walletClient = (await getWalletClient(createWagmiConfig())).extend(eip712WalletActions())

      if (walletClient) {
        const txRequest = await walletClient.prepareTransactionRequest(newTx)

        const eip712Domain = getEip712Domain({
          ...txRequest,
          chainId: ChainId.ZKSYNC,
          from: account,
          type: 'eip712',
        })

        const customSignature = await walletClient.signTypedData({
          ...eip712Domain,
          account,
        } as any)

        const serializedTransaction = serializeTransaction({
          ...txRequest,
          chainId: ChainId.ZKSYNC,
          customSignature,
          type: 'eip712',
        } as any)

        const hash = await walletClient.sendRawTransaction({ serializedTransaction })
        return hash
      }
    }

    return Promise.reject(new Error('Failed to execute paymaster transaction'))
  }

  return {
    feeToken,
    isPaymasterAvailable,
    isPaymasterTokenActive,
    sendPaymasterTransaction,
    getPaymasterTokenlist,
  }
}
