import useSWR from 'swr'
import { useAccount } from 'wagmi'
import { getCookie, deleteCookie } from 'cookies-next'
import { AFFILIATE_SID } from 'pages/api/affiliates-program/affiliate-login'

export interface FeeType {
  affiliateAddress: string
  createdAt: string
  id: number
  linkId: string
  perpsFee: number
  signature: string
  stableSwapFee: number
  updatedAt: string
  v2SwapFee: number
  v3SwapFee: number
}

export interface InfoDetail {
  active: boolean
  address: string
  createdAt: string
  email: string
  name: string
  updatedAt: string
  _count: {
    user: number
  }
  fee: FeeType[]
  nickName: string
  ablePerps: boolean
}

interface AffiliateInfoType {
  isAffiliate: boolean
  affiliate: InfoDetail
  refresh: () => void
}

interface AffiliateInfoResponse {
  status: 'success' | 'error'
  affiliate: InfoDetail
}

const initAffiliateData: InfoDetail = {
  active: false,
  address: '',
  createdAt: '',
  email: '',
  name: '',
  updatedAt: '',
  _count: {
    user: 0,
  },
  fee: [],
  nickName: '',
  ablePerps: false,
}

const useAuthAffiliate = (): AffiliateInfoType => {
  const { address } = useAccount()
  const cookie = getCookie(AFFILIATE_SID)

  const { data, mutate } = useSWR(address && cookie !== '' && ['/auth-affiliate', address, cookie], async () => {
    try {
      const response = await fetch(`/api/affiliates-program/affiliate-info`)
      const result: AffiliateInfoResponse = await response.json()
      if (result.status === 'error') {
        deleteCookie(AFFILIATE_SID, { sameSite: true })
      }

      return {
        isAffiliate: result.status === 'success',
        affiliate: result.affiliate,
      }
    } catch (error) {
      console.error(`Fetch Affiliate Exist Error: ${error}`)
      return {
        isAffiliate: false,
        affiliate: initAffiliateData,
      }
    }
  })

  return {
    isAffiliate: (data?.isAffiliate && !!address) ?? false,
    affiliate: data?.affiliate ?? initAffiliateData,
    refresh: mutate,
  }
}

export default useAuthAffiliate
