import React, { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import { Button } from '@pancakeswap-libs/uikit'

interface HarvestActionProps {
  pid: number
  earnings: number
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({ pid, earnings }) => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWallet()
  const { onReward } = useHarvest(pid)
  const TranslateString = useI18n()

  return (
    <Button
      disabled={earnings !== null || pendingTx || !account}
      onClick={async () => {
        setPendingTx(true)
        await onReward()
        setPendingTx(false)
      }}
    >
      {TranslateString(999, 'Harvest')}
    </Button>
  )
}

export default HarvestAction
