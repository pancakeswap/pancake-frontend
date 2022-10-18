import BigNumber from 'bignumber.js'

import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { PoolCategory } from 'config/constants/types'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { DeserializedPool } from 'state/types'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
}

const CardActions: React.FC<React.PropsWithChildren<CardActionsProps>> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, poolCategory, userData, earningTokenPrice } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  // const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)

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
            earningToken={earningToken}
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
        {/* {notMeetRequired || notMeetThreshold ? (
          <ProfileRequirementWarning profileRequirement={profileRequirement} />
        ) : needsApproval ? (
          <ApprovalAction pool={pool} isLoading={isLoading} />
        ) : (
          <StakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakedBalance={stakedBalance}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
          />
        )} */}
      </Flex>
    </Flex>
  )
}

export default CardActions
