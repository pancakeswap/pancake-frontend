import {
  useMatchBreakpoints,
  Card,
  CardHeader,
  Text,
  Flex,
  Box,
  ExpandableButton,
  CardBody,
  HelpIcon,
  useTooltip,
  LinkExternal,
  Link,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { TokenPairImage } from 'components/TokenImage'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useState } from 'react'
import { useIfoPoolVault, useIfoPoolCredit, useIfoWithApr, useIfoPooStartBlock } from 'state/pools/hooks'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
import ExpandedFooter from 'views/Pools/components/PoolCard/CardFooter/ExpandedFooter'
import { IfoVaultCardAvgBalance } from 'views/Pools/components/CakeVaultCard/VaultCardActions'
import AprRow from 'views/Pools/components/PoolCard/AprRow'
import Staked from 'views/Pools/components/PoolsTable/ActionPanel/Stake'
import { CompoundingPoolTag } from 'components/Tags'
import { ActionContainer } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { VaultKey } from 'state/types'
import UnstakingFeeCountdownRow from 'views/Pools/components/CakeVaultCard/UnstakingFeeCountdownRow'
import RecentCakeProfitCountdownRow from 'views/Pools/components/CakeVaultCard/RecentCakeProfitRow'
import { getBscScanLink } from 'utils'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { BIG_ZERO } from 'utils/bigNumber'

const StyledCardMobile = styled(Card)`
  max-width: 400px;
  width: 100%;
`

const StyledTokenContent = styled(Flex)`
  ${Text} {
    line-height: 1.2;
    white-space: nowrap;
  }
`

const StyledCardFooter = styled(Box)`
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.dropdown};
`

const StyledCardBody = styled(CardBody)`
  display: grid;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  gap: 16px;
  ${ActionContainer} {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.invertedContrast};
  }
`

const IfoPoolVaultCardMobile: React.FC = () => {
  const { pool, userDataLoaded } = useIfoWithApr()
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const credit = useIfoPoolCredit()
  const {
    fees: { performanceFeeAsDecimal },
  } = useIfoPoolVault()
  const [isExpanded, setIsExpanded] = useState(false)
  const creditStartBlock = useIfoPooStartBlock()
  const {
    tooltip: startBlockTooltip,
    tooltipVisible: startBlockTooltipVisible,
    targetRef: startBlockTargetRef,
  } = useTooltip(
    <>
      <Text>
        {t(
          'The start block of the current calculation period. Your average IFO CAKE Pool staking balance is calculated throughout this period.',
        )}
      </Text>
      <LinkExternal href="https://medium.com/pancakeswap/initial-farm-offering-ifo-3-0-ifo-staking-pool-622d8bd356f1">
        {t('Check out our Medium article for more details.')}
      </LinkExternal>
    </>,
    { placement: 'auto' },
  )

  const cakeAsNumberBalance = getBalanceNumber(credit)
  const stakedDollarValue = useBUSDCakeAmount(cakeAsNumberBalance)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.'),
    {
      placement: 'bottom',
    },
  )
  return (
    <StyledCardMobile isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <StyledTokenContent alignItems="center" flex={1}>
            <TokenPairImage width={24} height={24} primaryToken={tokens.cake} secondaryToken={tokens.cake} />
            <Box ml="8px">
              <Text fontSize="12px" bold color="secondary" textTransform="uppercase">
                {t('Staked')}
              </Text>
              <Text small bold>
                IFO CAKE
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {t('Stake')} CAKE
              </Text>
            </Box>
          </StyledTokenContent>
          <StyledTokenContent flexDirection="column" flex={1}>
            <Text color="textSubtle" fontSize="12px">
              {t('Avg Balance')}
            </Text>
            <Balance small bold decimals={3} value={cakeAsNumberBalance} />
            <Balance
              value={stakedDollarValue || 0}
              fontSize="12px"
              color="textSubtle"
              decimals={2}
              prefix="~"
              unit=" USD"
            />
          </StyledTokenContent>
          <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
        </Flex>
      </CardHeader>
      {isExpanded && (
        <>
          <StyledCardBody>
            <AprRow
              pool={pool}
              stakedBalance={pool.userData?.stakedBalance ? new BigNumber(pool.userData.stakedBalance) : BIG_ZERO}
              performanceFee={performanceFeeAsDecimal}
            />
            {pool.vaultKey === VaultKey.IfoPool && (
              <Flex mt="8px" justifyContent="space-between">
                <Text fontSize="14px">{t('Credit calculation starts:')}</Text>
                <Flex mr="6px" alignItems="center">
                  <Link external href={getBscScanLink(creditStartBlock, 'block')} mr="4px" fontSize="14px">
                    {creditStartBlock}
                  </Link>
                  <span ref={startBlockTargetRef}>
                    <HelpIcon color="textSubtle" />
                  </span>
                </Flex>
                {startBlockTooltipVisible && startBlockTooltip}
              </Flex>
            )}
            <ActionContainer>
              <IfoVaultCardAvgBalance />
            </ActionContainer>
            <Staked pool={pool} userDataLoaded={userDataLoaded} />
            <ActionContainer>
              <Box>
                <RecentCakeProfitCountdownRow vaultKey={VaultKey.IfoPool} />
              </Box>
              <Box mt="8px">
                <UnstakingFeeCountdownRow vaultKey={VaultKey.IfoPool} />
              </Box>
            </ActionContainer>
          </StyledCardBody>
          <StyledCardFooter>
            <ExpandedFooter account={account} pool={pool} />
            <Flex alignItems="center">
              <CompoundingPoolTag />
              {tooltipVisible && tooltip}
              <Flex ref={targetRef}>
                <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
              </Flex>
            </Flex>
          </StyledCardFooter>
        </>
      )}
    </StyledCardMobile>
  )
}

const IfoPoolVaultCard = () => {
  const { pool } = useIfoWithApr()
  const { isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanTablet = isMd || isXs || isSm
  if (isSmallerThanTablet) {
    return <IfoPoolVaultCardMobile />
  }

  return <CakeVaultCard pool={pool} showStakedOnly={false} m="auto" />
}

export default IfoPoolVaultCard
