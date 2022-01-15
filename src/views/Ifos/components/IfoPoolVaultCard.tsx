import {
  Box,
  Card,
  CardBody,
  CardHeader,
  ExpandableButton,
  Flex,
  HelpIcon,
  Text,
  useMatchBreakpoints,
  useTooltip,
} from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { CompoundingPoolTag } from 'components/Tags'
import { TokenPairImage } from 'components/TokenImage'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import React, { useState } from 'react'
import { useIfoPoolCredit, useIfoPoolVault, useIfoWithApr } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import CakeVaultCard, { CreditCalcBlock } from 'views/Pools/components/CakeVaultCard'
import RecentCakeProfitCountdownRow from 'views/Pools/components/CakeVaultCard/RecentCakeProfitRow'
import UnstakingFeeCountdownRow from 'views/Pools/components/CakeVaultCard/UnstakingFeeCountdownRow'
import { IfoVaultCardAvgBalance } from 'views/Pools/components/CakeVaultCard/VaultCardActions'
import AprRow from 'views/Pools/components/PoolCard/AprRow'
import ExpandedFooter from 'views/Pools/components/PoolCard/CardFooter/ExpandedFooter'
import Staked from 'views/Pools/components/PoolsTable/ActionPanel/Stake'
import { ActionContainer } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { convertSharesToCake } from '../../Pools/helpers'

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
  const { pool } = useIfoWithApr()
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const credit = useIfoPoolCredit()
  const {
    fees: { performanceFeeAsDecimal },
    userData: { userShares, isLoading: userDataLoading },
    pricePerFullShare,
  } = useIfoPoolVault()

  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)

  const [isExpanded, setIsExpanded] = useState(false)

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
              {t('IFO Credit')}
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
            <AprRow pool={pool} stakedBalance={cakeAsBigNumber} performanceFee={performanceFeeAsDecimal} />
            <CreditCalcBlock />
            <ActionContainer>
              <IfoVaultCardAvgBalance />
            </ActionContainer>
            <Staked pool={pool} userDataLoaded={!userDataLoading} />
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
