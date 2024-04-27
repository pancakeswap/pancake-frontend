import { useDelayedUnmount } from '@pancakeswap/hooks'
import { Box } from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import { Detail } from 'views/DashboardCampaigns/components/Detail'
import { Row } from 'views/DashboardCampaigns/components/Row'

export const TableRow = () => {
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  return (
    <Box>
      <Row toggleExpanded={toggleExpanded} expanded={expanded} />
      {shouldRenderActionPanel && <Detail />}
    </Box>
  )
}
