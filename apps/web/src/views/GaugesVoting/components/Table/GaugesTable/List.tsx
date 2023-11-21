import { SpaceProps } from 'styled-system'
import { Text, Flex, FlexGap, Tag, PaginationButton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { CSSProperties, useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'
import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/sdk'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'

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

type PaginationProps = {
  pagination?: boolean
  pageSize?: number
}

type ListProps = {
  totalGaugesWeight: number
  data?: GaugeVoting[]
  selectable?: boolean
  selectRows?: GaugeVoting[]
  onRowSelect?: (hash: GaugeVoting['hash']) => void
} & SpaceProps

export function GaugesList({
  pagination = true,
  pageSize = 5,
  data,
  totalGaugesWeight,
  selectable,
  selectRows,
  onRowSelect,
  ...props
}: ListProps & PaginationProps) {
  const [page, setPage] = useState(1)
  const maxPage = useMemo(() => (data && data.length ? Math.ceil(data.length / pageSize) : 1), [data, pageSize])

  useEffect(() => {
    if (pagination && maxPage > page) {
      setPage(1)
    }
  }, [pagination, maxPage])

  const dataDisplay = useMemo(
    () => (pagination ? data?.slice((page - 1) * pageSize, page * pageSize) : data),
    [data, page, pagination],
  )
  const list = dataDisplay?.map((item) => (
    <GaugeListItem key={`${item.hash}-${item.pid}`} data={item} totalGaugesWeight={totalGaugesWeight} />
  ))

  const paginationButton = pagination ? (
    <PaginationButton showMaxPageText maxPage={maxPage} currentPage={page} setCurrentPage={setPage} />
  ) : null

  return (
    <ListContainer {...props} flexDirection="column">
      {list}
      {paginationButton}
    </ListContainer>
  )
}

type ListItemProps = {
  display?: 'row' | 'card'
  data: GaugeVoting
  selectable?: boolean
  selected?: boolean
  onSelect?: (hash: GaugeVoting['hash']) => void
  totalGaugesWeight?: number
}

export function GaugeListItem({
  display = 'row',
  data,
  totalGaugesWeight,
  selected,
  selectable,
  onSelect,
}: ListItemProps) {
  const { t } = useTranslation()
  const percentWeight = useMemo(() => {
    return new Percent(data?.weight, totalGaugesWeight || 1).toSignificant(2)
  }, [data?.weight, totalGaugesWeight])
  const pool = useGaugeConfig(data?.pairAddress as Address, Number(data?.chainId || undefined))
  const percentCaps = useMemo(() => {
    return new Percent(data?.maxVoteCap, 10000).toSignificant(2)
  }, [data?.maxVoteCap])

  const weight = useMemo(() => {
    return getBalanceNumber(new BN(data?.weight || 0))
  }, [data?.weight])

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
      <FlexGap flexDirection="column" alignSelf="stretch" gap="0.5em">
        <Flex justifyContent="space-between" alignSelf="stretch">
          <Text>{t('Votes')}</Text>
          <Text>
            {formatLocalisedCompactNumber(weight, true)}({percentWeight}%)
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignSelf="stretch">
          <Text>{t('Boost')}</Text>
          <Text>{Number(data?.boostMultiplier / 100n)}x</Text>
        </Flex>
        <Flex justifyContent="space-between" alignSelf="stretch">
          <Text>{t('Caps')}</Text>
          <Text>{percentCaps}%</Text>
        </Flex>
      </FlexGap>
    </ListItemContainer>
  )
}
