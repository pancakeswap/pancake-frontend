import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { DeserializedPool } from 'state/types'
import { ActionContainer, ActionTitles, ActionContent } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { useVaultPoolByKeyV1 } from 'views/Migration/hook/V1/Pool/useFetchIfoPool'

const Container = styled(ActionContainer)`
  flex: 2;
  align-self: stretch;
`

const AutoEarning: React.FunctionComponent<DeserializedPool> = ({ earningTokenPrice, vaultKey }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const { vaultPoolData } = useVaultPoolByKeyV1(vaultKey)
  const { pricePerFullShare } = vaultPoolData
  const { cakeAtLastUserAction, userShares } = vaultPoolData.userData

  let earningTokenBalance = 0
  let earningTokenDollarBalance = 0

  if (pricePerFullShare) {
    const { autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
      account,
      cakeAtLastUserAction,
      userShares,
      pricePerFullShare,
      earningTokenPrice,
    )
    earningTokenBalance = autoCakeToDisplay
    earningTokenDollarBalance = autoUsdToDisplay
  }

  const hasEarnings = account && cakeAtLastUserAction && cakeAtLastUserAction.gt(0) && userShares && userShares.gt(0)

  const actionTitle = (
    <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
      {t('Recent CAKE profit')}
    </Text>
  )

  if (isMobile) {
    return (
      <Flex justifyContent="space-between">
        <Text>{t('Recent CAKE profit')}</Text>
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
        <Flex flex="1" pt="16px" flexDirection="column">
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

export default AutoEarning
