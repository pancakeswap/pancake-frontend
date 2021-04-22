import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import useI18n from 'hooks/useI18n'
import { getAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import { useGetApiPrice } from 'state/hooks'
import { Pool } from 'state/types'
import AprRow from './AprRow'
import StyledCard from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<{ pool: Pool }> = ({ pool }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
    contractAddress,
  } = pool
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')

  return (
    <StyledCard isStaking={!isFinished && accountHasStakedBalance} isFinished={isFinished && sousId !== 0}>
      <StyledCardHeader
        earningTokenSymbol={earningToken.symbol}
        stakingTokenSymbol={stakingToken.symbol}
        isFinished={isFinished && sousId !== 0}
      />
      <CardBody>
        <AprRow
          isFinished={isFinished}
          stakingToken={stakingToken}
          stakingTokenPrice={stakingTokenPrice}
          earningToken={earningToken}
          totalStaked={pool.totalStaked}
          tokenPerBlock={pool.tokenPerBlock}
        />
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
      <CardFooter
        projectLink={earningToken.projectLink}
        decimals={stakingToken.decimals}
        totalStaked={totalStaked}
        startBlock={startBlock}
        endBlock={endBlock}
        isFinished={isFinished}
        tokenSymbol={earningToken.symbol}
        tokenAddress={earningToken.address ? getAddress(earningToken.address) : ''}
        tokenDecimals={earningToken.decimals}
        stakingTokenSymbol={stakingToken.symbol}
        contractAddress={contractAddress}
      />
    </StyledCard>
  )
}

export default PoolCard
