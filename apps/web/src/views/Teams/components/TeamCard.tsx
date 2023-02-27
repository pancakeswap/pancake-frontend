import styled from 'styled-components'
import { Card, CardHeader, CardBody, CommunityIcon, Heading, PrizeIcon, Text, Skeleton } from '@pancakeswap/uikit'
import { FetchStatus } from 'config/constants/types'
import useSWR from 'swr'
import { getTeam } from 'state/teams/helpers'
import { useTranslation } from '@pancakeswap/localization'
import ComingSoon from './ComingSoon'
import IconStatBox from './IconStatBox'

interface TeamCardProps {
  id: string
}

const Wrapper = styled.div`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 24px;
  }
`

const Avatar = styled.img`
  border-radius: 50%;
  height: 64px;
  margin-top: -12px;
  width: 64px;
  border: solid 2px white;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 128px;
    margin-top: -24px;
    width: 128px;
  }
`

const AvatarWrap = styled.div`
  margin-bottom: 8px;
  text-align: center;
`

const StyledCard = styled(Card)`
  overflow: visible;
`

const StyledCardHeader = styled(CardHeader)<{ bg: string }>`
  position: relative;
  background: url(${({ bg }) => bg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding-top: 0;
  text-align: center;
`

const TeamName = styled(Heading).attrs({ as: 'h2' })`
  font-size: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
  }
`

const StatRow = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 32px;
  }
`

const TeamCard: React.FC<React.PropsWithChildren<TeamCardProps>> = ({ id }) => {
  const { t } = useTranslation()
  const idNumber = Number(id)
  const { data: team, status } = useSWR(['team', id], async () => getTeam(idNumber))

  return (
    <Wrapper>
      <StyledCard>
        <StyledCardHeader bg={`/images/teams/${team.background}`}>
          <AvatarWrap>
            <Avatar src={`/images/teams/${team.images.md}`} alt="team avatar" />
          </AvatarWrap>
          <TeamName color={team.textColor}>{team.name}</TeamName>
          <Text as="p" color={team.textColor}>
            {t(team.description)}
          </Text>
        </StyledCardHeader>
        <CardBody>
          <StatRow>
            {status !== FetchStatus.Fetched ? (
              <Skeleton width="100px" />
            ) : (
              <IconStatBox icon={CommunityIcon} title={team.users} subtitle={t('Active Members')} />
            )}
            <IconStatBox icon={PrizeIcon} title={t('Coming Soon')} subtitle={t('Team Points')} isDisabled />
          </StatRow>
          <Heading as="h3">{t('Team Achievements')}</Heading>
          <ComingSoon />
        </CardBody>
      </StyledCard>
    </Wrapper>
  )
}

export default TeamCard
