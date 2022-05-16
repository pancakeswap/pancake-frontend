import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { ActionContainer, ActionContent, ActionTitles } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { EarnedProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Earned'
import { FarmProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Farm'
import StakeButton from '../StakeButton'

const Container = styled(ActionContainer)`
  flex: 2;
  height: 100%;
`

interface StakedProps {
  earned: EarnedProps
  farm: FarmProps
}

const Staked: React.FC<StakedProps> = ({ earned, farm }) => {
  const { t } = useTranslation()
  const { earnings } = earned
  const earningsBigNumber = new BigNumber(earnings)
  const cakePrice = usePriceCakeBusd()
  let earningsBusd = 0
  let displayBalance = earnings.toLocaleString()

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earningsBusd = earningsBigNumber.multipliedBy(cakePrice).toNumber()
    displayBalance = earningsBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }

  return (
    <Container>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {`CAKE ${t('Earned')}`}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          <Heading color={earningsBigNumber.gt(0) ? 'text' : 'textDisabled'}>{displayBalance}</Heading>
          <Balance
            fontSize="12px"
            color={earningsBusd > 0 ? 'textSubtle' : 'textDisabled'}
            decimals={2}
            value={earningsBusd}
            unit=" USD"
            prefix="~"
          />
        </div>
        <StakeButton {...farm} />
      </ActionContent>
    </Container>
  )
}

export default Staked
