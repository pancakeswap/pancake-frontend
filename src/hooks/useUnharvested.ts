import { useContext } from 'react'

import { useWallet } from 'use-wallet'

import { Context as FarmsContext } from '../contexts/Farms'
import { bnToDec } from '../utils'
import { getEarned } from '../sushi/utils'

import useFarms from './useFarms'
import useYam from './useYam'

const useUnharvested = () => {
  const { unharvested } = useContext(FarmsContext)
  return unharvested
}

export default useUnharvested
