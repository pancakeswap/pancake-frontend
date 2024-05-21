import { useCallback, useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import isZero from '@pancakeswap/utils/isZero'
import { Address, Hex, hexToBigInt, isAddress, stringify } from 'viem'
import { serializeTransaction, zkSync } from 'viem/zksync'
import { useAtomValue } from 'jotai'

import { useWalletClient } from 'wagmi'
import { paymasterTokens } from '../config/config'
import { feeTokenAtom } from '../state/atoms'
import { getEip712Domain } from '../utils'
import { PaymasterToken, ZyfiResponse } from '../types'

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
    if (chain && chain.chainId === zkSync.id) return true

    return false
  }, [chain])

  /**
   * Check if a paymaster token is selected.
   * Default is the native token to pay gas
   */
  const isPaymasterTokenActive = useMemo(() => {
    return feeToken.isToken && isAddress(feeToken.address)
  }, [feeToken])

  /**
   * Fetch the token list using internal config
   * and the Zyfi API for Markup/Discount information
   */
  const getPaymasterTokenlist = useCallback(
    async (txData?: { from: Address; to: Address; value: string; data: Hex }) => {
      try {
        const response = await fetch('https://api.zyfi.org/api/erc20_paymaster/v1/batch', {
          method: 'POST',
          body: JSON.stringify({
            feeTokenAddresses: paymasterTokens.map((token) => token.address),
            gasLimit: '500000',
            txData,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const tokenList: ZyfiResponse[] = await response.json()

          // Type is a combination of (PaymasterToken OR ERC20Token) AND ZyfiResponse
          const tempTokenList: PaymasterToken[] = []

          // The returned token list from Zyfi is in the same order as the paymasterTokens
          for (let i = 0; i < tokenList.length; i++) {
            tempTokenList.push({
              ...tokenList[i],
              ...paymasterTokens[i],
            })
          }

          return tempTokenList
        }

        return []
      } catch (e) {
        console.error('Failed to fetch paymaster token list', e)
        return []
      }
    },
    [],
  )

  async function sendPaymasterTransaction(
    call: SwapCall & {
      gas?: string | bigint | undefined
    },
    account: Address,
  ) {
    const response = await fetch(`https://api.zyfi.org/api/erc20_paymaster/v1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringify({
        feeTokenAddress: feeToken?.address,
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
        chainId: zkSync.id,
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
          chainId: zkSync.id,
          from: account,
          type: 'eip712',
        })

        const customSignature = await walletClient.signTypedData({
          ...eip712Domain,
          account,
        } as any)

        const serializedTransaction = serializeTransaction({
          ...txRequest,
          chainId: zkSync.id,
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
