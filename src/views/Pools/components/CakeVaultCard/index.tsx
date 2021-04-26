import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { CardBody, Flex, Text } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import useI18n from 'hooks/useI18n'
import { useCakeVaultContract } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { useGetApiPrice } from 'state/hooks'
import { Pool } from 'state/types'
import AprRow from '../PoolCard/AprRow'
import StyledCard from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import StyledCardHeader from '../PoolCard/StyledCardHeader'
import CardActions from '../PoolCard/CardActions'

const CakeVaultCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, userData } = pool
  const TranslateString = useI18n()
  const cakeVaultContract = useCakeVaultContract()
  const accountHasStakedBalance = false
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')
  const timesCompoundedDaily = 24
  const [vaultUserInfo, setVaultUserInfo] = useState({ shares: null, lastDepositedTime: null })

  useEffect(() => {
    const fetchUserVaultInfo = async () => {
      const userInfo = await cakeVaultContract.methods.userInfo(account).call()
      setVaultUserInfo(userInfo)
    }

    if (account) {
      fetchUserVaultInfo()
    }
  }, [account, cakeVaultContract])

  return (
    <StyledCard isStaking={accountHasStakedBalance}>
      <StyledCardHeader autoVault earningTokenSymbol="CAKE" stakingTokenSymbol="CAKE" />
      <CardBody>
        <AprRow pool={pool} stakingTokenPrice={stakingTokenPrice} autoVault compoundFrequency={timesCompoundedDaily} />
        {/*   <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions
              pool={pool}
              stakedBalance={stakedBalance}
              stakingTokenPrice={stakingTokenPrice}
              accountHasStakedBalance={accountHasStakedBalance}
            />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {TranslateString(999, 'Start earning')}
              </Text>
              <UnlockButton />
            </>
          )}
        </Flex> */}
      </CardBody>
      {/* <CardFooter pool={pool} account={account} /> */}
    </StyledCard>
  )
}

export default CakeVaultCard
