import { Box, CardBody, CardProps, Flex, Text, TokenPairImage } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { vaultPoolConfig } from 'config/constants/pools'
import { useTranslation } from 'contexts/Localization'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedCakeVault, DeserializedPool } from 'state/types'
import styled from 'styled-components'
import { convertSharesToCake } from 'views/Pools/helpers'
import CardFooter from '../PoolCard/CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from '../PoolCard/PoolCardHeader'
import { StyledCard } from '../PoolCard/StyledCard'
import { VaultPositionTagWithLabel } from '../Vault/VaultPositionTag'
// import UnstakingFeeCountdownRow from '../UnstakingFeeCountdownRow'
import RecentCakeProfitRow from './RecentCakeProfitRow'
import { StakingApy } from './StakingApy'
import VaultCardActions from './VaultCardActions'

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
  const vaultPool = useVaultPoolByKey(pool.vaultKey)
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
    <StyledCard isActive {...props}>
      <PoolCardHeader isStaking={accountHasSharesStaked}>
        <PoolCardHeaderTitle
          title={vaultPoolConfig[pool.vaultKey].name}
          subTitle={vaultPoolConfig[pool.vaultKey].description}
        />
        <TokenPairImage {...vaultPoolConfig[pool.vaultKey].tokenImage} width={64} height={64} />
      </PoolCardHeader>
      <StyledCardBody isLoading={isLoading}>
        <VaultPositionTagWithLabel userData={vaultPool.userData} />
        <StakingApy pool={pool} />
        <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
          {/* TODO */}
          <Box>
            <RecentCakeProfitRow pool={pool} />
            {/* <Box mt="8px">
              <UnstakingFeeCountdownRow vaultKey={pool.vaultKey} />
            </Box> */}
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
