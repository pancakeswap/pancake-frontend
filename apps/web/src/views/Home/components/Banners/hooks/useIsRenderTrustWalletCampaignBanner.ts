import { useMemo } from 'react'

const startTimeStamp = 1676462400000
const endTimeStamp = 1677585600000

const useIsRenderTrustWalletCampaignBanner = () => {
  return useMemo(() => {
    const now = Date.now()
    return now > startTimeStamp && now < endTimeStamp
  }, [])
}

export default useIsRenderTrustWalletCampaignBanner
