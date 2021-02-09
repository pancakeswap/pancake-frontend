import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useToast } from 'state/hooks'
import multicall from 'utils/multicall'
import profileABI from 'config/abi/pancakeProfile.json'
import { getPancakeProfileAddress } from 'utils/addressHelpers'

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
        const calls = [{
          address: getPancakeProfileAddress(),
          name: 'numberCakeToReactivate',
          params: [],
        },{
          address: getPancakeProfileAddress(),
          name: 'numberCakeToRegister',
          params: [],
        },{
          address: getPancakeProfileAddress(),
          name: 'numberCakeToUpdate',
          params: [],
        }]
  
        const res = await multicall(profileABI, calls)

        setCosts({
          numberCakeToReactivate: new BigNumber(res[0].toString()),
          numberCakeToRegister: new BigNumber(res[1].toString()),
          numberCakeToUpdate: new BigNumber(res[2].toString()),
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
