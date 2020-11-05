import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Farm } from 'contexts/Farms'
import { getEarned, getMasterChefContract, getFarms } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

export interface FarmWithBalance extends Farm {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>(
    [],
  )
  const { account } = useWallet()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  useEffect(() => {
    const fetchBalances = async () => {
      const newList: Promise<FarmWithBalance>[] = farms.map(async (farm) => {
        const balance = await getEarned(masterChefContract, farm.pid, account)

        return {
          ...farm,
          balance: new BigNumber(balance),
        }
      })

      const results = await Promise.all(newList)
      setFarmsWithBalances(results)
    }

    if (account && masterChefContract && sushi) {
      fetchBalances()
    }
  }, [block, account, masterChefContract, sushi, farms, setFarmsWithBalances])

  return farmsWithBalances
}

export default useFarmsWithBalance
