import styled from 'styled-components'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { setLeaderboardFilter } from 'state/predictions'
import Select, { OptionProps } from 'components/Select/Select'
import Container from 'components/Layout/Container'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import AddressSearch from '../AddressSearch'

const SearchWrapper = styled(Box)`
  margin-bottom: 8px;
  order: 1;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 0;
    order: 2;
    width: 320px;
  }
`
const FilterWrapper = styled(Box)`
  order: 2;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 1;
    width: auto;
  }
`

const Filters = () => {
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()
  const { token } = useConfig()

  const orderByOptions = [
    { label: t('Net Winnings'), value: `net${token.symbol}` },
    { label: t('Total %symbol%', { symbol: token.symbol }), value: `total${token.symbol}` },
    { label: t('Rounds Played'), value: 'totalBets' },
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
      <Flex
        flexDirection={['column', null, null, null, null, 'row']}
        alignItems={['start', null, null, null, null, 'center']}
        justifyContent={['start', null, null, null, null, 'space-between']}
      >
        <FilterWrapper>
          <Select options={orderByOptions} onOptionChange={handleOrderBy} />
        </FilterWrapper>
        <SearchWrapper>
          <AddressSearch />
        </SearchWrapper>
      </Flex>
    </Container>
  )
}

export default Filters
