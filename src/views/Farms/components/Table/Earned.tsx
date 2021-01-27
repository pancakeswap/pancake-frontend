import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, ButtonProps } from '@pancakeswap-libs/uikit'
import { useHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'

const Amount = styled.span<{ earned: number }>`
  margin-right: 3rem;
  color: ${(props) => (props.earned ? props.theme.colors.text : props.theme.colors.textDisabled)};
`

const HarvestButton = styled(Button)<ButtonProps>`
  width: 5.25rem;
  height: 2rem;
`

const Earned: React.FunctionComponent<{ earnings: number; pid: number }> = ({ earnings, pid }) => {
  const TranslateString = useI18n()
  const { onReward } = useHarvest(pid)
  const [pendingTx, setPendingTx] = useState(false)
  const displayBalance = earnings !== null ? earnings.toLocaleString() : '?'

  return (
    <>
      <Amount earned={earnings}>{displayBalance}</Amount>
      <HarvestButton
        disabled={earnings !== null || pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onReward()
          setPendingTx(false)
        }}
      >
        {TranslateString(999, 'Harvest')}
      </HarvestButton>
    </>
  )
}

export default Earned
