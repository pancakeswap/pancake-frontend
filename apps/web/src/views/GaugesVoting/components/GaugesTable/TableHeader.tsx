import { useTranslation } from '@pancakeswap/localization'
import { SortArrowIcon, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import styled from 'styled-components'
import { SortButton } from 'views/V3Info/components/SortButton'
import { THeader } from './styled'

const Touchable = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: start;
  gap: 5px;
`

export enum SortField {
  Votes = 'votes',
  Boost = 'boost',
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
  onSort?: (field: SortField, sortBy: SortBy) => void
}> = ({ onSort }) => {
  const { t } = useTranslation()
  const [voteSort, setVoteSort] = useState<SortBy | undefined>()
  const [boostSort, setBoostSort] = useState<SortBy | undefined>()

  const onVoteSort = () => {
    setBoostSort(undefined)
    if (!voteSort) {
      setVoteSort(SortBy.Asc)
    } else {
      setVoteSort((prev) => (prev === SortBy.Asc ? SortBy.Desc : SortBy.Asc))
    }
    onSort?.(SortField.Votes, voteSort!)
  }
  const onBoostSort = () => {
    setVoteSort(undefined)
    if (!boostSort) {
      setBoostSort(SortBy.Asc)
    } else {
      setBoostSort((prev) => (prev === SortBy.Asc ? SortBy.Desc : SortBy.Asc))
    }
    onSort?.(SortField.Votes, boostSort!)
  }

  return (
    <THeader>
      <Text color="secondary" textTransform="uppercase" fontWeight={600}>
        {t('gauges')}
      </Text>
      <Touchable>
        <Text color="secondary" textTransform="uppercase" fontWeight={600}>
          {t('votes')}
        </Text>
        <SortButton scale="sm" variant="subtle" onClick={onVoteSort} className={getSortClassName(voteSort)}>
          <SortArrowIcon />
        </SortButton>
      </Touchable>
      <Touchable>
        <Text color="secondary" textTransform="uppercase" fontWeight={600}>
          {t('boost')}
        </Text>
        <SortButton scale="sm" variant="subtle" onClick={onBoostSort} className={getSortClassName(boostSort)}>
          <SortArrowIcon />
        </SortButton>
      </Touchable>
      <Text color="secondary" textTransform="uppercase" fontWeight={600} textAlign="right">
        {t('caps')}
      </Text>
    </THeader>
  )
}
