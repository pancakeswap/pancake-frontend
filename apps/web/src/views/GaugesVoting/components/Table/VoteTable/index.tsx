import { useTranslation } from '@pancakeswap/localization'
import { Button, Card, FlexGap } from '@pancakeswap/uikit'
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

export const VoteTable = () => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  return (
    <Card innerCardProps={{ padding: '32px' }} mt={32}>
      <TableHeader />
      <Scrollable expanded={expanded}>
        {new Array(15).fill(0).map((i) => (
          <TableRow key={i} />
        ))}
      </Scrollable>
      <ExpandRow text={t('Show all')} onCollapse={() => setExpanded(!expanded)} />

      <FlexGap gap="12px">
        <Button width="100%">+ Add Gauges (23)</Button>
        <Button width="100%">Submit vote</Button>
      </FlexGap>
    </Card>
  )
}
