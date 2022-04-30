import { Checkbox, Flex, Text } from '@pancakeswap/uikit'
import { StyledItemRow } from '../ListFilter/styles'

interface CollectionItemRowProps {
  item: CollectionItem
  isSelected: boolean
  onClick: (evt) => void
}

interface CollectionItem {
  label: string
  collectionAddress: string
}

export const CollectionItemRow: React.FC<CollectionItemRowProps> = ({ item, isSelected, onClick }) => (
  <StyledItemRow alignItems="center" px="16px" py="8px">
    <Text style={{ flex: 1 }}>{item.label}</Text>
    <Flex ml="24px">
      <Checkbox name="item-select" scale="sm" onChange={onClick} checked={isSelected} value={item.collectionAddress} />
    </Flex>
  </StyledItemRow>
)
