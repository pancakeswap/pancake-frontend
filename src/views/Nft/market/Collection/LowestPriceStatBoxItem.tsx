import useSWR from 'swr'
import { useTranslation } from 'contexts/Localization'
import { getLowestPriceInCollection } from 'state/nftMarket/helpers'
import { StatBoxItem, StatBoxItemProps } from '../components/StatBox'

interface LowestPriceStatBoxItemProps extends Omit<StatBoxItemProps, 'title' | 'stat'> {
  collectionAddress: string
}

const LowestPriceStatBoxItem: React.FC<LowestPriceStatBoxItemProps> = ({ collectionAddress, ...props }) => {
  const { t } = useTranslation()
  const { data: lowestCollectionPrice = null } = useSWR(
    collectionAddress ? [collectionAddress, 'lowestPrice'] : null,
    () => getLowestPriceInCollection(collectionAddress),
  )

  const formattedLowestPrice =
    lowestCollectionPrice !== null
      ? lowestCollectionPrice
        ? lowestCollectionPrice.toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        : '-'
      : null

  return <StatBoxItem title={t('Lowest (%symbol%)', { symbol: 'BNB' })} stat={formattedLowestPrice} {...props} />
}

export default LowestPriceStatBoxItem
