import { FlexGap } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { Quest } from 'views/Quests/components/Quest'

const StyledFlexGap = styled(FlexGap)`
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;

  > div {
    width: 100%;
    margin: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > div {
      width: calc(50% - 8px);
      margin: 0;
    }
  }
`

interface QuestListProps {
  pickedQuests: SingleQuestData[]
}

export const QuestList: React.FC<QuestListProps> = ({ pickedQuests }) => {
  return (
    <StyledFlexGap>
      {pickedQuests.map((quest: SingleQuestData) => (
        <Quest key={quest.id} quest={quest} hideClick />
      ))}
    </StyledFlexGap>
  )
}
