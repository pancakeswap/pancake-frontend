import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, ProfileAvatar, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import truncateHash from '@pancakeswap/utils/truncateHash'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { useMemo } from 'react'
import { useProfileForAddress } from 'state/profile/hooks'
import { styled } from 'styled-components'
import { RankListDetail } from 'views/TradingReward/hooks/useRankList'

export const StyledMobileRow = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};

  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`

interface MobileResultProps {
  isMyRank?: boolean
  rank: RankListDetail
}

const MobileResult: React.FC<React.PropsWithChildren<MobileResultProps>> = ({ isMyRank, rank }) => {
  const { t } = useTranslation()
  const cakePriceBusd = useCakePrice()
  const { profile, isLoading: isProfileLoading } = useProfileForAddress(rank.origin)
  const { domainName, avatar } = useDomainNameForAddress(rank.origin, !profile && !isProfileLoading)

  const cakeAmount = useMemo(
    () => new BigNumber(rank?.estimateRewardUSD).div(cakePriceBusd).toNumber(),
    [cakePriceBusd, rank?.estimateRewardUSD],
  )

  return (
    <StyledMobileRow p="16px">
      <Flex justifyContent="space-between" mb="16px">
        <Flex width="30%" alignSelf="center">
          <Flex flexDirection="column" width="100%">
            {isMyRank && (
              <Text fontSize={20} fontWeight="bold" color="secondary">
                {t('My Rank')}
              </Text>
            )}
            <Text fontWeight="bold" color="secondary">
              {rank.rank === 0 ? '--' : `#${rank.rank}`}
            </Text>
          </Flex>
        </Flex>
        <Flex width="70%" justifyContent="flex-end" alignSelf="center">
          <Text ellipsis color="primary" fontWeight="bold" style={{ alignSelf: 'center' }} mr="8px">
            {profile?.username || domainName || truncateHash(rank.origin)}
          </Text>
          <ProfileAvatar width={32} height={32} src={profile?.nft?.image?.thumbnail ?? avatar} />
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Text fontSize="12px" color="textSubtle" mr="auto">
          {t('Total Reward')}
        </Text>
        <Box>
          <Text bold textAlign="right">
            {`$${formatNumber(rank.estimateRewardUSD)}`}
          </Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right" lineHeight="110%">
            {`~${formatNumber(cakeAmount)} CAKE`}
          </Text>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="12px" color="textSubtle" mr="auto">
          {t('Trading Volume')}
        </Text>
        <Text fontWeight="bold" textAlign="right">
          {`$${formatNumber(rank.volume)}`}
        </Text>
      </Flex>
    </StyledMobileRow>
  )
}

export default MobileResult
