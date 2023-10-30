import { useState, useCallback } from 'react'

export interface PositionManagerDetailsData {
  apr: number
  earned: number
  totalStaked: number
  isUserStaked: boolean
}

export const usePositionManagerDetailsData = () => {
  const [data, setData] = useState<Record<number, PositionManagerDetailsData>>({})
  const updateData = useCallback((id: number, newData: PositionManagerDetailsData) => {
    setData((prevData) => {
      return {
        ...prevData,
        [id]: newData,
      }
    })
  }, [])
  return {
    data,
    updateData,
  }
}
