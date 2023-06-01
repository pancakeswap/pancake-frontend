import { nanoid } from '@reduxjs/toolkit'
import useSWR from 'swr'
import qs from 'qs'

interface AffiliateExistFeeResponse {
  exist: boolean
}

const useDefaultLinkId = () => {
  let randomNanoId = nanoid(20)

  const { data: defaultLinkId, mutate } = useSWR(
    randomNanoId && ['/affiliate-fee-exist'],
    async () => {
      try {
        const queryString = qs.stringify({ linkId: randomNanoId })
        const response = await fetch(`/api/affiliates-program/affiliate-fee-exist?${queryString}`)
        const result: AffiliateExistFeeResponse = await response.json()

        const regex = /^[a-zA-Z0-9_]+$/
        if (result.exist || !regex.test(randomNanoId)) {
          randomNanoId = nanoid(20)
          mutate('/affiliate-fee-exist')
        }
        return randomNanoId
      } catch (error) {
        console.error(`Fetch Affiliate Exist Error: ${error}`)
        return ''
      }
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  )

  return {
    defaultLinkId,
    refresh: mutate,
  }
}

export default useDefaultLinkId
