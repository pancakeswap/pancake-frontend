import { useState } from 'react'
import styled from 'styled-components'
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
}> = ({ scrollStyle }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <TableHeader />
      <Scrollable expanded={expanded} style={scrollStyle}>
        {new Array(15).fill(0).map((i) => (
          <TableRow key={i} />
        ))}
      </Scrollable>
      <ExpandRow onCollapse={() => setExpanded(!expanded)} />
    </>
  )
}
