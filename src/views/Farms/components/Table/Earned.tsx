import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, ButtonProps } from '@pancakeswap-libs/uikit'
import { useHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import { useWallet } from '@binance-chain/bsc-use-wallet'

export interface EarnedProps {
  earnings: number
  pid: number
}

const Amount = styled.span<{ earned: number }>`
  color: ${(props) => (props.earned ? props.theme.colors.text : props.theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`

const HarvestButton = styled(Button)<ButtonProps>`
  width: 84px;
  height: 32px;
`

const Container = styled.div`
  display: flex;
  min-width: 160px;
  justify-content: space-between;
`

const Earned: React.FunctionComponent<EarnedProps> = ({ earnings, pid }) => {
  const TranslateString = useI18n()
  const { onReward } = useHarvest(pid)
  const { account } = useWallet()
  const [pendingTx, setPendingTx] = useState(false)
  const displayBalance = earnings !== null ? earnings.toLocaleString() : '?'

  return (
    <Container>
      <Amount earned={earnings}>{displayBalance}</Amount>
      <HarvestButton
        disabled={earnings !== null || pendingTx || !account}
        onClick={async () => {
          setPendingTx(true)
          await onReward()
          setPendingTx(false)
        }}
      >
        {TranslateString(999, 'Harvest')}
      </HarvestButton>
    </Container>
  )
}

export default Earned
