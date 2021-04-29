import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useCakeVaultContract } from 'hooks/useContract'

const useGetVaultUserInfo = (lastUpdated?: number) => {
  const { account } = useWeb3React()
  const cakeVaultContract = useCakeVaultContract()
  const [userInfo, setUserInfo] = useState({
    shares: null,
    cakeAtLastUserAction: null,
    lastDepositedTime: null,
    lastUserActionTime: null,
  })

  useEffect(() => {
    //   user-specific vault contract fetches
    const fetchUserVaultInfo = async () => {
      const userContractInfo = await cakeVaultContract.methods.userInfo(account).call()
      debugger // eslint-disable-line
      setUserInfo({
        shares: new BigNumber(userContractInfo.shares),
        cakeAtLastUserAction: new BigNumber(userContractInfo.cakeAtLastUserAction),
        lastDepositedTime: userContractInfo.lastDepositedTime,
        lastUserActionTime: userContractInfo.lastUserActionTime,
      })
    }

    if (account) {
      fetchUserVaultInfo()
    }
  }, [account, cakeVaultContract, lastUpdated])

  return userInfo
}

export default useGetVaultUserInfo
