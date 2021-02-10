import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getProfileContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'
import { useToast } from 'state/hooks'

const useGetProfileCosts = () => {
  const [costs, setCosts] = useState({
    numberCakeToReactivate: new BigNumber(0),
    numberCakeToRegister: new BigNumber(0),
    numberCakeToUpdate: new BigNumber(0),
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const profileContract = getProfileContract()
        const [numberCakeToReactivate, numberCakeToRegister, numberCakeToUpdate] = await makeBatchRequest([
          profileContract.methods.numberCakeToReactivate().call,
          profileContract.methods.numberCakeToRegister().call,
          profileContract.methods.numberCakeToUpdate().call,
        ])

        setCosts({
          numberCakeToReactivate: new BigNumber(numberCakeToReactivate as string),
          numberCakeToRegister: new BigNumber(numberCakeToRegister as string),
          numberCakeToUpdate: new BigNumber(numberCakeToUpdate as string),
        })
      } catch (error) {
        toastError('Error', 'Could not retrieve CAKE costs for profile')
      }
    }

    fetchCosts()
  }, [setCosts, toastError])

  return costs
}

export default useGetProfileCosts
