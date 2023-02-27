import { Select, OptionProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useNftStorage } from 'state/nftMarket/storage'
import { useGetNftOrdering } from 'state/nftMarket/hooks'

const SortSelect: React.FC<React.PropsWithChildren<{ collectionAddress: string }>> = ({ collectionAddress }) => {
  const { t } = useTranslation()
  const { setOrdering } = useNftStorage()
  const selectedOrder = useGetNftOrdering(collectionAddress)
  const handleChange = (newOption: OptionProps) => {
    const { field, direction } = newOption.value
    setOrdering({ collection: collectionAddress, field, direction })
  }

  const sortByItems = [
    { label: t('Recently listed'), value: { field: 'updatedAt', direction: 'desc' } },
    { label: t('Lowest price'), value: { field: 'currentAskPrice', direction: 'asc' } },
    { label: t('Highest price'), value: { field: 'currentAskPrice', direction: 'desc' } },
    { label: t('Token ID'), value: { field: 'tokenId', direction: 'asc' } },
  ]

  const defaultOptionIndex = sortByItems.findIndex(
    (option) => option.value.field === selectedOrder.field && option.value.direction === selectedOrder.direction,
  )

  return (
    <Select
      options={sortByItems}
      onOptionChange={handleChange}
      key={defaultOptionIndex !== -1 ? defaultOptionIndex : undefined}
      defaultOptionIndex={defaultOptionIndex !== -1 ? defaultOptionIndex : undefined}
    />
  )
}

export default SortSelect
