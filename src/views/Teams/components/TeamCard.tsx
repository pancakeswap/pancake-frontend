import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, CommunityIcon, Heading, PrizeIcon } from '@pancakeswap-libs/uikit'
import { Team } from 'config/constants/types'
import CardHeader from 'views/Profile/components/CardHeader'
import useI18n from 'hooks/useI18n'
import ComingSoon from 'views/Profile/components/ComingSoon'
import StatBox from 'views/Profile/components/StatBox'

interface TeamCardProps {
  team: Team
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

const StyledCardHeader = styled(CardHeader)`
  border-radius: 32px 32px 0 0;
  padding-top: 0;
  text-align: center;
`

const TeamName = styled(Heading).attrs({ as: 'h1' })`
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

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <StyledCard>
        <StyledCardHeader>
          <AvatarWrap>
            <Avatar src="/images/nfts/onsen-preview.png" alt="team avatar" />
          </AvatarWrap>
          <TeamName>{team.name}</TeamName>
        </StyledCardHeader>
        <CardBody>
          <StatRow>
            <StatBox icon={CommunityIcon} title={team.users} subtitle={TranslateString(999, 'Active Members')} />
            <StatBox
              icon={PrizeIcon}
              title={TranslateString(999, 'Coming Soon')}
              subtitle={TranslateString(999, 'Team Points')}
              isDisabled
            />
          </StatRow>
          <Heading>{TranslateString(999, 'Team Achievements')}</Heading>
          <ComingSoon />
        </CardBody>
      </StyledCard>
    </Wrapper>
  )
}

export default TeamCard
