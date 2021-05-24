import React from 'react'
import {
  Flex,
  TooltipText,
  IconButton,
  useModal,
  CalculateIcon,
  Skeleton,
  useTooltip,
  TimerIcon,
} from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'

interface NFTmrRowProps {
  pool: Pool
  stakingTokenPrice: number
  isAutoVault?: boolean
  compoundFrequency?: number
  performanceFee?: number
}

// NFT Minting Rate Row
const MinimumDepositTime: React.FC<NFTmrRowProps> = ({
    pool,
  }) => {
  const { t } = useTranslation()
  const { stakingToken, earningToken, totalStaked, isFinished, tokenPerBlock } = pool
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Minimum time you are required to stake before receiving rewards. Unstaking your tokens may reset or increase your remaining time.'),
    { placement: 'bottom-end' },
  )

  return (
    <Flex alignItems='center' justifyContent='space-between'>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{t('Minimum Deposit Time')}:</TooltipText>
      <Flex alignItems='center'>
        N/A
        <IconButton variant='text' scale='sm'>
          <TimerIcon color='textSubtle' width='18px' />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export default MinimumDepositTime
