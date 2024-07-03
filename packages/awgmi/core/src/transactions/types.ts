/* eslint-disable camelcase */
import {
  isUserTransactionResponse,
  isPendingTransactionResponse,
  Aptos,
  WaitForTransactionOptions,
} from '@aptos-labs/ts-sdk'
import { ConnectorTransactionResponse } from '../connectors/index'

export const isUserTransaction = isUserTransactionResponse

export const isPendingTransaction = isPendingTransactionResponse

export interface TransactionResponse extends ConnectorTransactionResponse {
  wait(opts?: WaitForTransactionOptions): ReturnType<Aptos['transaction']['waitForTransaction']>
}
