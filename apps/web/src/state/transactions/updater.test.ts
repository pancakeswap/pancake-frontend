import { shouldCheck } from './updater'
import { TransactionDetails } from './reducer'

describe('transactions updater', () => {
  const trxDetailInFetchedTransactions: TransactionDetails = {
    hash: 'Ox34567' as `0x${string}`,
    addedTime: 5,
    from: '0x787213',
  }
  const trxDetailNotInFetchedTransactions: TransactionDetails = {
    hash: 'Ox78903' as `0x${string}`,
    addedTime: 6,
    from: '0x787213',
  }
  const trxDetailWithReceipt: TransactionDetails = {
    hash: 'Ox78903' as `0x${string}`,
    addedTime: 6,
    from: '0x787213',
    receipt: {
      blockHash: '0x787292',
      blockNumber: 12738921,
      contractAddress: '0x787219',
      from: '0x787213',
      status: 1,
      to: '0x787212',
      transactionHash: '0x12378123',
      transactionIndex: 5,
    },
  }
  const fetchedTransactions: { [txHash: string]: TransactionDetails } = {
    [trxDetailInFetchedTransactions.hash]: trxDetailInFetchedTransactions,
  }
  describe('shouldCheck', () => {
    it('returns false if trx detail in fetchedTransaction', () => {
      expect(shouldCheck(fetchedTransactions, trxDetailInFetchedTransactions)).toEqual(false)
    })
    it('returns true if trx detail not in fetchedTransaction', () => {
      expect(shouldCheck(fetchedTransactions, trxDetailNotInFetchedTransactions)).toEqual(true)
    })
    it('returns false if trx has receipt', () => {
      expect(shouldCheck(fetchedTransactions, trxDetailWithReceipt)).toEqual(false)
    })
  })
})
