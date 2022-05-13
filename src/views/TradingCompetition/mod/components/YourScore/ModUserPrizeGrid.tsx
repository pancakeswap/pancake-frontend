import { BlockIcon, CheckmarkCircleIcon, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import styled from 'styled-components'
import { getRewardGroupAchievements, useCompetitionRewards } from '../../../helpers'
import { UserTradingInformationProps } from '../../../types'
import { BoldTd, StyledPrizeTable, Td } from '../../../components/StyledPrizeTable'
import { mboxPrizes } from '../../../../../config/constants/trading-competition/prizes'
import UserPrizeGridDollar from '../../../components/YourScore/UserPrizeGridDollar'
import AchievementPoints from '../../../components/YourScore/AchievementPoints'

const StyledThead = styled.thead`
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const ModUserPrizeGrid: React.FC<{ userTradingInformation?: UserTradingInformationProps }> = ({
  userTradingInformation,
}) => {
  const { t } = useTranslation()
  const { userRewardGroup, userCakeRewards, userMoboxRewards, userPointReward, canClaimMysteryBox, canClaimNFT } =
    userTradingInformation
  const { cakeReward, moboxReward, dollarValueOfTokensReward } = useCompetitionRewards({
    userCakeRewards,
    userMoboxRewards,
  })

  const achievement = getRewardGroupAchievements(mboxPrizes, userRewardGroup, userPointReward)

  return (
    <StyledPrizeTable>
      <StyledThead>
        <tr>
          <th>{t('Token Prizes')}</th>
          <th>{t('Achievements')}</th>
          <th>{t('NFT')}</th>
          <th>{t('Mystery Box')}</th>
        </tr>
      </StyledThead>
      <tbody>
        <tr>
          <BoldTd>
            <Flex flexDirection="column">
              <Text bold>{cakeReward.toFixed(4)} CAKE</Text>
              <Text bold>{moboxReward.toFixed(4)} MBOX</Text>
              <UserPrizeGridDollar dollarValueOfTokensReward={dollarValueOfTokensReward} />
            </Flex>
          </BoldTd>
          <Td>
            <AchievementPoints achievement={achievement} userPointReward={userPointReward} />
          </Td>
          <Td>{canClaimNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
          <Td>{canClaimMysteryBox ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
        </tr>
      </tbody>
    </StyledPrizeTable>
  )
}

export default ModUserPrizeGrid
