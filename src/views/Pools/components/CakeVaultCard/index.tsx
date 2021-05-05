import React from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, Text } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import { getAddress } from 'utils/addressHelpers'
import { useGetApiPrice } from 'state/hooks'
import useLastUpdated from 'hooks/useLastUpdated'
import useGetVaultUserInfo from 'hooks/cakeVault/useGetVaultUserInfo'
import useGetVaultSharesInfo from 'hooks/cakeVault/useGetVaultSharesInfo'
import useGetVaultFees from 'hooks/cakeVault/useGetVaultFees'
import { Pool } from 'state/types'
import AprRow from '../PoolCard/AprRow'
import StyledCard from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import StyledCardHeader from '../PoolCard/StyledCardHeader'
import VaultCardActions from './VaultCardActions'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentCakeProfitRow from './RecentCakeProfitRow'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface CakeVaultProps {
  pool: Pool
  showStakedOnly: boolean
}

const CakeVaultCard: React.FC<CakeVaultProps> = ({ pool, showStakedOnly }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  const userInfo = useGetVaultUserInfo(lastUpdated)
  const vaultFees = useGetVaultFees()
  const { totalCakeInVault, pricePerFullShare } = useGetVaultSharesInfo()
  const { stakingToken } = pool
  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const timesCompoundedDaily = 288
  const accountHasSharesStaked = userInfo.shares && userInfo.shares.gt(0)
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')
  const isLoading = !pool.userData || !userInfo.shares
  const performanceFeeAsDecimal = vaultFees.performanceFee && parseInt(vaultFees.performanceFee, 10) / 100

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <StyledCard isStaking={accountHasSharesStaked}>
      <StyledCardHeader isAutoVault earningTokenSymbol="CAKE" stakingTokenSymbol="CAKE" />
      <StyledCardBody isLoading={isLoading}>
        <AprRow
          pool={pool}
          stakingTokenPrice={stakingTokenPrice}
          isAutoVault
          compoundFrequency={timesCompoundedDaily}
          performanceFee={performanceFeeAsDecimal}
        />
        <Box mt="24px">
          <RecentCakeProfitRow
            cakeAtLastUserAction={userInfo.cakeAtLastUserAction}
            userShares={userInfo.shares}
            pricePerFullShare={pricePerFullShare}
          />
        </Box>
        <Box mt="8px">
          <UnstakingFeeCountdownRow
            withdrawalFee={vaultFees.withdrawalFee}
            withdrawalFeePeriod={vaultFees.withdrawalFeePeriod}
            lastDepositedTime={accountHasSharesStaked && userInfo.lastDepositedTime}
          />
        </Box>
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <VaultCardActions
              pool={pool}
              userInfo={userInfo}
              pricePerFullShare={pricePerFullShare}
              vaultFees={vaultFees}
              stakingTokenPrice={stakingTokenPrice}
              accountHasSharesStaked={accountHasSharesStaked}
              lastUpdated={lastUpdated}
              setLastUpdated={setLastUpdated}
              isLoading={isLoading}
            />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {t('Start earning')}
              </Text>
              <UnlockButton />
            </>
          )}
        </Flex>
      </StyledCardBody>
      <CardFooter
        pool={pool}
        account={account}
        performanceFee={vaultFees.performanceFee}
        isAutoVault
        totalCakeInVault={totalCakeInVault}
      />
    </StyledCard>
  )
}

export default CakeVaultCard
