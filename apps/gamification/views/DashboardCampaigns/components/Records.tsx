import { Box, Card, useMatchBreakpoints } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { TableHeader } from 'views/DashboardCampaigns/components/TableHeader'
import { TableRow } from 'views/DashboardCampaigns/components/TableRow'

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

export const Records = () => {
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
          <TableRow />
          {/* <TableRow />
          <TableRow /> */}
        </StyledRows>
      </Card>
    </Box>
  )
}
