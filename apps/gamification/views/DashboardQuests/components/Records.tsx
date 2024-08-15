import { Box, Card, useMatchBreakpoints } from '@pancakeswap/uikit'
import { SpinnerWithLoadingText } from 'components/SpinnerWithLoadingText'
import { styled } from 'styled-components'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatusIndex } from 'views/DashboardQuestEdit/type'
import { Row } from 'views/DashboardQuests/components/Row'
import { TableHeader } from 'views/DashboardQuests/components/TableHeader'

const StyledRows = styled(Box)`
  > div {
    border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};

    &:last-child {
      border-bottom: 0;

      .dropdown {
        border-radius: ${({ theme }) => `0 0 ${theme.radii.card} ${theme.radii.card}`};
      }
    }
  }
`

interface RecordsProps {
  hasNextPage: boolean
  sentryRef: any
  isFetching: boolean
  questsData: SingleQuestData[]
  statusButtonIndex: CompletionStatusIndex
}

export const Records: React.FC<RecordsProps> = ({
  hasNextPage,
  sentryRef,
  isFetching,
  questsData,
  statusButtonIndex,
}) => {
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Box
      m="auto"
      width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}
      padding={['24px', '24px', '24px', '24px', '40px 24px 0 24px', '40px 24px 0 24px', '40px 0 0 0']}
    >
      <Card style={{ width: '100%', overflow: 'inherit' }}>
        {isDesktop && <TableHeader />}
        <StyledRows>
          {questsData?.map((quest) => (
            <Row key={quest.id} quest={quest} statusButtonIndex={statusButtonIndex} />
          ))}
        </StyledRows>
      </Card>
      <Box ref={hasNextPage ? sentryRef : undefined}>{isFetching && <SpinnerWithLoadingText />}</Box>
    </Box>
  )
}
