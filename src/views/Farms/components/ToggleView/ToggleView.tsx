import React from 'react'
import { ListViewIcon, CardViewIcon, IconButton } from '@pancakeswap-libs/uikit'
import { ViewMode } from '../types'

interface ToogleViewProps {
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
}

const ToggleView: React.FunctionComponent<ToogleViewProps> = ({ viewMode, onToggle }) => {
  const handleToggle = (mode: ViewMode) => {
    if (viewMode !== mode) {
      onToggle(mode)
    }
  }

  return (
    <div>
      <IconButton variant="text" size="sm" onClick={() => handleToggle(ViewMode.CARD)}>
        <CardViewIcon color={viewMode === ViewMode.CARD ? 'primary' : 'textDisabled'} />
      </IconButton>
      <IconButton variant="text" size="sm" onClick={() => handleToggle(ViewMode.TABLE)}>
        <ListViewIcon color={viewMode === ViewMode.TABLE ? 'primary' : 'textDisabled'} />
      </IconButton>
    </div>
  )
}

export default ToggleView
