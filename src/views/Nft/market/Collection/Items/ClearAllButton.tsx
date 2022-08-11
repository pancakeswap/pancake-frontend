import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useAppDispatch } from 'state'
import { removeAllItemFilters } from 'state/nftMarket/reducer'
import { useGetNftFilterLoadingState } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'

interface ClearAllButtonProps extends ButtonProps {
  collectionAddress: string
}

const ClearAllButton: React.FC<React.PropsWithChildren<ClearAllButtonProps>> = ({ collectionAddress, ...props }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const nftFilterState = useGetNftFilterLoadingState(collectionAddress)

  const clearAll = () => {
    dispatch(removeAllItemFilters(collectionAddress))
  }

  return (
    <Button
      key="clear-all"
      variant="text"
      scale="sm"
      onClick={clearAll}
      disabled={nftFilterState === FetchStatus.Fetching}
      {...props}
    >
      {t('Clear')}
    </Button>
  )
}

export default ClearAllButton
