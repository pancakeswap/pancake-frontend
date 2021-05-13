import { useEffect, useState } from 'react'
import { useCakeVaultContract } from 'hooks/useContract'
import makeBatchRequest from 'utils/makeBatchRequest'

export interface VaultFees {
  performanceFee: string
  callFee: string
  withdrawalFee: string
  withdrawalFeePeriod: string
}

const useGetVaultFees = () => {
  const cakeVaultContract = useCakeVaultContract()
  const [fees, setFees] = useState({
    performanceFee: null,
    callFee: null,
    withdrawalFee: null,
    withdrawalFeePeriod: null,
  })

  useEffect(() => {
    const getFees = async () => {
      const [contractPerformanceFee, contractWithdrawalFeeTimePeriod, contractCallFee, contractWithdrawalFee] =
        await makeBatchRequest([
          cakeVaultContract.methods.performanceFee().call,
          cakeVaultContract.methods.withdrawFeePeriod().call,
          cakeVaultContract.methods.callFee().call,
          cakeVaultContract.methods.withdrawFee().call,
        ])

      setFees({
        performanceFee: contractPerformanceFee as string,
        callFee: contractCallFee as string,
        withdrawalFee: contractWithdrawalFee as string,
        withdrawalFeePeriod: contractWithdrawalFeeTimePeriod as string,
      })
    }

    getFees()
  }, [cakeVaultContract])

  return fees
}

export default useGetVaultFees
