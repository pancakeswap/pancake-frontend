import { useTranslation } from '@pancakeswap/localization'
import { BlockIcon, CheckmarkCircleIcon, Flex, Text } from '@pancakeswap/uikit'

import { styled } from 'styled-components'
import { modPrizes } from '../../../../../config/constants/trading-competition/prizes'
import { BoldTd, StyledPrizeTable, Td } from '../../../components/StyledPrizeTable'
import AchievementPoints from '../../../components/YourScore/AchievementPoints'
import UserPrizeGridDollar from '../../../components/YourScore/UserPrizeGridDollar'
import { getRewardGroupAchievements, useModCompetitionRewards } from '../../../helpers'
import { UserTradingInformation } from '../../../types'
import { useCanClaimSpecialNFT } from '../../../useCanClaimSpecialNFT'

const StyledThead = styled.thead`
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const ModUserPrizeGrid: React.FC<React.PropsWithChildren<{ userTradingInformation?: UserTradingInformation }>> = ({
  userTradingInformation,
}) => {
  const { t } = useTranslation()
  const { userRewardGroup, userCakeRewards, userDarRewards, userPointReward, canClaimNFT } =
    userTradingInformation ?? {}
  const canClaimSpecialNFT = useCanClaimSpecialNFT()
  const { cakeReward, darReward, dollarValueOfTokensReward } = useModCompetitionRewards({
    userCakeRewards,
    userDarRewards,
  })

  const achievement = getRewardGroupAchievements(modPrizes, userRewardGroup, userPointReward)

  return (
    <StyledPrizeTable>
      <StyledThead>
        <tr>
          <th>{t('Token Prizes')}</th>
          <th>{t('Achievements')}</th>
          <th>{t('NFT')}</th>
          <th>{t('Bunny Helmet')}</th>
        </tr>
      </StyledThead>
      <tbody>
        <tr>
          <BoldTd>
            <Flex flexDirection="column">
              <Text bold>{cakeReward.toFixed(4)} CAKE</Text>
              <Text bold>{darReward.toFixed(4)} DAR</Text>
              <UserPrizeGridDollar dollarValueOfTokensReward={dollarValueOfTokensReward} />
            </Flex>
          </BoldTd>
          <Td>
            <AchievementPoints achievement={achievement} userPointReward={userPointReward} />
          </Td>
          <Td>{canClaimNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
          <Td>{canClaimSpecialNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
        </tr>
      </tbody>
    </StyledPrizeTable>
  )
}

export default ModUserPrizeGrid
