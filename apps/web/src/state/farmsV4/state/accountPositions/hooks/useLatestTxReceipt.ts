import { useAtom } from 'jotai'
import { txReceiptAtom } from '../atom'

export const useLatestTxReceipt = () => useAtom(txReceiptAtom)
