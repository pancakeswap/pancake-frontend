import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useReferralContract } from 'hooks/useContract'
import makeBatchRequest from 'utils/makeBatchRequest'
import { ReferralData, ReferralState } from './types'
import { getBalanceNumber } from '../../utils/formatBalance'

/**
 * Gets all referral data
 */
const useGetReferralData = (): ReferralData => {
  const [state, setState] = useState<ReferralState>({
    totalReferrals: null,
    totalReferralCommissions: null,
  })

  const { account } = useWeb3React()
  const contract = useReferralContract()

  const setTotalReferrals = (numReferrals: string) =>
    setState((prevState) => ({
      ...prevState,
      totalReferrals: numReferrals,
    }))

  const setTotalCommissions = (commissionsEarned: string) => {
    setState((prevState) => ({
      ...prevState,
      totalReferralCommissions: commissionsEarned,
    }))
  }

  useEffect(() => {
    const fetchReferralData = async () => {
      const [numReferrals, commissionsEarned] = (await makeBatchRequest([
        contract.methods.referralsCount(account).call,
        contract.methods.totalReferralCommissions(account).call,
      ])) as [string, BigNumber]

      setState((prevState) => ({
        ...prevState,
        totalReferrals: numReferrals,
        totalReferralCommissions: getBalanceNumber(commissionsEarned).toString(),
      }))
    }

    if (account) {
      fetchReferralData()
    }
  }, [account, contract, setState])

  return { ...state, setTotalReferrals, setTotalCommissions }
}

export default useGetReferralData
