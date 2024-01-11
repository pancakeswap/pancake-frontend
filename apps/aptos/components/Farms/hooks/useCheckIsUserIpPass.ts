import { useQuery } from '@pancakeswap/awgmi'
import { CHECK_USER_IP_API } from 'config/index'

export const useCheckIsUserIpPass = (): boolean => {
  const { data } = useQuery(['checkIsUserIpPass'], async () => {
    try {
      const response = await fetch(CHECK_USER_IP_API)
      const responseData = await response.json()
      return responseData.result // true = pass, false = US or vpn
    } catch (error) {
      console.error('Fetch Check User IP Error: ', error)
      return true
    }
  })
  return data
}
