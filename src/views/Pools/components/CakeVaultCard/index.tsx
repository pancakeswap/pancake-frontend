import React from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import { useCakeVault, usePriceCakeBusd } from 'state/hooks'
import { Pool } from 'state/types'
import AprRow from '../PoolCard/AprRow'
import { StyledCard, StyledCardInner } from '../PoolCard/StyledCard'
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
  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFee },
  } = useCakeVault()
  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const timesCompoundedDaily = 288
  const accountHasSharesStaked = userShares && userShares.gt(0)
  const cakePriceBusd = usePriceCakeBusd()
  const isLoading = !pool.userData || isVaultUserDataLoading
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <StyledCard isPromotedPool>
      <StyledCardInner isPromotedPool>
        <StyledCardHeader
          isPromotedPool
          isStaking={accountHasSharesStaked}
          isAutoVault
          earningTokenSymbol="CAKE"
          stakingTokenSymbol="CAKE"
        />
        <StyledCardBody isLoading={isLoading}>
          <AprRow
            pool={pool}
            stakingTokenPrice={cakePriceBusd.toNumber()}
            isAutoVault
            compoundFrequency={timesCompoundedDaily}
            performanceFee={performanceFeeAsDecimal}
          />
          <Box mt="24px">
            <RecentCakeProfitRow />
          </Box>
          <Box mt="8px">
            <UnstakingFeeCountdownRow />
          </Box>
          <Flex mt="24px" flexDirection="column">
            {account ? (
              <VaultCardActions pool={pool} accountHasSharesStaked={accountHasSharesStaked} isLoading={isLoading} />
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
        <CardFooter pool={pool} account={account} isAutoVault />
      </StyledCardInner>
    </StyledCard>
  )
}

export default CakeVaultCard
