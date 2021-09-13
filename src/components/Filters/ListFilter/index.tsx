import React, { ChangeEvent, useState } from 'react'
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
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FilterFooter from '../FilterFooter'
import FilterHeader from '../FilterHeader'
import { Item, ItemRow, SearchWrapper, ClearAllButton, SelectAllButton } from './styles'

interface ListFilterProps {
  title?: string
  items: Item[]
  onApply: (items: Item[]) => void
  onClear?: () => void
}

const ListFilter: React.FC<ListFilterProps> = ({ title, items, onApply, onClear }) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const { isMobile } = useMatchBreakpoints()
  const [localItems, setLocalItems] = useState<Item[]>(
    items.map((item) => {
      return {
        isSelected: false,
        ...item,
      }
    }),
  )
  const filteredItems =
    query && query.length > 2
      ? localItems.filter((item) => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) !== -1
        })
      : localItems
  const selectedLocalItems = localItems.filter((localItem) => localItem.isSelected).length

  const handleSelectAll = () => {
    setLocalItems(
      items.map((item) => {
        return {
          isSelected: true,
          ...item,
        }
      }),
    )
  }

  const handleClear = () => {
    setQuery('')
    setLocalItems(
      items.map((item) => {
        return {
          isSelected: false,
          ...item,
        }
      }),
    )

    if (onClear) {
      onClear()
    }
  }

  const handleApply = () => {
    onApply(localItems.filter((localItem) => localItem.isSelected))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    setQuery(value)
  }

  const handleItemSelect = (item: Item) => {
    setLocalItems((prevLocalItems) =>
      prevLocalItems.map((prevLocalItem) => {
        if (item.label === prevLocalItem.label) {
          return {
            ...prevLocalItem,
            isSelected: !prevLocalItem.isSelected,
          }
        }

        return prevLocalItem
      }),
    )
  }

  return (
    <InlineMenu
      component={
        <Button variant="light" scale="sm">
          {t('Attributes')}
        </Button>
      }
    >
      <Box maxWidth="375px">
        <FilterHeader title={title}>
          <Button onClick={handleApply} variant="text" scale="sm">
            {selectedLocalItems > 0 ? t('Apply (%num%)', { num: selectedLocalItems }) : t('Apply')}
          </Button>
        </FilterHeader>
        <SearchWrapper hasHeader={!!title && !isMobile} alignItems="center" p="16px">
          <InputGroup startIcon={<SearchIcon color="textSubtle" />}>
            <Input name="query" placeholder={t('Search')} onChange={handleChange} value={query} autoFocus />
          </InputGroup>
          <SelectAllButton onClick={handleSelectAll} ml="8px">
            {t('Select All')}
          </SelectAllButton>
          <ClearAllButton onClick={handleClear}>{t('Clear All')}</ClearAllButton>
        </SearchWrapper>
        <Box height="230px" overflowY="auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((filteredItem) => {
              const handleSelect = () => {
                handleItemSelect(filteredItem)
              }

              return <ItemRow key={filteredItem.label} item={filteredItem} onSelect={handleSelect} />
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
            {t('Clear')}
          </Button>
          <Button onClick={handleApply}>
            {selectedLocalItems > 0 ? t('Apply (%num%)', { num: selectedLocalItems }) : t('Apply')}
          </Button>
        </FilterFooter>
      </Box>
    </InlineMenu>
  )
}

export default ListFilter
