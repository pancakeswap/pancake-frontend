import styled, { DefaultTheme } from 'styled-components'
import Link from 'next/link'
import { Button, Card, CommunityIcon, Flex, Heading, PrizeIcon, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Team } from 'config/constants/types'

interface TeamCardProps {
  rank: number
  team: Team
}

const getBackground = (theme: DefaultTheme) => {
  if (theme.isDark) {
    return 'linear-gradient(139.73deg, #142339 0%, #24243D 47.4%, #37273F 100%)'
  }

  return 'linear-gradient(139.73deg, #E6FDFF 0%, #EFF4F5 46.87%, #F3EFFF 100%)'
}

const TeamRank = styled.div`
  align-self: stretch;
  background: ${({ theme }) => getBackground(theme)};
  flex: none;
  padding: 16px 0;
  text-align: center;
  width: 56px;
`

const Body = styled.div`
  align-items: start;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: center;
    flex-direction: row;
    font-size: 40px;
  }
`

const Info = styled.div`
  flex: 1;
`

const Avatar = styled.img`
  border-radius: 50%;
`

const TeamName = styled(Heading).attrs({ as: 'h3' })`
  font-size: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
  }
`

const MobileAvatar = styled.div`
  flex: none;
  margin-right: 8px;

  ${Avatar} {
    height: 64px;
    width: 64px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const DesktopAvatar = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
    margin-left: 24px;

    ${Avatar} {
      height: 128px;
      width: 128px;
    }
  }
`

const StyledTeamCard = styled(Card)`
  margin-bottom: 16px;
`

const TeamCard: React.FC<React.PropsWithChildren<TeamCardProps>> = ({ rank, team }) => {
  const { t } = useTranslation()
  const avatar = <Avatar src={`/images/teams/${team.images.md}`} alt="team avatar" />

  return (
    <StyledTeamCard id={`team-${team.id}`}>
      <Flex>
        <TeamRank>
          <Text bold fontSize="24px">
            {rank}
          </Text>
        </TeamRank>
        <Body>
          <Info>
            <Flex alignItems="center" mb="16px">
              <MobileAvatar>{avatar}</MobileAvatar>
              <TeamName>{team.name}</TeamName>
            </Flex>
            <Text as="p" color="textSubtle" pr="24px" mb="16px">
              {t(team.description)}
            </Text>
            <Flex>
              <Flex>
                {/* alignSelf for Safari fix */}
                <PrizeIcon width="24px" mr="8px" style={{ alignSelf: 'center' }} color="textDisabled" />
                <Text fontSize="24px" bold color="textDisabled">
                  {t('Coming Soon')}
                </Text>
              </Flex>
              <Flex ml="24px">
                {/* alignSelf for Safari fix */}
                <CommunityIcon width="24px" mr="8px" style={{ alignSelf: 'center' }} />
                <Text fontSize="24px" bold>
                  {team.users}
                </Text>
              </Flex>
            </Flex>
          </Info>
          <Link href={`/teams/${team?.id}`} passHref>
            <Button variant="secondary" scale="sm">
              {t('See More')}
            </Button>
          </Link>
          <DesktopAvatar>{avatar}</DesktopAvatar>
        </Body>
      </Flex>
    </StyledTeamCard>
  )
}

export default TeamCard
