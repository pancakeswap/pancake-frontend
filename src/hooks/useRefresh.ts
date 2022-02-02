import { useContext } from 'react'
import { FastRefresh, SlowRefresh } from 'contexts/RefreshContext'

export const useFastFresh = () => {
  return useContext(FastRefresh.Context)
}
export const useSlowFresh = () => {
  return useContext(SlowRefresh.Context)
}
