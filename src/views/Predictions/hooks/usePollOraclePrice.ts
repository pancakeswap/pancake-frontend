import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { setLastOraclePrice } from 'state/predictions'
import useGetLatestOraclePrice from './useGetLatestOraclePrice'

const usePollOraclePrice = (seconds = 30) => {
  const { price, refresh } = useGetLatestOraclePrice()
  const dispatch = useAppDispatch()

  // Poll for the oracle price
  useEffect(() => {
    refresh()
    const timer = setInterval(() => {
      refresh()
    }, seconds * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [seconds, refresh])

  // If the price changed update global state
  useEffect(() => {
    dispatch(setLastOraclePrice(price.toJSON()))
  }, [price, dispatch])
}

export default usePollOraclePrice
