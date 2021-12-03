import React, { useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import { Flex, Input, Text } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import isEmpty from 'lodash/isEmpty'
import { useGetNftActivityFilters } from 'state/nftMarket/hooks'
import { Collection } from 'state/nftMarket/types'
import { updateActivityPriceFilter } from 'state/nftMarket/reducer'
import { useTranslation } from 'contexts/Localization'
import ClearAllButton from './ClearAllButton'
import { ActivityFilter } from './ActivityFilter'
import { MarketEvent } from '../types/MarketEvent'

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
  collection: Collection
}

const ActivityFilters: React.FC<FiltersProps> = ({ collection }) => {
  const { address } = collection || { address: '' }
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [priceLower, setPriceLower] = useState('')

  const debouncedOnChangeDispatch = useMemo(
    () =>
      debounce((price: string) => {
        dispatch(
          updateActivityPriceFilter({
            collection: address,
            price,
          }),
        )
      }, 1000),
    [dispatch, address],
  )

  const nftActivityFilters = useGetNftActivityFilters(address)
  const nftActivityFiltersString = JSON.stringify(nftActivityFilters)

  useEffect(() => {
    const nftActivityFiltersParsed = JSON.parse(nftActivityFiltersString)
    setPriceLower(nftActivityFiltersParsed.priceFilter)
  }, [nftActivityFiltersString])

  return (
    <Container justifyContent="space-between" flexDirection={['column', 'column', 'row']}>
      <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
        {t('Filter by')}
      </Text>
      <ScrollableFlexContainer>
        {[MarketEvent.NEW, MarketEvent.CANCEL, MarketEvent.MODIFY, MarketEvent.SELL].map((eventType) => {
          return <ActivityFilter key={eventType} eventType={eventType} collectionAddress={address} />
        })}
      </ScrollableFlexContainer>
      <Flex>
        <Input
          scale="sm"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          placeholder={t('Price lower than (in BNB)')}
          value={priceLower}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            if (e.currentTarget.validity.valid) {
              const price = e.currentTarget.value.replace(/,/g, '.')
              setPriceLower(price)
              debouncedOnChangeDispatch(price)
            }
          }}
        />
      </Flex>
      {!isEmpty(nftActivityFilters.typeFilters) || nftActivityFilters.priceFilter ? (
        <ClearAllButton collectionAddress={address} />
      ) : null}
    </Container>
  )
}

export default ActivityFilters
