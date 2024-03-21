import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo } from 'react'

interface UseTotalGradientBoxProps {
  isClickedMoreButton: boolean
  dataLength: number
}

export const MIN_DISPLAY = 4

export const useTotalGradientBox = ({ isClickedMoreButton, dataLength }: UseTotalGradientBoxProps) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()

  return useMemo(() => {
    let displayNumber = 4
    if (isXxl) displayNumber = 4
    if (isXl || isLg) displayNumber = 3
    if (isMd) displayNumber = 2
    if (isXs || isSm) displayNumber = 1

    if (isClickedMoreButton || dataLength < MIN_DISPLAY) {
      return []
    }

    const amount = Math.abs(dataLength - displayNumber)
    const total = isXxl ? amount : amount > 0 ? displayNumber - amount : 0

    return total ? Array.from({ length: total }, (_, index) => index) : []
  }, [isXxl, isXl, isMd, isLg, isXs, isSm, isClickedMoreButton, dataLength])
}
