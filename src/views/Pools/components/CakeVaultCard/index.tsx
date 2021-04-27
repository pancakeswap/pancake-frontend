import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { CardBody, Flex, Text } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import useI18n from 'hooks/useI18n'
import { useCakeVaultContract } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { useGetApiPrice } from 'state/hooks'
import { Pool } from 'state/types'
import { getFullDisplayBalance } from 'utils/formatBalance'
import AprRow from '../PoolCard/AprRow'
import StyledCard from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import StyledCardHeader from '../PoolCard/StyledCardHeader'
import VaultCardActions from './VaultCardActions'

const CakeVaultCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const TranslateString = useI18n()
  const cakeVaultContract = useCakeVaultContract()
  const [totalShares, setTotalShares] = useState(null)
  const [userInfo, setUserInfo] = useState({
    shares: null,
    cakeAtLastUserAction: null,
    lastDepositedTime: null,
    lastUserActionTime: null,
  })
  const [performanceFee, setPerformanceFee] = useState(null)
  const [pricePerFullShare, setPricePerFullShare] = useState(null)

  const { stakingToken } = pool

  //   Estimate & manual for now. We can change once we have a better sense of this
  const timesCompoundedDaily = 24
  const accountHasSharesStaked = userInfo.shares && userInfo.shares.gt(0)
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')

  console.log('user shares: ', userInfo.shares && userInfo.shares.toNumber())

  useEffect(() => {
    //   user-specific contract fetches
    const fetchUserVaultInfo = async () => {
      const userContractInfo = await cakeVaultContract.methods.userInfo(account).call()
      setUserInfo({
        shares: new BigNumber(userContractInfo.shares),
        cakeAtLastUserAction: new BigNumber(userContractInfo.cakeAtLastUserAction),
        lastDepositedTime: userContractInfo.lastDepositedTime,
        lastUserActionTime: userContractInfo.lastUserActionTime,
      })
    }

    if (account) {
      fetchUserVaultInfo()
    }
  }, [account, cakeVaultContract])

  useEffect(() => {
    //   generic contract fetches
    const getPricePerShare = async () => {
      const sharePrice = await cakeVaultContract.methods.getPricePerFullShare().call()
      setPricePerFullShare(new BigNumber(sharePrice))
    }
    const getTotalShares = async () => {
      const shares = await cakeVaultContract.methods.totalShares().call()
      setTotalShares(new BigNumber(shares))
    }
    const getFees = async () => {
      const perfFee = await cakeVaultContract.methods.performanceFee().call()
      setPerformanceFee(perfFee)
    }
    getPricePerShare()
    getTotalShares()
    getFees()
  }, [cakeVaultContract])

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
      <CardFooter pool={pool} account={account} performanceFee={performanceFee} isAutoVault />
    </StyledCard>
  )
}

export default CakeVaultCard
