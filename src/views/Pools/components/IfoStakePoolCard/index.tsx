import React from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import tokens from 'config/constants/tokens'
import { useIfoPool } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { convertSharesToCake } from 'views/Pools/helpers'
import { TokenPairImage } from 'components/TokenImage'
import AprRow from '../PoolCard/AprRow'
import { StyledCard as StyledCardBase } from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from '../PoolCard/PoolCardHeader'
import VaultCardActions from '../CakeVaultCard/VaultCardActions'
import UnstakingFeeCountdownRow from '../CakeVaultCard/UnstakingFeeCountdownRow'
import RecentCakeProfitRow from '../CakeVaultCard/RecentCakeProfitRow'

const StyledCard = styled(StyledCardBase)`
  max-width: 376px;
  width: 100%;
  margin: 0;
`

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface CakeVaultProps {
  pool: DeserializedPool
  showStakedOnly: boolean
  defaultExpanded?: boolean
}

const IfoStakePoolCard: React.FC<CakeVaultProps> = ({ pool, showStakedOnly, defaultExpanded }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFee },
    pricePerFullShare,
  } = useIfoPool()

  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <StyledCard isActive>
      <PoolCardHeader isStaking={accountHasSharesStaked}>
        <PoolCardHeaderTitle title={t('IFO CAKE')} subTitle={t('Stake CAKE to participate in IFO')} />
        <TokenPairImage primaryToken={tokens.cake} secondaryToken={tokens.cake} width={64} height={64} />
      </PoolCardHeader>
      <StyledCardBody isLoading={isLoading}>
        <AprRow pool={pool} stakedBalance={cakeAsBigNumber} performanceFee={performanceFeeAsDecimal} />
        <Box mt="24px">
          <RecentCakeProfitRow />
        </Box>
        <Box mt="8px">
          <UnstakingFeeCountdownRow />
        </Box>
        <Flex mt="32px" flexDirection="column">
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
      </StyledCardBody>
      <CardFooter defaultExpanded={defaultExpanded} pool={pool} account={account} />
    </StyledCard>
  )
}

export default IfoStakePoolCard
