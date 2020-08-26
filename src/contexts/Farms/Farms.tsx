import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import useYam from '../../hooks/useYam'

import { bnToDec } from '../../utils'
import { getMasterChefContract, getEarned } from '../../sushi/utils'
import { getFarms } from '../../sushi/utils'

import Context from './context'
import { Farm } from './types'

const Farms: React.FC = ({ children }) => {
  const [unharvested, setUnharvested] = useState(0)

  const yam = useYam()
  const { account } = useWallet()

  const farms = getFarms(yam)

  return (
    <Context.Provider
      value={{
        farms,
        unharvested,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Farms
