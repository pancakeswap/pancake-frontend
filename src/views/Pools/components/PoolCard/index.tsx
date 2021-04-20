import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import useI18n from 'hooks/useI18n'
import { getAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
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
  const isCardActive = isFinished && accountHasStakedBalance
  const isOldSyrup = stakingToken.symbol === tokens.syrup.symbol
  const poolImageSrc = `${pool.earningToken.symbol}-${pool.stakingToken.symbol}.svg`.toLocaleLowerCase()

  return (
    <StyledCard isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      <StyledCardHeader
        poolImageSrc={poolImageSrc}
        earningTokenSymbol={earningToken.symbol}
        stakingTokenSymbol={stakingToken.symbol}
        isFinished={isFinished && sousId !== 0}
      />
      <CardBody>
        <AprRow
          isFinished={isFinished}
          isOldSyrup={isOldSyrup}
          stakingToken={stakingToken}
          earningToken={earningToken}
          totalStaked={pool.totalStaked}
          tokenPerBlock={pool.tokenPerBlock}
        />
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions pool={pool} isOldSyrup={isOldSyrup} />
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
        tokenName={earningToken.symbol}
        tokenAddress={earningToken.address ? getAddress(earningToken.address) : ''}
        tokenDecimals={earningToken.decimals}
        stakingTokenSymbol={stakingToken.symbol}
        contractAddress={contractAddress}
      />
    </StyledCard>
  )
}

export default PoolCard
