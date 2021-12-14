import React from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, Text, CardProps, HelpIcon, useTooltip, LinkExternal, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useIfoPooStartBlock, useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey } from 'state/types'
import { convertSharesToCake } from 'views/Pools/helpers'
import { FlexGap } from 'components/Layout/Flex'
import { vaultPoolConfig } from 'config/constants/pools'
import { getBscScanLink } from 'utils'
import AprRow from '../PoolCard/AprRow'
import { StyledCard } from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from '../PoolCard/PoolCardHeader'
import VaultCardActions from './VaultCardActions'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentCakeProfitRow from './RecentCakeProfitRow'
import CakeVaultTokenPairImage from './CakeVaultTokenPairImage'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface CakeVaultProps extends CardProps {
  pool: DeserializedPool
  showStakedOnly: boolean
  defaultFooterExpanded?: boolean
}

const CakeVaultCard: React.FC<CakeVaultProps> = ({ pool, showStakedOnly, defaultFooterExpanded, ...props }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFeeAsDecimal },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const creditStartBlock = useIfoPooStartBlock()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <>
      <Text>
        {t(
          'The start block of the current calculation period. Your average IFO CAKE Pool staking balance is calculated throughout this period.',
        )}
      </Text>
      <LinkExternal href="https://medium.com/pancakeswap/initial-farm-offering-ifo-3-0-ifo-staking-pool-622d8bd356f1">
        {t('Check out our Medium article for more detail.')}
      </LinkExternal>
    </>,
    { placement: 'auto' },
  )

  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <StyledCard isActive {...props}>
      <PoolCardHeader isStaking={accountHasSharesStaked}>
        <PoolCardHeaderTitle
          title={t(vaultPoolConfig[pool.vaultKey].name)}
          subTitle={t(vaultPoolConfig[pool.vaultKey].description)}
        />
        <CakeVaultTokenPairImage width={64} height={64} />
      </PoolCardHeader>
      <StyledCardBody isLoading={isLoading}>
        <AprRow pool={pool} stakedBalance={cakeAsBigNumber} performanceFee={performanceFeeAsDecimal} />
        {pool.vaultKey === VaultKey.IfoPool && (
          <Flex mt="8px" justifyContent="space-between">
            <Text fontSize="14px">{t('Credit calculation starts:')}</Text>
            <Flex mr="6px" alignItems="center">
              <Link external href={getBscScanLink(creditStartBlock, 'block')} mr="4px" fontSize="14px">
                {creditStartBlock}
              </Link>
              <span ref={targetRef}>
                <HelpIcon color="textSubtle" />
              </span>
            </Flex>
            {tooltipVisible && tooltip}
          </Flex>
        )}
        <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
          <Box>
            <Box mt="24px">
              <RecentCakeProfitRow vaultKey={pool.vaultKey} />
            </Box>
            <Box mt="8px">
              <UnstakingFeeCountdownRow vaultKey={pool.vaultKey} />
            </Box>
          </Box>
          <Flex flexDirection="column">
            {account ? (
              <VaultCardActions
                pool={pool}
                accountHasSharesStaked={accountHasSharesStaked}
                isLoading={isLoading}
                performanceFee={performanceFeeAsDecimal}
              />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  {t('Start earning')}
                </Text>
                <ConnectWalletButton />
              </>
            )}
          </Flex>
        </FlexGap>
      </StyledCardBody>
      <CardFooter defaultExpanded={defaultFooterExpanded} pool={pool} account={account} />
    </StyledCard>
  )
}

export default CakeVaultCard
