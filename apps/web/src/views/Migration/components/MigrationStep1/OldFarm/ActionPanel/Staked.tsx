import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Heading, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { getBalanceNumber, formatLpBalance } from 'utils/formatBalance'
import { ActionContainer, ActionContent, ActionTitles } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { useFarmUser, useLpTokenPrice } from 'state/farmsV1/hooks'
import { FarmProps } from '../../../Farm/Cells/Farm'
import UnstakeButton from '../UnstakeButton'

const Container = styled(ActionContainer)`
  flex: 3;
`

const Staked: React.FC<React.PropsWithChildren<FarmProps>> = ({ pid, lpSymbol }) => {
  const { t } = useTranslation()
  const lpPrice = useLpTokenPrice(lpSymbol)
  const { stakedBalance } = useFarmUser(pid)

  const displayBalance = useMemo(() => {
    return formatLpBalance(stakedBalance)
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
          <Heading color={stakedBalance.gt(0) ? 'text' : 'textDisabled'}>{displayBalance}</Heading>
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
