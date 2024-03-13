import { nanoid } from '@reduxjs/toolkit'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import qs from 'qs'

interface AffiliateExistFeeResponse {
  exist: boolean
}

const useDefaultLinkId = () => {
  let randomNanoId = nanoid(20)

  const queryClient = useQueryClient()

  const { data: defaultLinkId, refetch } = useQuery({
    queryKey: ['affiliates-program', 'affiliate-fee-exist'],

    queryFn: async () => {
      try {
        const queryString = qs.stringify({ linkId: randomNanoId })
        const response = await fetch(`/api/affiliates-program/affiliate-fee-exist?${queryString}`)
        const result: AffiliateExistFeeResponse = await response.json()

        const regex = /^[a-zA-Z0-9_]+$/
        if (result.exist || !regex.test(randomNanoId)) {
          randomNanoId = nanoid(20)
          queryClient.invalidateQueries({
            queryKey: ['affiliates-program', 'affiliate-fee-exist'],
          })
        }
        return randomNanoId
      } catch (error) {
        console.error(`Fetch Affiliate Exist Error: ${error}`)
        return ''
      }
    },

    enabled: !!randomNanoId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return {
    defaultLinkId: defaultLinkId || '',
    refresh: refetch,
  }
}

export default useDefaultLinkId
