import { Box, PageSection } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
import { TeamRanksProps } from '../types'
import RibbonWithImage from './RibbonWithImage'
import TeamRanks from './TeamRanks/TeamRanks'
import RanksIcon from '../svgs/RanksIcon'

const TeamRanksSection: React.FC<React.PropsWithChildren<TeamRanksProps>> = ({
  image,
  team1LeaderboardInformation,
  team2LeaderboardInformation,
  team3LeaderboardInformation,
  globalLeaderboardInformation,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <>
      <PageSection
        containerProps={{ style: { marginTop: '-20px' } }}
        index={3}
        concaveDivider
        clipFill={{ light: theme.colors.background }}
        dividerPosition="top"
        dividerComponent={
          <RibbonWithImage imageComponent={<RanksIcon width="175px" />} ribbonDirection="up">
            {t('Team Ranks')}
          </RibbonWithImage>
        }
      >
        <Box my="64px">
          <TeamRanks
            team1LeaderboardInformation={team1LeaderboardInformation}
            team2LeaderboardInformation={team2LeaderboardInformation}
            team3LeaderboardInformation={team3LeaderboardInformation}
            globalLeaderboardInformation={globalLeaderboardInformation}
            image={image}
          />
        </Box>
      </PageSection>
    </>
  )
}

export default TeamRanksSection
