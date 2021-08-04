import React from 'react'
import { Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { setLeaderboardFilter } from 'state/predictions'
import Select, { OptionProps } from 'components/Select/Select'
import Container from 'components/Layout/Container'

const Filters = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const orderByOptions = [
    { label: t('Net Winnings'), value: 'netBNB' },
    { label: t('Total Winnings'), value: 'totalBNB' },
    { label: t('Total Bets'), value: 'totalBets' },
    { label: t('Win Rate'), value: 'winRate' },
  ]

  const handleOrderBy = (option: OptionProps) => {
    dispatch(setLeaderboardFilter({ orderBy: option.value }))
  }

  return (
    <Container py="32px">
      <Text textTransform="uppercase" fontSize="12px" color="textSubtle" fontWeight="bold" mb="4px">
        {t('Rank By')}
      </Text>
      <Box display={['block', null, null, 'inline-block']}>
        <Select options={orderByOptions} onOptionChange={handleOrderBy} mb="16px" />
      </Box>
    </Container>
  )
}

export default Filters
