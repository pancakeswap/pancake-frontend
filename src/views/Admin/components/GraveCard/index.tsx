import React from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, Text } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import { getAddress } from 'utils/addressHelpers'
import { useGetApiPrice } from 'state/hooks'
import useLastUpdated from 'hooks/useLastUpdated'
import useGetVaultUserInfo from 'hooks/cakeVault/useGetVaultUserInfo'
import useGetVaultSharesInfo from 'hooks/cakeVault/useGetVaultSharesInfo'
import useGetVaultFees from 'hooks/cakeVault/useGetVaultFees'
import { Pool } from 'state/types'
import NFTmrRow from './NFTmr'
import MinimumDepositTimeRow from './MinimumDepositTime'
import StyledCard from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import VaultCardActions from './VaultCardActions'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

const GraveCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { t } = useTranslation()
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

  return (
    <StyledCard isStaking={accountHasSharesStaked} style={{
      maxWidth: "400px"
    }}>
      <StyledCardHeader earningTokenSymbol="UndeadMoon" stakingTokenSymbol="TheMoon" stakingTokenImageUrl="https://storage.googleapis.com/rug-zombie/TheMoon.png"/>
      <StyledCardBody isLoading={isLoading}>
        <NFTmrRow
          pool={pool}
          stakingTokenPrice={stakingTokenPrice}
          compoundFrequency={timesCompoundedDaily}
          performanceFee={performanceFeeAsDecimal}
        />
        <MinimumDepositTimeRow pool={pool} stakingTokenPrice={stakingTokenPrice} />
        <br/>
        <br/>
        <Flex justifyContent="center"> Maybe Image of NFT here? </Flex>

        <Flex mt="24px" flexDirection="column">
          {account ? (
            <VaultCardActions
              pool={pool}
              userInfo={userInfo}
              pricePerFullShare={pricePerFullShare}
              vaultFees={vaultFees}
              stakingTokenPrice={stakingTokenPrice}
              accountHasSharesStaked={accountHasSharesStaked}
              account={account}
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
        totalCakeInVault={totalCakeInVault}
      />
    </StyledCard>
  )
}

export default GraveCard
