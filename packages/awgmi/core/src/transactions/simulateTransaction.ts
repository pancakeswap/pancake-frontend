import {
  Ed25519PublicKey,
  Hex,
  InputGenerateTransactionOptions,
  InputGenerateTransactionPayloadData,
  InputSimulateTransactionData,
  InputSimulateTransactionOptions,
  UserTransactionResponse,
} from '@aptos-labs/ts-sdk'

import { getAccount } from '../accounts/account'
import { getClient } from '../client'
import { SimulateTransactionError, WalletProviderError } from '../errors'
import { getProvider } from '../providers'

export type SimulateTransactionArgs = {
  /** Network name used to validate if the signer is connected to the target chain */
  networkName?: string
  throwOnError?: boolean
  payload: InputGenerateTransactionPayloadData
  transactionBuildOptions?: InputGenerateTransactionOptions
  options?: Partial<Omit<InputSimulateTransactionData, 'transaction' | 'options'>>
  query?: InputSimulateTransactionOptions
}

export type SimulateTransactionResult = UserTransactionResponse[]

export async function simulateTransaction({
  networkName,
  payload,
  throwOnError = true,
  transactionBuildOptions,
  options,
  query,
}: SimulateTransactionArgs): Promise<SimulateTransactionResult> {
  const { account } = getAccount()
  const provider = getProvider({ networkName })

  if (!account) throw new WalletProviderError(4100, 'No Account')

  let { publicKey } = account

  if (!publicKey) {
    const client = getClient()
    const activeConnector = client.connector
    const accountFromActiveConnector = await activeConnector?.account()
    publicKey = accountFromActiveConnector?.publicKey
  }

  if (!publicKey) throw new WalletProviderError(4100, 'Missing pubic key')

  if (Array.isArray(publicKey)) {
    throw new Error('Multi sig not supported')
  }

  const rawTransaction = await provider.transaction.build.simple({
    sender: account.address,
    data: payload,
    options: transactionBuildOptions,
  })

  const simulatedUserTransactions = await provider.transaction.simulate.simple({
    signerPublicKey: new Ed25519PublicKey(Hex.fromHexInput(publicKey).toUint8Array()),
    transaction: rawTransaction,
    options: {
      estimateGasUnitPrice: true,
      estimateMaxGasAmount: true,
      estimatePrioritizedGasUnitPrice: false,
      ...query,
    },
    ...options,
  })

  if (throwOnError) {
    const foundError = simulatedUserTransactions.find((simulatedTx) => !simulatedTx.success)

    if (foundError) {
      throw new SimulateTransactionError(foundError)
    }
  }

  return simulatedUserTransactions
}
