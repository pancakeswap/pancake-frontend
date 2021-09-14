import React, { ReactNode, ReactText, useState } from 'react'
import styled from 'styled-components'
import { Box, Button, ChevronDownIcon, ChevronUpIcon, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface FilterItem {
  label: ReactNode
  value: ReactText
}

interface FilterContainerProps {
  maxDisplayFilters?: number
  items: FilterItem[]
  onFilterClick: (filterItem: FilterItem) => void
}

const LightOutlineButton = styled(Button).attrs({ variant: 'secondary', scale: 'sm' })`
  border-color: ${({ theme }) => theme.colors.textSubtle};
  color: ${({ theme }) => theme.colors.textSubtle};
`

const ScrollableContainer = styled.div`
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-width: 320px;
  overflow-x: auto;
`

const FilterContainer: React.FC<FilterContainerProps> = ({ maxDisplayFilters = 10, items, onFilterClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()
  const visibleFilters = isExpanded ? items : items.slice(0, maxDisplayFilters)

  const toggleExpanded = () => setIsExpanded(!isExpanded)

  return (
    <Flex minHeight="48px">
      <ScrollableContainer>
        <Flex alignItems="center" flexWrap={['nowrap', null, 'wrap']}>
          {visibleFilters.map((item) => {
            const handleClick = () => onFilterClick(item)

            return (
              <Button variant="light" scale="sm" mr="4px" mb="16px" onClick={handleClick}>
                {item.label}
              </Button>
            )
          })}
        </Flex>
      </ScrollableContainer>
      <Box display={['none', null, 'block']}>
        <LightOutlineButton
          onClick={toggleExpanded}
          endIcon={isExpanded ? <ChevronUpIcon color="textSubtle" /> : <ChevronDownIcon color="textSubtle" />}
        >
          {isExpanded ? t('Less') : t('More')}
        </LightOutlineButton>
      </Box>
    </Flex>
  )
}

export default FilterContainer
