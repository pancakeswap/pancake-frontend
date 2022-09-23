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
  options?: Types.SubmitTransactionRequest
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
  const estimateGasPrice = await provider.client.transactions.estimateGasPrice()
  const rawTransaction = await provider.generateTransaction(mockAccount.address(), payload, {
    gas_unit_price: String(estimateGasPrice.gas_estimate),
    ...options,
  })
  const simulatedUserTransactions = await provider.simulateTransaction(mockAccount, rawTransaction)

  if (throwOnError) {
    const foundError = simulatedUserTransactions.find((simulatedTx) => !simulatedTx.success)

    if (foundError) {
      throw new SimulateTransactionError(foundError)
    }
  }

  return simulatedUserTransactions
}
