import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { setLeaderboardFilter } from 'state/predictions'
import { useGetLeaderboardFilters } from 'state/predictions/hooks'

const TimePeriodFilter = () => {
  const { t } = useTranslation()
  const { timePeriod } = useGetLeaderboardFilters()
  const dispatch = useAppDispatch()

  const timePeriodOptions = [
    { label: t('%num%d', { num: 1 }), value: '1d' },
    { label: t('%num%d', { num: 7 }), value: '7d' },
    { label: t('%num%m', { num: 1 }), value: '1m' },
    { label: t('All'), value: 'all' },
  ]
  const activeIndex = timePeriodOptions.findIndex(({ value }) => value === timePeriod)

  const handleSetTimePeriod = (newIndex: number) => {
    dispatch(setLeaderboardFilter({ timePeriod: timePeriodOptions[newIndex].value }))
  }

  return (
    <ButtonMenu scale="sm" variant="subtle" activeIndex={activeIndex} onItemClick={handleSetTimePeriod} fullWidth>
      {timePeriodOptions.map(({ label, value }) => (
        <ButtonMenuItem key={value}>{label.toUpperCase()}</ButtonMenuItem>
      ))}
    </ButtonMenu>
  )
}

export default TimePeriodFilter
