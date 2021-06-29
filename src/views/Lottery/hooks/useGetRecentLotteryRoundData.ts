import { useContext, useEffect, useState } from 'react'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import getLotteryRoundData, { DataResponse } from 'utils/getLotteryRoundData'

type GetRecentLotteryRoundDataReturn = {
  isLoading: boolean
  data: DataResponse
  mostRecentLotteryNumber: number
  error: any
}

const useGetRecentLotteryRoundData = (): GetRecentLotteryRoundDataReturn => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const { mostRecentLotteryNumber } = useContext(PastLotteryDataContext)

  useEffect(() => {
    const fetchRecentLotteryData = async () => {
      try {
        setIsLoading(true)

        const roundData = await getLotteryRoundData(mostRecentLotteryNumber)
        setData(roundData)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (mostRecentLotteryNumber > 0) {
      fetchRecentLotteryData()
    }
  }, [mostRecentLotteryNumber, setData, setIsLoading, setError])

  return { isLoading, data, mostRecentLotteryNumber, error }
}

export default useGetRecentLotteryRoundData
