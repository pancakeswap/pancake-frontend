import { shouldCheck } from './updater'
import { TransactionDetails } from './reducer'

describe('transactions updater', () => {
  const trxDetail1: TransactionDetails = { hash: 'Ox34567', addedTime: 5, from: '0x787213' }
  const trxDetail2: TransactionDetails = { hash: 'Ox78903', addedTime: 6, from: '0x787213' }
  const trxDetail3: TransactionDetails = {
    hash: 'Ox78903',
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
  const fetchedTransactions: { [chainId: number]: { [txHash: string]: TransactionDetails } } = {
    56: { [trxDetail1.hash]: trxDetail1 },
  }
  describe('shouldCheck', () => {
    it('returns false if trx detail in fetchedTransaction', () => {
      expect(shouldCheck(fetchedTransactions, 56, trxDetail1)).toEqual(false)
    })
    it('returns true if trx detail not in fetchedTransaction', () => {
      expect(shouldCheck(fetchedTransactions, 56, trxDetail2)).toEqual(true)
    })
    it('returns false if trx has receipt', () => {
      expect(shouldCheck(fetchedTransactions, 56, trxDetail3)).toEqual(false)
    })
  })
})
