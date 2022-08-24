import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { removeAllActivityFilters } from 'state/nftMarket/storage'

interface ClearAllButtonProps extends ButtonProps {
  collectionAddress: string
}

const ClearAllButton: React.FC<React.PropsWithChildren<ClearAllButtonProps>> = ({ collectionAddress, ...props }) => {
  const { t } = useTranslation()

  const clearAll = () => {
    removeAllActivityFilters(collectionAddress)
  }

  return (
    <Button key="clear-all" variant="text" scale="sm" onClick={clearAll} style={{ whiteSpace: 'nowrap' }} {...props}>
      {t('Clear')}
    </Button>
  )
}

export default ClearAllButton
