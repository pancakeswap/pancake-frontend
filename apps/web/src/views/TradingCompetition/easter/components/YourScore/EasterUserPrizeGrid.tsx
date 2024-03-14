import { useTranslation } from '@pancakeswap/localization'
import {
  BlockIcon,
  CheckmarkCircleIcon,
  CrownIcon,
  Flex,
  Skeleton,
  TeamPlayerIcon,
  Text,
  TrophyGoldIcon,
} from '@pancakeswap/uikit'
import React from 'react'
import { styled } from 'styled-components'
import { BoldTd, StyledPrizeTable, Td } from '../../../components/StyledPrizeTable'
import { getEasterRewardGroupAchievements, useCompetitionCakeRewards } from '../../../helpers'

const StyledThead = styled.thead`
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const EasterUserPrizeGrid: React.FC<React.PropsWithChildren<{ userTradingInformation? }>> = ({
  userTradingInformation,
}) => {
  const { t } = useTranslation()
  const { userRewardGroup, userCakeRewards, userPointReward, canClaimNFT } = userTradingInformation
  const { cakeReward, dollarValueOfCakeReward } = useCompetitionCakeRewards(userCakeRewards)
  const { champion, teamPlayer } = getEasterRewardGroupAchievements(userRewardGroup)

  return (
    <StyledPrizeTable>
      <StyledThead>
        <tr>
          <th>{t('CAKE Prizes')}</th>
          <th>{t('Achievements')}</th>
          <th>{t('NFT')}</th>
        </tr>
      </StyledThead>
      <tbody>
        <tr>
          <BoldTd>
            <Flex flexDirection="column">
              <Text bold>{cakeReward.toFixed(2)}</Text>
              {dollarValueOfCakeReward ? (
                <Text fontSize="12px" color="textSubtle">
                  ~{dollarValueOfCakeReward} USD
                </Text>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Flex>
          </BoldTd>
          <Td>
            <Flex alignItems="center" flexWrap="wrap" justifyContent="center" width="100%">
              {champion && champion > 0 && <CrownIcon mr={[0, '4px']} />}
              {teamPlayer && teamPlayer > 0 && <TeamPlayerIcon mr={[0, '4px']} />}
              <TrophyGoldIcon mr={[0, '4px']} />
              <Text fontSize="12px" color="textSubtle" textTransform="lowercase">
                + {userPointReward} {t('Points')}
              </Text>
            </Flex>
          </Td>
          <Td>{canClaimNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
        </tr>
      </tbody>
    </StyledPrizeTable>
  )
}

export default EasterUserPrizeGrid
