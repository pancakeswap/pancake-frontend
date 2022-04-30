import React, { useCallback } from 'react'
import styled from 'styled-components'
import { BigNumber } from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { ActionContainer, ActionContent, ActionTitles } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { useFarmUser, useLpTokenPrice } from 'state/farmsV1/hooks'
import { FarmProps } from '../Cells/Farm'
import UnstakeButton from '../UnstakeButton'

const Container = styled(ActionContainer)`
  flex: 3;
`

const Staked: React.FC<FarmProps> = ({ pid, lpSymbol }) => {
  const { t } = useTranslation()
  const lpPrice = useLpTokenPrice(lpSymbol)
  const { stakedBalance } = useFarmUser(pid)

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
    }
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  return (
    <Container>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {`${lpSymbol} ${t('Staked')}`}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          <Heading color={stakedBalance.gt(0) ? 'text' : 'textDisabled'}>{displayBalance()}</Heading>
          <Balance
            fontSize="12px"
            color={stakedBalance.gt(0) && lpPrice.gt(0) ? 'textSubtle' : 'textDisabled'}
            decimals={2}
            value={getBalanceNumber(lpPrice.times(stakedBalance))}
            unit=" USD"
            prefix="~"
          />
        </div>
        <UnstakeButton pid={pid} />
      </ActionContent>
    </Container>
  )
}

export default Staked
