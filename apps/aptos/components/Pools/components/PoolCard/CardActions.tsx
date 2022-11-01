import BigNumber from 'bignumber.js'

import styled from 'styled-components'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Flex, Text, Box, Pool } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pool.DeserializedPool<Coin>
  stakedBalance: BigNumber
}

// NOTE Philip: Move CardActions to widget
const CardActions: React.FC<React.PropsWithChildren<CardActionsProps>> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, userData, earningTokenPrice } = pool

  const isBnbPool = false
  const { t } = useTranslation()
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <>
          <Box display="inline">
            <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
              {`${earningToken.symbol} `}
            </InlineText>
            <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
              {t('Earned')}
            </InlineText>
          </Box>
          <HarvestActions
            earnings={earnings}
            earningTokenSymbol={earningToken.symbol}
            earningTokenDecimals={earningToken.decimals}
            sousId={sousId}
            earningTokenPrice={earningTokenPrice}
            isBnbPool={isBnbPool}
            isLoading={isLoading}
          />
        </>
        <Box display="inline">
          <InlineText color={isStaked ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        <StakeActions
          isLoading={isLoading}
          pool={pool}
          stakingTokenBalance={stakingTokenBalance}
          stakedBalance={stakedBalance}
          isBnbPool={isBnbPool}
          isStaked={isStaked}
        />
      </Flex>
    </Flex>
  )
}

export default CardActions
