import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { CardBody, Flex, Text } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import useI18n from 'hooks/useI18n'
import { useCakeVaultContract } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { useGetApiPrice } from 'state/hooks'
import useLastUpdated from 'hooks/useLastUpdated'
import useGetVaultUserInfo from 'hooks/cakeVault/useGetVaultUserInfo'
import { Pool } from 'state/types'
import { convertSharesToCake } from 'views/Pools/helpers'
import AprRow from '../PoolCard/AprRow'
import StyledCard from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import StyledCardHeader from '../PoolCard/StyledCardHeader'
import VaultCardActions from './VaultCardActions'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'

const CakeVaultCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const TranslateString = useI18n()
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  const cakeVaultContract = useCakeVaultContract()
  const userInfo = useGetVaultUserInfo(lastUpdated)
  const [, setTotalShares] = useState(null)
  const [performanceFee, setPerformanceFee] = useState(null)
  const [withdrawalFee, setWithdrawalFee] = useState(null)
  const [withdrawalFeePeriod, setWithdrawalFeePeriod] = useState(null)
  const [totalCakeInVault, setTotalCakeInVault] = useState(null)
  const [pricePerFullShare, setPricePerFullShare] = useState(null)

  const { stakingToken } = pool

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const timesCompoundedDaily = 288
  const accountHasSharesStaked = userInfo.shares && userInfo.shares.gt(0)
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')

  useEffect(() => {
    const getPricePerShare = async () => {
      const sharePrice = await cakeVaultContract.methods.getPricePerFullShare().call()
      setPricePerFullShare(new BigNumber(sharePrice))
    }
    getPricePerShare()
  }, [cakeVaultContract, lastUpdated])

  useEffect(() => {
    const getFees = async () => {
      const contractPerformanceFee = await cakeVaultContract.methods.performanceFee().call()
      const contractWithdrawalFee = await cakeVaultContract.methods.withdrawFee().call()
      const contractWithdrawalFeeTimePeriod = await cakeVaultContract.methods.withdrawFeePeriod().call()
      setPerformanceFee(contractPerformanceFee)
      setWithdrawalFee(contractWithdrawalFee)
      setWithdrawalFeePeriod(contractWithdrawalFeeTimePeriod)
    }
    getFees()
  }, [cakeVaultContract])

  useEffect(() => {
    const getTotalShares = async () => {
      const shares = await cakeVaultContract.methods.totalShares().call()
      const { cakeAsBigNumber } = convertSharesToCake(new BigNumber(shares), pricePerFullShare)
      setTotalShares(new BigNumber(shares))
      setTotalCakeInVault(cakeAsBigNumber)
    }
    getTotalShares()
  }, [cakeVaultContract, lastUpdated, pricePerFullShare])

  return (
    <StyledCard isStaking={accountHasSharesStaked}>
      <StyledCardHeader isAutoVault earningTokenSymbol="CAKE" stakingTokenSymbol="CAKE" />
      <CardBody>
        <AprRow
          pool={pool}
          stakingTokenPrice={stakingTokenPrice}
          isAutoVault
          compoundFrequency={timesCompoundedDaily}
        />
        <Flex mt="24px" alignItems="center">
          <UnstakingFeeCountdownRow
            withdrawalFee={withdrawalFee}
            lastDepositedTime={accountHasSharesStaked && userInfo.lastDepositedTime}
            withdrawalFeePeriod={withdrawalFeePeriod}
          />
        </Flex>
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <VaultCardActions
              pool={pool}
              userInfo={userInfo}
              pricePerFullShare={pricePerFullShare}
              withdrawalFee={withdrawalFee}
              stakingTokenPrice={stakingTokenPrice}
              accountHasSharesStaked={accountHasSharesStaked}
              account={account}
              lastUpdated={lastUpdated}
              setLastUpdated={setLastUpdated}
            />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {TranslateString(999, 'Start earning')}
              </Text>
              <UnlockButton />
            </>
          )}
        </Flex>
      </CardBody>
      <CardFooter
        pool={pool}
        account={account}
        performanceFee={performanceFee}
        isAutoVault
        totalCakeInVault={totalCakeInVault}
      />
    </StyledCard>
  )
}

export default CakeVaultCard
