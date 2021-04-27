import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { CardBody, Flex, Text } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import useI18n from 'hooks/useI18n'
import { useCakeVaultContract } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { useGetApiPrice } from 'state/hooks'
import useLastUpdated from 'hooks/useLastUpdated'
import useVaultUserInfo from 'hooks/cakeVault/useVaultUserInfo'
import { Pool } from 'state/types'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { convertSharesToCake } from 'views/Pools/helpers'
import AprRow from '../PoolCard/AprRow'
import StyledCard from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import StyledCardHeader from '../PoolCard/StyledCardHeader'
import VaultCardActions from './VaultCardActions'
import PerformanceFeeCountdownRow from './PerformanceFeeCountdownRow'

const CakeVaultCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const TranslateString = useI18n()
  const cakeVaultContract = useCakeVaultContract()
  const [totalShares, setTotalShares] = useState(null)
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  const userInfo = useVaultUserInfo(lastUpdated)
  const [performanceFee, setPerformanceFee] = useState(null)
  const [totalCakeInVault, setTotalCakeInVault] = useState(null)
  const [pricePerFullShare, setPricePerFullShare] = useState(null)

  const { stakingToken } = pool

  //   Estimate & manual for now. We can change once we have a better sense of this
  const timesCompoundedDaily = 24
  const accountHasSharesStaked = userInfo.shares && userInfo.shares.gt(0)
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')

  console.log('user shares: ', userInfo.shares && userInfo.shares.toNumber())

  useEffect(() => {
    //   generic contract fetches
    const getPricePerShare = async () => {
      const sharePrice = await cakeVaultContract.methods.getPricePerFullShare().call()
      setPricePerFullShare(new BigNumber(sharePrice))
    }
    const getFees = async () => {
      const perfFee = await cakeVaultContract.methods.performanceFee().call()
      setPerformanceFee(perfFee)
    }
    getPricePerShare()
    getFees()
  }, [cakeVaultContract, lastUpdated])

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
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <VaultCardActions
              pool={pool}
              userInfo={userInfo}
              pricePerFullShare={pricePerFullShare}
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
          <PerformanceFeeCountdownRow performanceFee={performanceFee} lastDepositedTime={userInfo.lastDepositedTime} />
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
