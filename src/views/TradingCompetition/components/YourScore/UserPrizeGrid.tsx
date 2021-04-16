import React from 'react'
import styled from 'styled-components'
import {
  BlockIcon,
  CheckmarkCircleIcon,
  Flex,
  CrownIcon,
  Text,
  TeamPlayerIcon,
  TrophyGoldIcon,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { UserTradingInformationProps } from '../../types'
import { useCompetitionCakeRewards, getRewardGroupAchievements } from '../../helpers'
import { BoldTd, Td, StyledPrizeTable } from '../StyledPrizeTable'

const StyledThead = styled.thead`
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
`

const UserPrizeGrid: React.FC<{ userTradingInformation?: UserTradingInformationProps }> = ({
  userTradingInformation,
}) => {
  const TranslateString = useI18n()
  const { userRewardGroup, userCakeRewards, userPointReward, canClaimNFT } = userTradingInformation
  const { cakeReward, dollarValueOfCakeReward } = useCompetitionCakeRewards(userCakeRewards)
  const { champion, teamPlayer } = getRewardGroupAchievements(userRewardGroup)

  return (
    <StyledPrizeTable>
      <StyledThead>
        <tr>
          <th>{TranslateString(999, 'CAKE Prizes ')}</th>
          <th>{TranslateString(1092, 'Achievements')}</th>
          <th>{TranslateString(999, 'NFT')}</th>
        </tr>
      </StyledThead>
      <tbody>
        <tr>
          <BoldTd>
            <Flex flexDirection="column">
              <Text bold>{cakeReward.toFixed(2)}</Text>
              <Text fontSize="12px" color="textSubtle">
                ~{dollarValueOfCakeReward} USD
              </Text>
            </Flex>
          </BoldTd>
          <Td>
            <Flex alignItems="center" flexWrap="wrap" justifyContent="center" width="100%">
              {champion && <CrownIcon mr={[0, '4px']} />}
              {teamPlayer && <TeamPlayerIcon mr={[0, '4px']} />}
              <TrophyGoldIcon mr={[0, '4px']} />
              <Text fontSize="12px" color="textSubtle">
                + {userPointReward} {TranslateString(999, 'points')}
              </Text>
            </Flex>
          </Td>
          <Td>{canClaimNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
        </tr>
      </tbody>
    </StyledPrizeTable>
  )
}

export default UserPrizeGrid
