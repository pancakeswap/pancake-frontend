import React from 'react'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { removeAllActivityFilters } from 'state/nftMarket/reducer'

interface ClearAllButtonProps extends ButtonProps {
  collectionAddress: string
}

const ClearAllButton: React.FC<ClearAllButtonProps> = ({ collectionAddress, ...props }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const clearAll = () => {
    dispatch(removeAllActivityFilters(collectionAddress))
  }

  return (
    <Button key="clear-all" variant="text" scale="sm" onClick={clearAll} {...props}>
      {t('Clear')}
    </Button>
  )
}

export default ClearAllButton
