import { useTranslation } from '@pancakeswap/localization'
import { Text, AutoRow, SearchInput, Select } from '@pancakeswap/uikit'
import { FilterContainer, LabelWrapper } from 'views/Notifications/styles'

const NotificationsFilter = () => {
  const { t } = useTranslation()
  return (
    <AutoRow marginBottom="32px">
      <FilterContainer>
        <LabelWrapper style={{ width: '85px' }}>
          <Text textTransform="uppercase">{t('All')}</Text>
          <Select
            options={[
              {
                label: t('All'),
                value: 'all',
              },
              {
                label: t('Farms'),
                value: 'farms',
              },
              {
                label: t('LP'),
                value: 'lp',
              },
            ]}
            onOptionChange={() => null}
          />
        </LabelWrapper>
        <LabelWrapper style={{ marginLeft: 16, width: '85px' }}>
          <Text textTransform="uppercase">{t('Search')}</Text>
          <SearchInput initialValue="normalizedUrlSearch" onChange={() => null} placeholder="Search Farms" />
        </LabelWrapper>
      </FilterContainer>
    </AutoRow>
  )
}

export default NotificationsFilter
