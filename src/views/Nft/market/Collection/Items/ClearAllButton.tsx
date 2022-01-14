import React from 'react'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { removeAllFilters } from 'state/nftMarket/reducer'
import { useGetNftFilterLoadingState } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'

interface ClearAllButtonProps extends ButtonProps {
  collectionAddress: string
}

const ClearAllButton: React.FC<ClearAllButtonProps> = ({ collectionAddress, ...props }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const nftFilterState = useGetNftFilterLoadingState(collectionAddress)

  const clearAll = () => {
    dispatch(removeAllFilters(collectionAddress))
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
