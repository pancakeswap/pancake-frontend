import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  Text,
  Flex,
  InlineMenu,
  Input,
  InputGroup,
  SearchIcon,
  useMatchBreakpoints,
  IconButton,
  CloseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import { useAppDispatch } from 'state'
import { filterNftsFromCollection } from 'state/nftMarket/reducer'
import { useTranslation } from 'contexts/Localization'
import { useGetNftFilterLoadingState, useGetNftFilters } from 'state/nftMarket/hooks'
import { NftFilterLoadingState } from 'state/nftMarket/types'
import FilterFooter from '../FilterFooter'
import { ItemRow, SearchWrapper } from './styles'
import { Item } from './types'

interface ListFilterProps {
  title?: string
  selectedItem?: Item
  items: Item[]
  collectionAddress: string
  onApply: (item: Item) => void
  onClear: () => void
}

const TriggerButton = styled(Button)<{ hasItem: boolean }>`
  ${({ hasItem }) =>
    hasItem &&
    `  
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 8px;
  `}
`

const CloseButton = styled(IconButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

export const ListFilter: React.FC<ListFilterProps> = ({
  title,
  selectedItem,
  items,
  collectionAddress,
  onApply,
  onClear,
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc')
  const wrapperRef = useRef(null)
  const menuRef = useRef(null)
  const [localSelectedItem, setLocalSelectedItem] = useState(selectedItem)
  const { isMobile, isDesktop } = useMatchBreakpoints()
  const nftFilters = useGetNftFilters()
  const nftFilterState = useGetNftFilterLoadingState()
  const dispatch = useAppDispatch()

  const filteredItems =
    query && query.length > 1
      ? items.filter((item) => item.label.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      : items

  const handleClear = () => {
    setQuery('')
    setLocalSelectedItem(null)
    setIsOpen(false)

    onClear()
  }

  const handleClearItem = () => {
    const newFilters = { ...nftFilters }

    delete newFilters[localSelectedItem.attr.traitType]

    dispatch(
      filterNftsFromCollection({
        collectionAddress,
        nftFilters: newFilters,
      }),
    )
  }

  const handleMenuClick = () => setIsOpen(!isOpen)

  const handleApply = () => {
    onApply(localSelectedItem)
    setIsOpen(false)
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    setQuery(value)
  }

  const handleItemSelect = (newItem: Item) => {
    setLocalSelectedItem(newItem)
  }

  const toggleOrderDir = () => {
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  // Update local state if parent state changes
  useEffect(() => {
    setLocalSelectedItem(selectedItem)
  }, [selectedItem, setLocalSelectedItem])

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
              variant={localSelectedItem ? 'subtle' : 'light'}
              scale="sm"
              disabled={nftFilterState === NftFilterLoadingState.LOADING}
              hasItem={!!localSelectedItem}
            >
              {title}
            </TriggerButton>
          }
          isOpen={isOpen}
        >
          <Box maxWidth="375px" ref={menuRef}>
            <SearchWrapper hasHeader={!!title && !isMobile} alignItems="center" p="16px">
              <InputGroup startIcon={<SearchIcon color="textSubtle" />}>
                <Input
                  name="query"
                  placeholder={t('Search')}
                  onChange={handleChange}
                  value={query}
                  autoFocus={isDesktop}
                />
              </InputGroup>
            </SearchWrapper>
            <Flex alignItems="center" p="16px">
              <Text style={{ flex: 1 }} fontSize="12px" color="secondary" fontWeight="bold" textTransform="uppercase">
                {t('Name')}
              </Text>
              <Flex alignItems="center" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={toggleOrderDir}>
                <Text fontSize="12px" color="secondary" fontWeight="bold" textTransform="uppercase">
                  {t('Count')}
                </Text>
                {orderDir === 'asc' ? (
                  <ArrowUpIcon width="18px" color="secondary" />
                ) : (
                  <ArrowDownIcon width="18px" color="secondary" />
                )}
              </Flex>
            </Flex>
            <Box height="240px" overflowY="auto">
              {filteredItems.length > 0 ? (
                orderBy(filteredItems, 'count', orderDir).map((filteredItem) => {
                  const handleSelect = () => handleItemSelect(filteredItem)

                  return (
                    <ItemRow
                      key={filteredItem.label}
                      item={filteredItem}
                      isSelected={localSelectedItem && localSelectedItem.label === filteredItem.label}
                      onSelect={handleSelect}
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
            <FilterFooter>
              <Button variant="secondary" onClick={handleClear}>
                {localSelectedItem ? t('Clear') : t('Close')}
              </Button>
              <Button onClick={handleApply} disabled={localSelectedItem === null}>
                {t('Apply')}
              </Button>
            </FilterFooter>
          </Box>
        </InlineMenu>
      </Box>
      {localSelectedItem && (
        <CloseButton
          variant={localSelectedItem ? 'subtle' : 'light'}
          scale="sm"
          onClick={handleClearItem}
          disabled={nftFilterState === NftFilterLoadingState.LOADING}
        >
          <CloseIcon color="currentColor" width="18px" />
        </CloseButton>
      )}
    </Flex>
  )
}
