import { Box, CardBody, CardProps, Flex, Text, TokenPairImage, FlexGap, Skeleton, Pool } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { vaultPoolConfig } from 'config/constants/pools'
import { useTranslation } from '@pancakeswap/localization'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedCakeVault, DeserializedCakeVault } from 'state/types'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'

import CardFooter from '../PoolCard/CardFooter'
import { VaultPositionTagWithLabel } from '../Vault/VaultPositionTag'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentCakeProfitRow from './RecentCakeProfitRow'
import { StakingApy } from './StakingApy'
import VaultCardActions from './VaultCardActions'
import LockedStakingApy from '../LockedPool/LockedStakingApy'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface CakeVaultProps extends CardProps {
  pool: Pool.DeserializedPool<Token>
  showStakedOnly: boolean
  defaultFooterExpanded?: boolean
  showICake?: boolean
  showSkeleton?: boolean
}

interface CakeVaultDetailProps {
  isLoading?: boolean
  account: string
  pool: Pool.DeserializedPool<Token>
  vaultPool: DeserializedCakeVault
  accountHasSharesStaked: boolean
  defaultFooterExpanded?: boolean
  showICake?: boolean
  performanceFeeAsDecimal: number
}

export const CakeVaultDetail: React.FC<React.PropsWithChildren<CakeVaultDetailProps>> = ({
  isLoading = false,
  account,
  pool,
  vaultPool,
  accountHasSharesStaked,
  showICake,
  performanceFeeAsDecimal,
  defaultFooterExpanded,
}) => {
  const { t } = useTranslation()

  const isLocked = (vaultPool as DeserializedLockedCakeVault).userData.locked

  return (
    <>
      <StyledCardBody isLoading={isLoading}>
        {account && pool.vaultKey === VaultKey.CakeVault && (
          <VaultPositionTagWithLabel userData={(vaultPool as DeserializedLockedCakeVault).userData} />
        )}
        {account && pool.vaultKey === VaultKey.CakeVault && isLocked ? (
          <LockedStakingApy
            userData={(vaultPool as DeserializedLockedCakeVault).userData}
            stakingToken={pool?.stakingToken}
            stakingTokenBalance={pool?.userData?.stakingTokenBalance}
            showICake={showICake}
          />
        ) : (
          <>
            <StakingApy pool={pool} />
            <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
              <Box>
                {account && (
                  <Box mb="8px">
                    <UnstakingFeeCountdownRow vaultKey={pool.vaultKey} />
                  </Box>
                )}
                <RecentCakeProfitRow pool={pool} />
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
          </>
        )}
      </StyledCardBody>
      <CardFooter isLocked={isLocked} defaultExpanded={defaultFooterExpanded} pool={pool} account={account} />
    </>
  )
}

const CakeVaultCard: React.FC<React.PropsWithChildren<CakeVaultProps>> = ({
  pool,
  showStakedOnly,
  defaultFooterExpanded,
  showICake = false,
  showSkeleton = true,
  ...props
}) => {
  const { address: account } = useAccount()

  const vaultPool = useVaultPoolByKey(pool.vaultKey)
  const { totalStaked } = pool

  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFeeAsDecimal },
  } = vaultPool

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <Pool.StyledCard isActive {...props}>
      <Pool.PoolCardHeader isStaking={accountHasSharesStaked}>
        {!showSkeleton || (totalStaked && totalStaked.gte(0)) ? (
          <>
            <Pool.PoolCardHeaderTitle
              title={vaultPoolConfig[pool.vaultKey].name}
              subTitle={vaultPoolConfig[pool.vaultKey].description}
            />
            <TokenPairImage {...vaultPoolConfig[pool.vaultKey].tokenImage} width={64} height={64} />
          </>
        ) : (
          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="column">
              <Skeleton width={100} height={26} mb="4px" />
              <Skeleton width={65} height={20} />
            </Flex>
            <Skeleton width={58} height={58} variant="circle" />
          </Flex>
        )}
      </Pool.PoolCardHeader>
      <CakeVaultDetail
        isLoading={isLoading}
        account={account}
        pool={pool}
        vaultPool={vaultPool}
        accountHasSharesStaked={accountHasSharesStaked}
        showICake={showICake}
        performanceFeeAsDecimal={performanceFeeAsDecimal}
        defaultFooterExpanded={defaultFooterExpanded}
      />
    </Pool.StyledCard>
  )
}

export default CakeVaultCard
