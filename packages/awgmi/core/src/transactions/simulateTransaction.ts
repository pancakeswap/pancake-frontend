import { HexString, TxnBuilderTypes, Types } from 'aptos'
import { getAccount } from '../accounts/account'
import { getClient } from '../client'
import { ProviderRpcError, SimulateTransactionError } from '../errors'
import { getProvider } from '../providers'

export type SimulateTransactionArgs = {
  /** Network name used to validate if the signer is connected to the target chain */
  networkName?: string
  throwOnError?: boolean
  payload: Types.EntryFunctionPayload
  options?: Omit<Types.SubmitTransactionRequest, 'payload' | 'signature'>
}

export type SimulateTransactionResult = Types.UserTransaction[]

export async function simulateTransaction({
  networkName,
  payload,
  throwOnError = true,
  options,
}: SimulateTransactionArgs): Promise<SimulateTransactionResult> {
  const { account } = getAccount()
  const provider = getProvider({ networkName })

  if (!account) throw new ProviderRpcError(4100, 'No Account')

  let { publicKey } = account

  if (!publicKey) {
    const client = getClient()
    const activeConnector = client.connector
    const accountFromActiveConnector = await activeConnector?.account()
    publicKey = accountFromActiveConnector?.publicKey
  }

  if (!publicKey) throw new ProviderRpcError(4100, 'Missing pubic key')

  if (Array.isArray(publicKey)) {
    throw new Error('Multi sig not supported')
  }

  const rawTransaction = await provider.generateTransaction(account.address, payload, {
    ...options,
  })

  const simulatedUserTransactions = await provider.simulateTransaction(
    new TxnBuilderTypes.Ed25519PublicKey(HexString.ensure(publicKey).toUint8Array()),
    rawTransaction,
    {
      estimateGasUnitPrice: true,
      estimateMaxGasAmount: true,
      estimatePrioritizedGasUnitPrice: false,
    },
  )

  if (throwOnError) {
    const foundError = simulatedUserTransactions.find((simulatedTx) => !simulatedTx.success)

    if (foundError) {
      throw new SimulateTransactionError(foundError)
    }
  }

  return simulatedUserTransactions
}
