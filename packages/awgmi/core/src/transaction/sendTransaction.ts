import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'
import { Types } from 'aptos'
import { getAccount } from '../accounts/account'
import { ChainMismatchError, ConnectorNotFoundError, ProviderRpcError, UserRejectedRequestError } from '../errors'
import { getNetwork } from '../network/network'
import { getProvider } from '../provider'
import { TransactionResponse } from './types'

export type SendTransactionArgs = {
  /** Network name used to validate if the signer is connected to the target chain */
  networkName?: string
  payload?: Types.EntryFunctionPayload
}

export type SendTransactionResult = TransactionResponse

export async function sendTransaction({ networkName, payload }: SendTransactionArgs): Promise<SendTransactionResult> {
  const { chain: activeChain, chains } = getNetwork()
  const { connector } = getAccount()
  const provider = getProvider({ networkName })

  if (!connector) throw new ConnectorNotFoundError()

  const activeNetworkName = activeChain?.network
  if (networkName && !equalsIgnoreCase(networkName, activeChain?.network)) {
    throw new ChainMismatchError({
      activeChain:
        chains.find((x) => equalsIgnoreCase(x.network, activeNetworkName))?.name ?? `Chain ${activeNetworkName}`,
      targetChain: chains.find((x) => equalsIgnoreCase(x.name, networkName))?.name ?? `Chain ${networkName}`,
    })
  }

  try {
    const pending = await connector.signAndSubmitTransaction(payload)

    const response = pending as TransactionResponse
    if (response) {
      response.wait = async (opts) => {
        return provider.waitForTransactionWithResult(pending.hash, opts)
      }
    }
    return response
  } catch (error) {
    if ((<ProviderRpcError>error).code === 4001) throw new UserRejectedRequestError(error)
    throw error
  }
}
