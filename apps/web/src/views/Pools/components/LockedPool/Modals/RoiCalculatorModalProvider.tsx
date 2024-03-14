import React, { useState, createContext, Dispatch, SetStateAction } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { usePool } from 'state/pools/hooks'
import _toString from 'lodash/toString'

import { VaultRoiCalculatorModal } from '../../Vault/VaultRoiCalculatorModal'

export const RoiCalculatorModalContext = createContext<Dispatch<SetStateAction<boolean>> | null>(null)

const RoiCalculatorModalProvider: React.FC<
  React.PropsWithChildren<{ children: React.ReactNode; lockedAmount: string | number }>
> = ({ children, lockedAmount }) => {
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const { t } = useTranslation()
  // Get Vault pool
  const { pool } = usePool(0)

  const stakingTokenAddress = pool?.stakingToken?.address ? pool.stakingToken.address.toLowerCase() : null

  if (showRoiCalculator && pool) {
    return (
      <VaultRoiCalculatorModal
        pool={pool}
        linkLabel={t('Get %symbol%', { symbol: 'CAKE' })}
        linkHref={stakingTokenAddress ? `/swap?outputCurrency=${stakingTokenAddress}` : '/swap'}
        stakingTokenBalance={pool?.userData?.stakingTokenBalance}
        onBack={() => setShowRoiCalculator(false)}
        initialValue={_toString(lockedAmount)}
        initialView={1}
      />
    )
  }

  return (
    <RoiCalculatorModalContext.Provider value={setShowRoiCalculator}>{children}</RoiCalculatorModalContext.Provider>
  )
}

export default RoiCalculatorModalProvider
