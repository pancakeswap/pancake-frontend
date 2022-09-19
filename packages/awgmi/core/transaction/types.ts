/* eslint-disable camelcase */
import { Types } from 'aptos'

export const isUserTransaction = (tx: Types.Transaction): tx is Types.Transaction_UserTransaction =>
  tx.type === 'user_transaction'

export const isPendingTransaction = (tx: Types.Transaction): tx is Types.Transaction_PendingTransaction =>
  tx.type === 'pending_transaction'

export interface TransactionResponse extends Types.PendingTransaction {
  wait(opts?: { timeoutSecs?: number; checkSuccess?: boolean }): Promise<Types.Transaction>
}
