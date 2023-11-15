import { useState } from 'react'
import styled from 'styled-components'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { TableHeader } from './TableHeader'
import { ExpandRow, TableRow } from './TableRow'

const Scrollable = styled.div.withConfig({ shouldForwardProp: (prop) => !['expanded'].includes(prop) })<{
  expanded: boolean
}>`
  overflow-y: auto;
  height: ${({ expanded }) => (expanded ? 'auto' : '192px')};
`

export const GaugesTable: React.FC<{
  scrollStyle?: React.CSSProperties
  totalGauges: number
  data?: GaugeVoting[]
}> = ({ scrollStyle, data, totalGauges }) => {
  const [expanded, setExpanded] = useState(false)
  console.debug('debug table', data)
  return (
    <>
      <TableHeader />
      <Scrollable expanded={expanded} style={scrollStyle}>
        {data?.map((row) => (
          <TableRow key={row.hash} data={row} totalGauges={totalGauges} />
        ))}
      </Scrollable>
      <ExpandRow onCollapse={() => setExpanded(!expanded)} />
    </>
  )
}
