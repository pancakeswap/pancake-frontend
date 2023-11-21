import { SpaceProps } from 'styled-system'
import { Text, Flex, FlexGap, Tag, PaginationButton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { CSSProperties, useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'

import { GAUGE_TYPE_NAMES, GaugeType } from 'config/constants/types'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useGaugeConfig } from 'views/GaugesVoting/hooks/useGaugePair'
import { feeTierPercent } from 'views/V3Info/utils'

import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'

const ListContainer = styled(Flex)`
  margin-left: -32px;
  margin-right: -32px;
`

const ListItemContainer = styled(FlexGap)`
  padding: 0.875em;
  border-bottom: 1px solid ${(props) => props.theme.colors.cardBorder};
`

type ListProps = {
  pageSize?: number
  scrollStyle?: CSSProperties
  totalGaugesWeight: number
  data?: GaugeVoting[]
  selectable?: boolean
  selectRows?: GaugeVoting[]
  onRowSelect?: (hash: GaugeVoting['hash']) => void
} & SpaceProps

export function GaugesList({
  pageSize = 5,
  scrollStyle,
  data,
  totalGaugesWeight,
  selectable,
  selectRows,
  onRowSelect,
  ...props
}: ListProps) {
  const [page, setPage] = useState(1)
  const maxPage = useMemo(() => (data && data.length ? Math.ceil(data.length / pageSize) : 1), [data, pageSize])

  useEffect(() => {
    if (maxPage > page) {
      setPage(1)
    }
  }, [maxPage])

  const dataDisplay = useMemo(() => data?.slice((page - 1) * pageSize, page * pageSize), [data, page])
  const list = dataDisplay?.map((item) => <ListItem key={item.pid} data={item} />)

  return (
    <ListContainer {...props} flexDirection="column">
      {list}
      <PaginationButton showMaxPageText maxPage={maxPage} currentPage={page} setCurrentPage={setPage} />
    </ListContainer>
  )
}

type ListItemProps = {
  data: GaugeVoting
  selectable?: boolean
  selected?: boolean
  onSelect?: (hash: GaugeVoting['hash']) => void
  totalGaugesWeight?: number
}

export function ListItem({ data, totalGaugesWeight, selected, selectable, onSelect }: ListItemProps) {
  const pool = useGaugeConfig(data?.pairAddress as Address, Number(data?.chainId || undefined))

  return (
    <ListItemContainer gap="1em" flexDirection="column">
      <Flex justifyContent="space-between" flex="1">
        <FlexGap gap="0.25em" flexWrap="wrap">
          <GaugeTokenImage gauge={pool} size={24} />
          <Text fontWeight={600} fontSize={16}>
            {pool?.pairName}
          </Text>
        </FlexGap>
        <FlexGap gap="0.25em" justifyContent="flex-end" flexWrap="wrap">
          <NetworkBadge chainId={Number(data?.chainId)} scale="sm" />
          {pool?.type === GaugeType.V3 ? (
            <Tag outline variant="secondary" scale="sm">
              {feeTierPercent(pool.feeTier)}
            </Tag>
          ) : null}
          <Tag variant="secondary" scale="sm">
            {pool ? GAUGE_TYPE_NAMES[pool.type] : ''}
          </Tag>
        </FlexGap>
      </Flex>
    </ListItemContainer>
  )
}
