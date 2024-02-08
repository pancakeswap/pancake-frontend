import { Gauge } from '@pancakeswap/gauges'
import { AutoColumn, Skeleton } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import uniqBy from 'lodash/uniqBy'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { SpaceProps, space } from 'styled-system'
import { SortBy, SortField, TableHeader } from './TableHeader'
import { ExpandRow, TableRow } from './TableRow'
import { RowData } from './types'

const Table = styled.table`
  width: 100%;

  ${space}
`

export * from './List'

const ROW_HEIGHT = 70

export const GaugesTable: React.FC<
  {
    maxHeight?: number | string
    totalGaugesWeight: number
    data?: Gauge[]
    isLoading?: boolean
    selectable?: boolean
    selectRows?: Array<RowData>
    onRowSelect?: (hash: Gauge['hash']) => void
  } & SpaceProps
> = ({ maxHeight, data, isLoading, totalGaugesWeight, selectable, selectRows, onRowSelect, ...props }) => {
  const [expanded, setExpanded] = useState(false)
  const [sortKey, setSortKey] = useState<SortField | undefined>()
  const [sortBy, setSortBy] = useState<SortBy | undefined>()
  const sortedData = useMemo(() => {
    if (!data) return []
    if (!sortKey || !sortBy) return orderBy(uniqBy(data, 'hash'), ['gid'], ['asc'])

    return orderBy(uniqBy(data, 'hash'), [sortKey], [sortBy])
  }, [data, sortBy, sortKey])

  const handleSort = (key: SortField, by: SortBy) => {
    setSortKey(key)
    setSortBy(by)
  }

  const Row = useCallback(
    ({ data: rows, index, style }): ReactNode => {
      const row = rows[index]
      return (
        <TableRow
          style={style}
          data={row}
          locked={selectRows?.find((r) => r.hash === row.hash)?.locked}
          selectable={selectable}
          selected={selectRows?.some((r) => r.hash === row.hash)}
          onSelect={onRowSelect}
          totalGaugesWeight={totalGaugesWeight}
        />
      )
    },
    [onRowSelect, selectRows, selectable, totalGaugesWeight],
  )

  const itemKey = useCallback((index: number, row: Gauge[]) => row[index].hash, [])
  const expandHeight = useMemo(
    () => (typeof maxHeight !== 'undefined' ? maxHeight : ROW_HEIGHT * sortedData.length),
    [sortedData.length, maxHeight],
  )

  return (
    <Table {...props}>
      <TableHeader onSort={handleSort} selectable={selectable} total={sortedData.length} />
      {isLoading ? (
        <AutoColumn gap="16px" py="16px">
          <Skeleton height={64} />
          <Skeleton height={64} />
          <Skeleton height={64} />
        </AutoColumn>
      ) : (
        <div>
          <FixedSizeList
            itemData={sortedData ?? []}
            itemCount={sortedData.length}
            itemKey={itemKey}
            itemSize={ROW_HEIGHT}
            height={expanded ? expandHeight : 210}
            width="100%"
          >
            {Row}
          </FixedSizeList>
          <ExpandRow onCollapse={() => setExpanded(!expanded)} />
        </div>
      )}
    </Table>
  )
}
