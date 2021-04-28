import { useEffect, useState } from 'react'
import { useCakeVaultContract } from 'hooks/useContract'

export enum FeeFunctions {
  performanceFee = 'performanceFee',
  callFee = 'callFee',
  withdrawalFee = 'withdrawalFee',
  withdrawalFeePeriod = 'withdrawalFeePeriod',
}

export interface VaultFees {
  performanceFee: string
  callFee: string
  withdrawalFee: string
  withdrawalFeePeriod: string
}

const useGetVaultFees = (functionsArray: FeeFunctions[]) => {
  const cakeVaultContract = useCakeVaultContract()
  const [fees, setFees] = useState({
    performanceFee: null,
    callFee: null,
    withdrawalFee: null,
    withdrawalFeePeriod: null,
  })

  useEffect(() => {
    const getPerformanceFee = async () => {
      const contractPerformanceFee = await cakeVaultContract.methods.performanceFee().call()
      setFees((prevState) => {
        return { ...prevState, performanceFee: contractPerformanceFee }
      })
    }

    const getCallFee = async () => {
      const contractCallFee = await cakeVaultContract.methods.callFee().call()
      setFees((prevState) => {
        return { ...prevState, callFee: contractCallFee }
      })
    }

    const getWithdrawalFee = async () => {
      const contractWithdrawalFee = await cakeVaultContract.methods.withdrawFee().call()
      setFees((prevState) => {
        return { ...prevState, withdrawalFee: contractWithdrawalFee }
      })
    }

    const getWithdrawalFeePeriod = async () => {
      const contractWithdrawalFeeTimePeriod = await cakeVaultContract.methods.withdrawFeePeriod().call()
      setFees((prevState) => {
        return { ...prevState, withdrawalFeePeriod: contractWithdrawalFeeTimePeriod }
      })
    }

    const feeFunctions = {
      performanceFee: getPerformanceFee,
      callFee: getCallFee,
      withdrawalFee: getWithdrawalFee,
      withdrawalFeePeriod: getWithdrawalFeePeriod,
    }

    functionsArray.forEach((functionName) => {
      feeFunctions[functionName]()
    })

    // Adding functionsArray as a dependency created an infinite rerender - struggling to figure out why
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cakeVaultContract])

  return fees
}

export default useGetVaultFees
