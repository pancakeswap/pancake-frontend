import { Flex, Text, Select, OptionProps } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { useMemo, useCallback } from 'react'

import { useSortBy } from '../hooks'

export const FilterContainer = styled(Flex).attrs({
  alignItems: 'center',
})`
  width: 100%;
  padding: 0.5em 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

export function SortFilter() {
  const { t } = useTranslation()
  const [sortBy, setSortBy] = useSortBy()
  const options = useMemo(
    () => [
      {
        label: t('Hot'),
        value: 'hot',
      },
      {
        label: t('APR'),
        value: 'apr',
      },
      {
        label: t('Earned'),
        value: 'earned',
      },
      {
        label: t('Total staked'),
        value: 'totalStaked',
      },
      {
        label: t('Latest'),
        value: 'latest',
      },
    ],
    [t],
  )
  const selected = useMemo(() => {
    const index = options.findIndex((option) => option.value === sortBy)
    // FIXME weird design of Select component. Need further refactor
    return index >= 0 ? index + 1 : 0
  }, [options, sortBy])

  const handleSortOptionChange = useCallback((option: OptionProps) => setSortBy(option.value), [setSortBy])

  return (
    <LabelWrapper>
      <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
        {t('Sort by')}
      </Text>
      <ControlStretch>
        <Select defaultOptionIndex={selected} options={options} onOptionChange={handleSortOptionChange} />
      </ControlStretch>
    </LabelWrapper>
  )
}
