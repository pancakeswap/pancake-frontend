import { FlexGap } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
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
  pickedQuests: any
}

export const QuestList: React.FC<QuestListProps> = ({ pickedQuests }) => {
  return (
    <StyledFlexGap>
      {pickedQuests.map((quest: any) => (
        <Quest key={quest} isDraft hideClick />
      ))}
    </StyledFlexGap>
  )
}
