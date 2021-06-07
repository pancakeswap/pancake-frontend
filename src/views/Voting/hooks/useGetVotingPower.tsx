import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getUserStakeInCakeBnbLp, getUserStakeInCakePool } from 'utils/callHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

const useGetVotingPower = (block?: number) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [votingPower, setVotingPower] = useState(BIG_ZERO)
  const { account } = useWeb3React()

  useEffect(() => {
    const fetchVotingPower = async () => {
      const [userSTakeInCakeBnbLp, userStakeInCakePool] = await Promise.all([
        getUserStakeInCakeBnbLp(account, block),
        getUserStakeInCakePool(account, block),
      ])
      setVotingPower(userStakeInCakePool.plus(userSTakeInCakeBnbLp))
      setIsInitialized(true)
    }

    if (account) {
      fetchVotingPower()
    }
  }, [account, block, setIsInitialized, setVotingPower])

  return { isInitialized, votingPower }
}

export default useGetVotingPower
