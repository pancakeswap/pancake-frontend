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
import easterPrizes from 'config/constants/trading-competition/easter'
import { UserTradingInformationProps } from '../../types'
import { UseCompetitionCakeRewards, getRewardGroupAchievements } from '../../helpers'

const Td = styled.td`
  padding: 4px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 8px;
  }
`
const BoldTd = styled(Td)`
  font-weight: 600;
`

const PrizeTable = styled.table`
  width: 100%;

  thead {
    border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
  }

  th,
  td {
    text-align: center;
    vertical-align: middle;
  }

  & > thead th {
    font-size: 12px;
    padding: 16px 0;
    text-transform: uppercase;

    ${({ theme }) => theme.mediaQueries.xs} {
      padding: 16px 8px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      padding: 16px;
    }
  }
`

const UserPrizeGrid: React.FC<{ userTradingInformation?: UserTradingInformationProps }> = ({
  userTradingInformation,
}) => {
  const TranslateString = useI18n()
  const { userRewardGroup, userCakeRewards, userPointReward, canClaimNFT } = userTradingInformation
  const { cakeReward, dollarValueOfCakeReward } = UseCompetitionCakeRewards(userCakeRewards)
  const { champion, teamPlayer } = getRewardGroupAchievements(userRewardGroup)

  return (
    <PrizeTable>
      <thead>
        <tr>
          <th>{TranslateString(999, 'CAKE Prizes ')}</th>
          <th>{TranslateString(1092, 'Achievements')}</th>
          <th>{TranslateString(999, 'NFT')}</th>
        </tr>
      </thead>
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
    </PrizeTable>
  )
}

export default UserPrizeGrid
