import React from 'react'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchNftsFromCollections, removeAllFilters } from 'state/nftMarket/reducer'

interface ClearAllButtonProps extends ButtonProps {
  collectionAddress: string
}

const ClearAllButton: React.FC<ClearAllButtonProps> = ({ collectionAddress, ...props }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const clearAll = () => {
    dispatch(removeAllFilters(collectionAddress))
    dispatch(fetchNftsFromCollections({ collectionAddress, page: 1, size: 100 }))
  }

  return (
    <Button key="clear-all" variant="text" scale="sm" onClick={clearAll} {...props}>
      {t('Clear All')}
    </Button>
  )
}

export default ClearAllButton
