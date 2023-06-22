import { useTranslation } from '@pancakeswap/localization'
import { MOONPAY_BASE_URL } from 'config/constants/endpoints'
import { useEffect, useState } from 'react'

/** @ref https://dashboard.moonpay.com/api_reference/client_side_api#ip_addresses */
interface MoonpayIPAddressesResponse {
  alpha3?: string
  isAllowed?: boolean
  isBuyAllowed?: boolean
  isSellAllowed?: boolean
}
const MOONPAY_PUBLISHABLE_KEY = 'pk_live_Ch5fat39X8NvMZwih2k7hK4sDrKanSPz'

async function getMoonpayAvailability(): Promise<boolean> {
  const moonpayPublishableKey = MOONPAY_PUBLISHABLE_KEY
  if (!moonpayPublishableKey) {
    throw new Error('Must provide a publishable key for moonpay.')
  }
  const moonpayApiURI = MOONPAY_BASE_URL
  if (!moonpayApiURI) {
    throw new Error('Must provide an api endpoint for moonpay.')
  }
  const res = await fetch(`${moonpayApiURI}/v4/ip_address?apiKey=${moonpayPublishableKey}`)
  const data = await (res.json() as Promise<MoonpayIPAddressesResponse>)
  return data.isBuyAllowed ?? false
}

export function useFiatOnrampAvailability(shouldCheck: boolean, callback?: () => void) {
  const [fiatOnarampAvailability, setFiatOnrampAvailability] = useState<boolean>(false)
  const [availabilityChecked, setAvailabilityChecked] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    async function checkAvailability() {
      setError(null)
      setLoading(true)
      try {
        const result = await getMoonpayAvailability()
        if (stale) return
        setFiatOnrampAvailability(result)
        if (result && callback) {
          callback()
        }
      } catch (e) {
        console.error('Error checking onramp availability', e.toString())
        if (stale) return
        setError(t('Error, try again later.'))
        setFiatOnrampAvailability(false)
      } finally {
        if (!stale) setLoading(false)
      }
    }

    if (shouldCheck) {
      checkAvailability()
      setAvailabilityChecked(true)
    }

    let stale = false
    return () => {
      stale = true
    }
  }, [callback, shouldCheck, availabilityChecked, t])

  return { fiatOnarampAvailability, availabilityChecked, loading, error }
}
