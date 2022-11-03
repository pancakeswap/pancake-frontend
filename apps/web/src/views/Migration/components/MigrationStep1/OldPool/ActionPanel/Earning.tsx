import React from 'react'
import { Text, Flex, Heading, useMatchBreakpoints, Balance, Pool } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { ActionContainer, ActionTitles, ActionContent } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { Token } from '@pancakeswap/sdk'

const Container = styled(ActionContainer)`
  flex: 2;
`

const Earning: React.FunctionComponent<React.PropsWithChildren<Pool.DeserializedPool<Token>>> = ({
  earningToken,
  userData,
  earningTokenPrice,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const hasEarnings = earnings.gt(0)

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {earningToken.symbol} {t('Earned')}
      </Text>
    </>
  )

  if (isMobile) {
    return (
      <Flex justifyContent="space-between">
        <Text>
          {earningToken.symbol} {t('Earned')}{' '}
        </Text>
        <Flex height="20px" alignItems="center">
          {hasEarnings ? (
            <Balance fontSize="16px" value={earningTokenBalance} decimals={5} />
          ) : (
            <Text fontSize="16px">0</Text>
          )}
        </Flex>
      </Flex>
    )
  }

  return (
    <Container>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <>
            {hasEarnings ? (
              <>
                <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={earningTokenBalance} />
                {earningTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        </Flex>
      </ActionContent>
    </Container>
  )
}

export default Earning
