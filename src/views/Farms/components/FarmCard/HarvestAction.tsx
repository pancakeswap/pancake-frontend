import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import { useWeb3React } from '@web3-react/core'
import { usePriceCakeBusd } from 'state/hooks'
import CardBusdValue from '../../../Home/components/CardBusdValue'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)
  const cakePrice = usePriceCakeBusd()

  const rawEarningsBalance = account ? getBalanceNumber(earnings) : 0
  const displayBalance = rawEarningsBalance.toLocaleString()
  const earningsBusd = rawEarningsBalance ? new BigNumber(rawEarningsBalance).multipliedBy(cakePrice).toNumber() : 0

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>
        {displayBalance}
        {earningsBusd > 0 && <CardBusdValue value={earningsBusd} />}
      </Heading>
      <Button
        disabled={rawEarningsBalance === 0 || pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onReward()
          setPendingTx(false)
        }}
      >
        {t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestAction
