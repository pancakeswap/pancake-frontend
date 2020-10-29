/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useCallback, useState } from 'react'
import { Button } from '@pancakeswap-libs/uikit'
import useSushi from 'hooks/useSushi'
import { getFarms } from 'sushi/utils'
import { useAllEarnings } from 'hooks/useEarnings'
import { useAllReward } from 'hooks/useReward'
import useI18n from 'hooks/useI18n'

const HarvestAll: React.FC = (props) => {
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const farmPids = farms.map((farm) => farm.pid)
  const allEarnings = useAllEarnings(farmPids)
  const balancesWithValue = allEarnings.filter(
    (balanceType) => balanceType.balance.toNumber() > 0,
  )
  const pidList = balancesWithValue.map((balance) => balance.id)
  const { onReward } = useAllReward(pidList)

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    await onReward()
    setPendingTx(false)
  }, [onReward])

  return (
    <Button
      disabled={balancesWithValue.length < 0 || pendingTx}
      onClick={harvestAllFarms}
      {...props}
    >
      {pendingTx
        ? TranslateString(999, 'Collecting CAKE')
        : TranslateString(999, `Harvest all (${balancesWithValue.length})`)}
    </Button>
  )
}

export default HarvestAll
