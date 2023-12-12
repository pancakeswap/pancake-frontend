import { useQuery } from '@tanstack/react-query'
import { NOTIFICATION_HUB_BASE_URL } from 'config/constants/endpoints'
import { EXPERIMENTAL_FEATURES, getCookieKey } from 'config/experminetalFeatures'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { Address, useAccount } from 'wagmi'

const isCookieInFeatureFlags = (feature: EXPERIMENTAL_FEATURES) =>
  Cookies.get(getCookieKey(feature))?.toString() === 'true'

const isUserAddressInWhitelist = (userAddress: Address, whitelist: string[] | undefined) =>
  whitelist && whitelist.includes(`eip155:1:${userAddress}`)

export const useExperimentalFeatureEnabled = (featureFlag: EXPERIMENTAL_FEATURES) => {
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null | undefined>(null)
  const { address } = useAccount()

  const { data: subscribers } = useQuery(['subscribers'], async () => {
    const response = await fetch(`${NOTIFICATION_HUB_BASE_URL}/wallet-connect-subscribers`)
    const data: { data: string[] } = await response.json()
    return data
  })

  useEffect(() => {
    if (!address) return
    const cookie = isCookieInFeatureFlags(featureFlag)
    const userInWhitelist = isUserAddressInWhitelist(address, subscribers?.data)
    console.log(cookie)
    setFeatureEnabled(cookie || userInWhitelist)
  }, [featureFlag, address, subscribers])

  return featureEnabled
}
