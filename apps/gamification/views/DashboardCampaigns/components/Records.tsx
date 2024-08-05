import { Box, Card, useMatchBreakpoints } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { TableHeader } from 'views/DashboardCampaigns/components/TableHeader'
import { TableRow } from 'views/DashboardCampaigns/components/TableRow'
import { CompletionStatusIndex } from 'views/DashboardQuestEdit/type'

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
  statusButtonIndex: CompletionStatusIndex
}

export const Records: React.FC<RecordsProps> = ({ statusButtonIndex }) => {
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
          <TableRow statusButtonIndex={statusButtonIndex} />
          {/* <TableRow />
          <TableRow /> */}
        </StyledRows>
      </Card>
    </Box>
  )
}
