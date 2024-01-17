import { useTranslation } from '@pancakeswap/localization'
import { Flex, SortArrowIcon, Text, Th } from '@pancakeswap/uikit'
import { useState } from 'react'
import styled from 'styled-components'
import { SortButton } from 'views/V3Info/components/SortButton'
import { THeader } from '../styled'

const Touchable = styled(Flex)`
  cursor: pointer;
  white-space: nowrap;
  gap: 5px;
`

export enum SortField {
  Votes = 'weight',
  Boost = 'boostMultiplier',
}

export enum SortBy {
  Asc = 'asc',
  Desc = 'desc',
}

const getSortClassName = (sortBy: SortBy | undefined): string | undefined => {
  if (!sortBy) {
    return undefined
  }

  return sortBy === SortBy.Desc ? 'is-desc' : 'is-asc'
}

export const TableHeader: React.FC<{
  selectable?: boolean
  total?: number
  onSort?: (field: SortField, sortBy: SortBy) => void
}> = ({ onSort, selectable, total }) => {
  const { t } = useTranslation()
  const [voteSort, setVoteSort] = useState<SortBy | undefined>()
  const [boostSort, setBoostSort] = useState<SortBy | undefined>()

  const onVoteSort = () => {
    setBoostSort(undefined)
    const newSort = !voteSort ? SortBy.Desc : voteSort === SortBy.Asc ? SortBy.Desc : SortBy.Asc

    setVoteSort(newSort)
    onSort?.(SortField.Votes, newSort)
  }
  const onBoostSort = () => {
    setVoteSort(undefined)
    const newSort = !boostSort ? SortBy.Desc : boostSort === SortBy.Asc ? SortBy.Desc : SortBy.Asc

    setBoostSort(newSort)
    onSort?.(SortField.Boost, newSort)
  }

  return (
    <THeader>
      <Th style={{ textAlign: 'left' }}>
        <Text color="secondary" textTransform="uppercase" fontWeight={600} ml={selectable ? 44 : 0}>
          {t('gauges')}
          {total ? ` (${total})` : ''}
        </Text>
      </Th>
      <Th>
        <Touchable onClick={onVoteSort}>
          <Text color="secondary" textTransform="uppercase" fontWeight={600}>
            {t('votes')}
          </Text>
          <SortButton scale="sm" variant="subtle" className={getSortClassName(voteSort)}>
            <SortArrowIcon />
          </SortButton>
        </Touchable>
      </Th>
      <Th>
        <Touchable onClick={onBoostSort} justifyContent="center">
          <Text color="secondary" textTransform="uppercase" fontWeight={600}>
            {t('boost')}
          </Text>
          <SortButton scale="sm" variant="subtle" className={getSortClassName(boostSort)}>
            <SortArrowIcon />
          </SortButton>
        </Touchable>
      </Th>
      <Th>
        <Text color="secondary" textTransform="uppercase" fontWeight={600} textAlign="right">
          {t('caps')}
        </Text>
      </Th>
    </THeader>
  )
}
