import { AptosAccount, HexString, Types } from 'aptos'
import { getAccount } from '../accounts/account'
import { Account } from '../connectors'
import { ProviderRpcError, SimulateTransactionError } from '../errors'
import { getProvider } from '../provider'

class MockAptosAccount extends AptosAccount {
  pubicKey: string

  constructor(account: Account) {
    if (!account.publicKey) {
      throw new Error('PublicKey is needed')
    }
    super(undefined, account.address)
    this.pubicKey = account.publicKey
  }

  pubKey() {
    return new HexString(this.pubicKey)
  }
}

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

  const mockAccount = new MockAptosAccount(account)
  const rawTransaction = await provider.generateTransaction(mockAccount.address(), payload, {
    ...options,
  })
  const simulatedUserTransactions = await provider.simulateTransaction(mockAccount, rawTransaction, {
    estimateGasUnitPrice: true,
    estimateMaxGasAmount: true,
    estimatePrioritizedGasUnitPrice: false,
  })

  if (throwOnError) {
    const foundError = simulatedUserTransactions.find((simulatedTx) => !simulatedTx.success)

    if (foundError) {
      throw new SimulateTransactionError(foundError)
    }
  }

  return simulatedUserTransactions
}
