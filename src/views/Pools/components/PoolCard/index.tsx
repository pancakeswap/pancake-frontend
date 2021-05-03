import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { useGetApiPrice } from 'state/hooks'
import { Pool } from 'state/types'
import AprRow from './AprRow'
import StyledCard from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')

  return (
    <StyledCard
      isStaking={!isFinished && accountHasStakedBalance}
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={`${t('Finished')}`} />}
    >
      <StyledCardHeader
        earningTokenSymbol={earningToken.symbol}
        stakingTokenSymbol={stakingToken.symbol}
        isFinished={isFinished && sousId !== 0}
      />
      <CardBody>
        <AprRow pool={pool} stakingTokenPrice={stakingTokenPrice} />
        <Flex mt="24px" flexDirection="column">
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
                {t('Start earning')}
              </Text>
              <UnlockButton />
            </>
          )}
        </Flex>
      </CardBody>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard
