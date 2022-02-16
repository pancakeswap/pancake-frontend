import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import orderBy from 'lodash/orderBy'
import {
  Box,
  Text,
  Flex,
  InlineMenu,
  CloseIcon,
  InputGroup,
  SearchIcon,
  Input,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { Collection } from 'state/nftMarket/types'
import { useGetCollections, useGetNftActivityFilters } from 'state/nftMarket/hooks'
import {
  addActivityCollectionFilters,
  removeActivityCollectionFilters,
  removeAllActivityCollectionFilters,
} from 'state/nftMarket/reducer'
import { useTranslation } from 'contexts/Localization'
import { CloseButton, FilterButton, ListOrderState, SearchWrapper, TriggerButton } from '../ListFilter/styles'
import { CollectionItemRow } from './styles'

export const ListCollectionFilter: React.FC = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [orderState, setOrderState] = useState<ListOrderState>({ orderKey: 'label', orderDir: 'asc' })
  const { data: collections } = useGetCollections()
  const wrapperRef = useRef(null)
  const menuRef = useRef(null)
  const dispatch = useAppDispatch()

  const { orderKey, orderDir } = orderState
  const nftActivityFilters = useGetNftActivityFilters('')
  const isAnyCollectionSelected = nftActivityFilters.collectionFilters.length > 0

  const filteredCollections = (
    query && query.length > 1
      ? Object.values(collections).filter((item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      : Object.values(collections)
  ).map((item) => {
    const isItemSelected = nftActivityFilters.collectionFilters.some((collectionAddress) => {
      return item.address.toLowerCase() === collectionAddress.toLowerCase()
    })
    return { ...item, isSelected: isItemSelected }
  })

  const handleClearFilter = () => {
    dispatch(removeAllActivityCollectionFilters())
  }

  const handleMenuClick = () => setIsOpen(!isOpen)

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    setQuery(value)
  }

  const handleItemClick = (evt: ChangeEvent<HTMLInputElement>, collection: Collection) => {
    if (evt.target.checked) {
      dispatch(addActivityCollectionFilters({ collection: collection.address.toLowerCase() }))
    } else {
      dispatch(removeActivityCollectionFilters({ collection: collection.address.toLowerCase() }))
    }
  }

  const toggleSort = (newOrderKey: string) => () => {
    setOrderState((prevOrderDir) => {
      if (prevOrderDir.orderKey !== newOrderKey) {
        return {
          orderKey: newOrderKey,
          orderDir: 'asc',
        }
      }

      return {
        orderKey: newOrderKey,
        orderDir: prevOrderDir.orderDir === 'asc' ? 'desc' : 'asc',
      }
    })
  }

  // @TODO Fix this in the Toolkit
  // This is a fix to ensure the "isOpen" value is aligned with the menus's (to avoid a double click)
  useEffect(() => {
    const handleClickOutside = ({ target }: Event) => {
      if (
        wrapperRef.current &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !wrapperRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [setIsOpen, wrapperRef, menuRef])

  return (
    <Flex alignItems="center" mr="4px" mb="4px">
      <Box ref={wrapperRef}>
        <InlineMenu
          component={
            <TriggerButton
              onClick={handleMenuClick}
              variant={isAnyCollectionSelected ? 'subtle' : 'light'}
              scale="sm"
              hasItem={isAnyCollectionSelected}
            >
              {t('Collection')}
            </TriggerButton>
          }
          isOpen={isOpen}
          options={{ placement: 'bottom' }}
        >
          <Box maxWidth="375px" ref={menuRef}>
            <SearchWrapper alignItems="center" p="16px">
              <InputGroup startIcon={<SearchIcon color="textSubtle" />}>
                <Input name="query" placeholder={t('Search')} onChange={handleChange} value={query} />
              </InputGroup>
            </SearchWrapper>
            <Flex alignItems="center" p="16px">
              <FilterButton onClick={toggleSort('name')} style={{ flex: 1 }}>
                <Text fontSize="12px" color="secondary" fontWeight="bold" textTransform="uppercase">
                  {t('Name')}
                </Text>
                <Box width="18px">
                  {orderKey === 'name' && orderDir === 'asc' && <ArrowUpIcon width="18px" color="secondary" />}
                  {orderKey === 'name' && orderDir === 'desc' && <ArrowDownIcon width="18px" color="secondary" />}
                </Box>
              </FilterButton>
              <FilterButton onClick={toggleSort('isSelected')}>
                <Text fontSize="12px" color="secondary" fontWeight="bold" textTransform="uppercase">
                  {t('Filter')}
                </Text>
                <Box width="18px">
                  {orderKey === 'isSelected' && orderDir === 'asc' && <ArrowUpIcon width="18px" color="secondary" />}
                  {orderKey === 'isSelected' && orderDir === 'desc' && <ArrowDownIcon width="18px" color="secondary" />}
                </Box>
              </FilterButton>
            </Flex>
            <Box height="240px" overflowY="auto">
              {filteredCollections.length > 0 ? (
                orderBy(filteredCollections, orderKey, orderDir).map((collection) => {
                  const handleClick = (evt: ChangeEvent<HTMLInputElement>) => handleItemClick(evt, collection)

                  return (
                    <CollectionItemRow
                      key={collection.address}
                      item={{ label: collection.name, collectionAddress: collection.address }}
                      isSelected={collection.isSelected}
                      onClick={handleClick}
                    />
                  )
                })
              ) : (
                <Flex alignItems="center" justifyContent="center" height="230px">
                  <Text color="textDisabled" textAlign="center">
                    {t('No results found')}
                  </Text>
                </Flex>
              )}
            </Box>
          </Box>
        </InlineMenu>
      </Box>
      {isAnyCollectionSelected && (
        <CloseButton variant={isAnyCollectionSelected ? 'subtle' : 'light'} scale="sm" onClick={handleClearFilter}>
          <CloseIcon color="currentColor" width="18px" />
        </CloseButton>
      )}
    </Flex>
  )
}
