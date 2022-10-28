/* eslint-disable camelcase */
import { Types } from 'aptos'
import { ConnectorTransactionResponse } from '../connectors/index'

export const isUserTransaction = (tx: Types.Transaction): tx is Types.Transaction_UserTransaction =>
  tx.type === 'user_transaction'

export const isPendingTransaction = (tx: Types.Transaction): tx is Types.Transaction_PendingTransaction =>
  tx.type === 'pending_transaction'

export interface TransactionResponse extends ConnectorTransactionResponse {
  wait(opts?: { timeoutSecs?: number; checkSuccess?: boolean }): Promise<Types.Transaction>
}
