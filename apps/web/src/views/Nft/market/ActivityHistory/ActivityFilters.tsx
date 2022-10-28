import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import isEmpty from 'lodash/isEmpty'
import { MarketEvent } from 'state/nftMarket/types'
import styled from 'styled-components'
import { ListCollectionFilter } from '../components/Filters/ListCollectionFilter'
import { ActivityFilter } from './ActivityFilter'
import ClearAllButton from './ClearAllButton'

export const Container = styled(Flex)`
  gap: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    align-items: center;
    flex-grow: 2;
  }
`

const ScrollableFlexContainer = styled(Flex)`
  align-items: center;
  flex: 1;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: wrap;
    overflow-x: revert;
  }
`

interface FiltersProps {
  address: string
  nftActivityFilters: { typeFilters: MarketEvent[]; collectionFilters: string[] }
}

const ActivityFilters: React.FC<React.PropsWithChildren<FiltersProps>> = ({ address, nftActivityFilters }) => {
  const { t } = useTranslation()

  return (
    <Container justifyContent="space-between" flexDirection={['column', 'column', 'row']}>
      <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
        {t('Filter by')}
      </Text>
      <ScrollableFlexContainer>
        {address === '' && <ListCollectionFilter nftActivityFilters={nftActivityFilters} />}
        {[MarketEvent.NEW, MarketEvent.CANCEL, MarketEvent.MODIFY, MarketEvent.SELL].map((eventType) => {
          return (
            <ActivityFilter
              key={eventType}
              eventType={eventType}
              collectionAddress={address}
              nftActivityFilters={nftActivityFilters}
            />
          )
        })}
      </ScrollableFlexContainer>
      {!isEmpty(nftActivityFilters.typeFilters) || !isEmpty(nftActivityFilters.collectionFilters) ? (
        <ClearAllButton collectionAddress={address} />
      ) : null}
    </Container>
  )
}

export default ActivityFilters
