import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'
import { EntryFunctionPayload, PendingTransaction } from 'aptos/dist/generated'
import { getAccount } from './accounts/account'
import { ChainMismatchError, ConnectorNotFoundError } from './errors'
import { getNetwork } from './network/network'

export type SendTransactionArgs = {
  /** Network name used to validate if the signer is connected to the target chain */
  networkName?: string
  payload: EntryFunctionPayload
}

export type SendTransactionResult = PendingTransaction

export async function sendTransaction({ networkName, payload }: SendTransactionArgs): Promise<SendTransactionResult> {
  const { chain: activeChain, chains } = getNetwork()
  const { connector, account } = getAccount()

  if (!connector) throw new ConnectorNotFoundError()

  const activeNetworkName = activeChain?.network
  // if (!equalsIgnoreCase(networkName, activeChain?.network)) {
  //   throw new ChainMismatchError({
  //     activeChain:
  //       chains.find((x) => equalsIgnoreCase(x.network, activeNetworkName))?.name ?? `Chain ${activeNetworkName}`,
  //     targetChain: chains.find((x) => equalsIgnoreCase(x.name, networkName))?.name ?? `Chain ${networkName}`,
  //   })
  // }

  try {
    return connector.signAndSubmitTransaction(payload)
  } catch (error) {
    // TODO: user reject error
    console.error('error', error)
    throw error
  }
}
