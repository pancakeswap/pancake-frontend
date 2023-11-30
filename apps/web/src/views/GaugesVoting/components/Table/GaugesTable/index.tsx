import { Gauge } from '@pancakeswap/gauges'
import { AutoColumn, Skeleton } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import uniqBy from 'lodash/uniqBy'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { SpaceProps, space } from 'styled-system'
import { SortBy, SortField, TableHeader } from './TableHeader'
import { ExpandRow, TableRow } from './TableRow'
import { RowData } from './types'

const Scrollable = styled.div.withConfig({ shouldForwardProp: (prop) => !['expanded'].includes(prop) })<{
  expanded: boolean
}>`
  overflow-y: auto;
  height: ${({ expanded }) => (expanded ? 'auto' : '192px')};
`

const Table = styled.table`
  width: 100%;

  ${space}
`

export * from './List'

export const GaugesTable: React.FC<
  {
    scrollStyle?: React.CSSProperties
    totalGaugesWeight: number
    data?: Gauge[]
    isLoading?: boolean
    selectable?: boolean
    selectRows?: Array<RowData>
    onRowSelect?: (hash: Gauge['hash']) => void
  } & SpaceProps
> = ({ scrollStyle, data, isLoading, totalGaugesWeight, selectable, selectRows, onRowSelect, ...props }) => {
  const [expanded, setExpanded] = useState(false)
  const [sortKey, setSortKey] = useState<SortField | undefined>()
  const [sortBy, setSortBy] = useState<SortBy | undefined>()
  const sortedData = useMemo(() => {
    if (!data) return []
    if (!sortKey || !sortBy) return uniqBy(data, 'hash')

    return orderBy(uniqBy(data, 'hash'), [sortKey], [sortBy])
  }, [data, sortBy, sortKey])

  const handleSort = (key: SortField, by: SortBy) => {
    setSortKey(key)
    setSortBy(by)
  }

  return (
    <Table {...props}>
      <TableHeader onSort={handleSort} selectable={selectable} />
      {isLoading ? (
        <AutoColumn gap="16px" py="16px">
          <Skeleton height={64} />
          <Skeleton height={64} />
          <Skeleton height={64} />
        </AutoColumn>
      ) : (
        <tbody>
          <Scrollable expanded={expanded} style={scrollStyle}>
            {sortedData?.map((row) => (
              <TableRow
                key={`${row.hash}-${row.pid}`}
                data={row}
                locked={selectRows?.find((r) => r.hash === row.hash)?.locked}
                selectable={selectable}
                selected={selectRows?.some((r) => r.hash === row.hash)}
                onSelect={onRowSelect}
                totalGaugesWeight={totalGaugesWeight}
              />
            ))}
          </Scrollable>
          <ExpandRow onCollapse={() => setExpanded(!expanded)} />
        </tbody>
      )}
    </Table>
  )
}
