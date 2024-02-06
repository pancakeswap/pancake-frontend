import { useTranslation } from '@pancakeswap/localization'
import { getLeastMostPriceInCollection } from 'state/nftMarket/helpers'
import { useQuery } from '@tanstack/react-query'
import { StatBoxItem, StatBoxItemProps } from '../components/StatBox'

interface LowestPriceStatBoxItemProps extends Omit<StatBoxItemProps, 'title' | 'stat'> {
  collectionAddress: string
}

const LowestPriceStatBoxItem: React.FC<React.PropsWithChildren<LowestPriceStatBoxItemProps>> = ({
  collectionAddress,
  ...props
}) => {
  const { t } = useTranslation()
  const { data: lowestCollectionPrice = null } = useQuery({
    queryKey: [collectionAddress, 'lowestPrice'],
    queryFn: () => getLeastMostPriceInCollection(collectionAddress),
    enabled: Boolean(collectionAddress),
  })

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
