import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/chains'
import { useToast } from '@pancakeswap/uikit'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useState } from 'react'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'

const useGetProfileCosts = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [costs, setCosts] = useState({
    numberCakeToReactivate: 0n,
    numberCakeToRegister: 0n,
    numberCakeToUpdate: 0n,
  })
  const { toastError } = useToast()
  const { chainId } = useActiveChainId()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const pancakeProfileAddress = getPancakeProfileAddress()

        const [numberCakeToReactivate, numberCakeToRegister, numberCakeToUpdate] = await publicClient({
          chainId: ChainId.BSC,
        }).multicall({
          allowFailure: false,
          contracts: [
            {
              address: pancakeProfileAddress,
              abi: pancakeProfileABI,
              functionName: 'numberCakeToReactivate',
            },
            {
              address: pancakeProfileAddress,
              abi: pancakeProfileABI,
              functionName: 'numberCakeToRegister',
            },
            {
              address: pancakeProfileAddress,
              abi: pancakeProfileABI,
              functionName: 'numberCakeToUpdate',
            },
          ],
        })

        setCosts({
          numberCakeToReactivate,
          numberCakeToRegister,
          numberCakeToUpdate,
        })
        setIsLoading(false)
      } catch (error) {
        toastError(t('Error'), t('Could not retrieve CAKE costs for profile'))
      }
    }

    fetchCosts()
  }, [setCosts, toastError, t, chainId])

  return { costs, isLoading }
}

export default useGetProfileCosts
