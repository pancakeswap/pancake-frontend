import React from 'react'
import { Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolApr } from 'utils/apr'
import { getAddress } from 'utils/addressHelpers'
import { tokenEarnedPerThousandDollarsCompounding, getRoi } from 'utils/compoundApyHelpers'
import Balance from 'components/Balance'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import { Pool } from 'state/types'
import { BASE_EXCHANGE_URL } from 'config'

interface MinimumStakeProps {
  amount: number
  isFinished: boolean
}

const MinimumStake: React.FC<MinimumStakeProps> = ({
  amount,
  isFinished
}) => {

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <TooltipText >Minimum Stake:</TooltipText>
      {isFinished || !amount ? (
        <Skeleton width="82px" height="32px" />
      ) : (
        <Flex alignItems="center">
          {amount}
          <IconButton  variant="text" scale="sm">
            <CalculateIcon color="textSubtle" width="18px" />
          </IconButton>
        </Flex>
      )}
    </Flex>
  )
}

export default MinimumStake
