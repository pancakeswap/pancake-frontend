import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import useI18n from 'hooks/useI18n'
import { getAddress } from 'utils/addressHelpers'
import { useGetApiPrice } from 'state/hooks'
import { Pool } from 'state/types'
import AprRow from './AprRow'
import StyledCard from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const TranslateString = useI18n()
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')

  return (
    <StyledCard
      isStaking={!isFinished && accountHasStakedBalance}
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={`${TranslateString(388, 'Finished')}`} />}
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
                {TranslateString(999, 'Start earning')}
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
