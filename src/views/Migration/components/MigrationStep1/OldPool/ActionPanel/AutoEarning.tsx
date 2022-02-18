import React from 'react'
import { Text, Flex, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { ActionContainer, ActionTitles, ActionContent } from 'views/Pools/components/PoolsTable/ActionPanel/styles'

const AutoEarning: React.FunctionComponent<DeserializedPool> = ({ earningTokenPrice, vaultKey }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const {
    userData: { cakeAtLastUserAction, userShares },
    pricePerFullShare,
  } = useVaultPoolByKey(vaultKey)
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  )

  const earningTokenBalance = autoCakeToDisplay
  const earningTokenDollarBalance = autoUsdToDisplay
  const hasEarnings = hasAutoEarnings

  const actionTitle = (
    <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
      {t('Recent CAKE profit')}
    </Text>
  )

  if (isMobile) {
    return (
      <Flex justifyContent="space-between">
        <Text>{t('Recent CAKE profit')} </Text>
        <Flex height="20px" alignItems="center">
          {hasEarnings ? (
            <Balance fontSize="16px" value={earningTokenBalance} decimals={5} />
          ) : (
            <Text fontSize="12px" color="textDisabled">
              0
            </Text>
          )}
        </Flex>
      </Flex>
    )
  }

  return (
    <ActionContainer>
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
    </ActionContainer>
  )
}

export default AutoEarning
