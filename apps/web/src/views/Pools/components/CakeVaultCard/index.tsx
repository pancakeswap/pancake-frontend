import { Box, Button, CardBody, CardProps, Flex, FlexGap, Skeleton, TokenPairImage, useModal } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { vaultPoolConfig } from 'config/constants/pools'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedCakeVault, DeserializedLockedCakeVault, VaultKey } from 'state/types'
import { styled } from 'styled-components'
import { VaultPosition, getVaultPosition } from 'utils/cakePool'
import BenefitsModal from 'views/Pools/components/RevenueSharing/BenefitsModal'
import useVCake from 'views/Pools/hooks/useVCake'
import { useAccount } from 'wagmi'

import { VeCakeCard, VeCakeUpdateCard } from 'views/CakeStaking/components/SyrupPool'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'
import LockedStakingApy from '../LockedPool/LockedStakingApy'
import CardFooter from '../PoolCard/CardFooter'
import { VaultPositionTagWithLabel } from '../Vault/VaultPositionTag'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import VaultCardActions from './VaultCardActions'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface CakeVaultProps extends CardProps {
  pool?: Pool.DeserializedPool<Token>
  showStakedOnly: boolean
  defaultFooterExpanded?: boolean
  showICake?: boolean
  showSkeleton?: boolean
}

interface CakeVaultDetailProps {
  isLoading?: boolean
  account?: string
  pool: Pool.DeserializedPool<Token>
  vaultPool: DeserializedCakeVault
  accountHasSharesStaked?: boolean
  defaultFooterExpanded?: boolean
  showICake?: boolean
  performanceFeeAsDecimal?: number
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
  const { isInitialization } = useVCake()
  const [onPresentViewBenefitsModal] = useModal(
    <BenefitsModal pool={pool} userData={(vaultPool as DeserializedLockedCakeVault)?.userData} />,
    true,
    false,
    'revenueModal',
  )

  const vaultPosition = getVaultPosition(vaultPool.userData)
  const isLocked = (vaultPool as DeserializedLockedCakeVault)?.userData?.locked
  const isUserDelegated = useIsUserDelegated()

  if (!pool) {
    return null
  }

  return (
    <>
      <StyledCardBody isLoading={isLoading}>
        {vaultPosition >= VaultPosition.LockedEnd && !isUserDelegated && <VeCakeUpdateCard isLockEndOrAfterLock />}

        {account && pool.vaultKey === VaultKey.CakeVault && (
          <VaultPositionTagWithLabel userData={(vaultPool as DeserializedLockedCakeVault)?.userData} />
        )}
        {account && pool.vaultKey === VaultKey.CakeVault && isLocked ? (
          <>
            <LockedStakingApy
              userData={(vaultPool as DeserializedLockedCakeVault).userData}
              showICake={showICake}
              pool={pool}
              account={account}
            />
            {vaultPosition === VaultPosition.Locked && isInitialization && !showICake && (
              <Button mt="16px" width="100%" variant="secondary" onClick={onPresentViewBenefitsModal}>
                {t('View Benefits')}
              </Button>
            )}
          </>
        ) : (
          <>
            {account && vaultPosition === VaultPosition.Flexible && !isUserDelegated ? (
              <VeCakeUpdateCard isFlexibleStake />
            ) : (
              <VeCakeCard />
            )}
            {/* {<StakingApy pool={pool} />} */}
            {vaultPosition !== VaultPosition.None && !isUserDelegated && (
              <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
                <Box>
                  {account && (
                    <Box mb="8px">
                      <UnstakingFeeCountdownRow vaultKey={pool.vaultKey ?? VaultKey.CakeVaultV1} />
                    </Box>
                  )}
                  {/* <RecentCakeProfitRow pool={pool} /> */}
                </Box>
                <Flex flexDirection="column">
                  {account && (
                    <VaultCardActions
                      pool={pool}
                      accountHasSharesStaked={accountHasSharesStaked}
                      isLoading={isLoading}
                      performanceFee={performanceFeeAsDecimal}
                    />
                  )}
                </Flex>
              </FlexGap>
            )}
          </>
        )}
      </StyledCardBody>
      {account && !isUserDelegated && (
        <CardFooter isLocked={isLocked} defaultExpanded={defaultFooterExpanded} pool={pool} account={account} />
      )}
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

  const vaultPool = useVaultPoolByKey(pool?.vaultKey || VaultKey.CakeVault)
  const totalStaked = pool?.totalStaked

  const userShares = vaultPool?.userData?.userShares
  const isVaultUserDataLoading = vaultPool?.userData?.isLoading
  const performanceFeeAsDecimal = vaultPool?.fees?.performanceFeeAsDecimal

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool?.userData || isVaultUserDataLoading

  if (!pool || (showStakedOnly && !accountHasSharesStaked)) {
    return null
  }

  return (
    <Pool.StyledCard isActive {...props}>
      <Pool.PoolCardHeader isStaking={accountHasSharesStaked}>
        {!showSkeleton || (totalStaked && totalStaked.gte(0)) ? (
          <>
            <Pool.PoolCardHeaderTitle
              title={vaultPoolConfig?.[pool.vaultKey ?? '']?.name ?? ''}
              subTitle={vaultPoolConfig?.[pool.vaultKey ?? ''].description ?? ''}
            />
            <TokenPairImage {...vaultPoolConfig?.[pool.vaultKey ?? ''].tokenImage} width={64} height={64} />
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
