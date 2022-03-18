import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import fetchIfoPoolUser from 'state/pools/fetchIfoPoolUser'
import { fetchPublicIfoPoolData, fetchIfoPoolFeesData } from 'state/pools/fetchIfoPoolPublic'
import { initialPoolVaultState } from 'state/pools/index'
import useSWR from 'swr'
import { fetchPublicVaultData, fetchVaultFees } from 'state/pools/fetchVaultPublic'
import fetchVaultUser from 'state/pools/fetchVaultUser'
import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { simpleRpcProvider } from 'utils/providers'
import cakeVaultAbi from 'config/abi/cakeVault.json'
import { FAST_INTERVAL } from 'config/constants'
import { VaultKey } from 'state/types'

const ifoPoolV1Contract = '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8'
const cakeVaultAddress = '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC'

const getCakeVaultContract = (signer?: Signer | Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new Contract(cakeVaultAddress, cakeVaultAbi, signerOrProvider) as any
}

const getIfoPoolData = async (account) => {
  const [ifoData, userData, feesData] = await Promise.all([
    fetchPublicIfoPoolData(),
    fetchIfoPoolUser(account, ifoPoolV1Contract),
    fetchIfoPoolFeesData(ifoPoolV1Contract),
  ])
  const ifoPoolData = {
    ...ifoData,
    fees: { ...feesData },
    userData: { ...userData, isLoading: false },
  }
  return transformData(ifoPoolData)
}

const getCakePoolData = async (account) => {
  const [vaultData, userData, feesData] = await Promise.all([
    fetchPublicVaultData(cakeVaultAddress),
    fetchVaultUser(account, getCakeVaultContract()),
    fetchVaultFees(cakeVaultAddress),
  ])
  const cakeData = {
    ...vaultData,
    fees: { ...feesData },
    userData: { ...userData, isLoading: false },
  }
  return transformData(cakeData)
}

const transformData = ({
  totalShares,
  pricePerFullShare,
  totalCakeInVault,
  fees: { performanceFee, withdrawalFee, withdrawalFeePeriod },
  userData: { isLoading, userShares, cakeAtLastUserAction, lastDepositedTime, lastUserActionTime },
}) => {
  return {
    totalShares: new BigNumber(totalShares),
    pricePerFullShare: new BigNumber(pricePerFullShare),
    totalCakeInVault: new BigNumber(totalCakeInVault),
    fees: {
      performanceFeeAsDecimal: performanceFee && performanceFee / 100,
      performanceFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares: new BigNumber(userShares),
      cakeAtLastUserAction: new BigNumber(cakeAtLastUserAction),
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}

export const useVaultPoolByKeyV1 = (key: VaultKey) => {
  const { account } = useWeb3React()
  const { data, mutate } = useSWR(
    account ? [key, 'v1'] : null,
    async () => {
      if (key === VaultKey.IfoPool) {
        return getIfoPoolData(account)
      }
      return getCakePoolData(account)
    },
    {
      revalidateOnFocus: false,
      refreshInterval: FAST_INTERVAL,
      dedupingInterval: FAST_INTERVAL,
    },
  )

  return {
    vaultPoolData: data || initialPoolVaultState,
    fetchPoolData: mutate,
  }
}
