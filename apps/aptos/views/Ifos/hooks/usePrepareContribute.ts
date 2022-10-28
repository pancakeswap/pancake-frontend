import { Pair } from '@pancakeswap/aptos-swap-sdk'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { useCallback } from 'react'
import { IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE } from '../constants'
import { ifoDeposit } from '../generated/ifo'
import { useIfoPool } from './useIfoPool'
import { useIfoResources } from './useIfoResources'

export const usePrepareContribute = () => {
  const { sendTransactionAsync } = useSendTransaction()
  const resources = useIfoResources()
  const pool = useIfoPool()

  const handleConfirm = useCallback(
    async (params: { amount: string }) => {
      if (!pool.data || !resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]) {
        return
      }
      const [raisingCoin, offeringCoin] = Pair.parseType(resources.data[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE].type)
      const payload = ifoDeposit([params.amount, pool.data.pid], [raisingCoin, offeringCoin])
      sendTransactionAsync({ payload })
    },
    [pool, resources],
  )

  return { handleConfirm }
}
