import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import Card from './Card'

interface Achievement {
  image: string
  title: string
}

interface AchievementRowProps {
  achievement: Achievement
}

const StyledAchievementRow = styled(Flex)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding-bottom: 16px;
  padding-top: 16px;
`

const AchievementRow: React.FC<AchievementRowProps> = ({ achievement }) => {
  return (
    <StyledAchievementRow>
      <Card image={achievement.image} title={achievement.title} />
    </StyledAchievementRow>
  )
}

export default AchievementRow
