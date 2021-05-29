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

interface MinimumStakingTimeProps {
  period: string
}

// Minimum Staking Time
const MinimumStakingTime: React.FC<MinimumStakingTimeProps> = ({
    period,
  }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    'Funds staked in this grave are locked for a specified amount of time. Withdrawing your funds early results in a 5% fee.',
    { placement: 'bottom-end' },
  )

  return (
    <Flex alignItems='center' justifyContent='space-between'>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>Minimum Staking Time:</TooltipText>
      <Flex alignItems='center'>
        {period}
        <IconButton variant='text' scale='sm'>
          <TimerIcon color='textSubtle' width='18px' />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export default MinimumStakingTime
