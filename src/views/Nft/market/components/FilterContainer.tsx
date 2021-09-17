import React, { useState } from 'react'
import styled from 'styled-components'
import capitalize from 'lodash/capitalize'
import { Box, Button, ChevronDownIcon, ChevronUpIcon, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NftAttribute } from 'state/nftMarket/types'

interface FilterContainerProps {
  maxDisplayAttributes?: number
  attributes: NftAttribute[]
  onAttributeClick: (attribute: NftAttribute) => void
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

const FilterContainer: React.FC<FilterContainerProps> = ({
  maxDisplayAttributes = 10,
  children,
  attributes,
  onAttributeClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()
  const visibleAttributes = isExpanded ? attributes : attributes.slice(0, maxDisplayAttributes)

  const toggleExpanded = () => setIsExpanded(!isExpanded)

  return (
    <Flex minHeight="48px">
      <ScrollableContainer>
        <Flex alignItems="center" flexWrap={['nowrap', null, 'wrap']}>
          {children}
          {visibleAttributes.map((item) => {
            const handleClick = () => onAttributeClick(item)

            return (
              <Button variant="light" scale="sm" mr="4px" mb="16px" onClick={handleClick}>
                {capitalize(item.traitType)}
              </Button>
            )
          })}
        </Flex>
      </ScrollableContainer>
      {attributes.length >= maxDisplayAttributes && (
        <Box display={['none', null, 'block']}>
          <LightOutlineButton
            onClick={toggleExpanded}
            endIcon={isExpanded ? <ChevronUpIcon color="textSubtle" /> : <ChevronDownIcon color="textSubtle" />}
          >
            {isExpanded ? t('Less') : t('More')}
          </LightOutlineButton>
        </Box>
      )}
    </Flex>
  )
}

export default FilterContainer
