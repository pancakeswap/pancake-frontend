import { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { getIfoPoolContract } from 'utils/contractHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'

const ifoPoolContract = getIfoPoolContract()

export function useIfoPoolCredit() {
  const { account } = useActiveWeb3React()
  const [credit, setCredit] = useState<BigNumber | null>(null)
  const [loading, setLoading] = useState(false)
  const getIfoPoolCredit = useCallback(async () => {
    if (account) {
      setLoading(true)
      const creditAsEthersBigNumber = await ifoPoolContract.getUserCredit(account)
      setLoading(false)
      setCredit(creditAsEthersBigNumber ? new BigNumber(creditAsEthersBigNumber.toString()) : BIG_ZERO)
    }
  }, [account])

  return {
    credit,
    creditAsNumberBalance: getBalanceNumber(credit),
    loading,
    getIfoPoolCredit,
  }
}
