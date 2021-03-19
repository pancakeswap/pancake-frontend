import React from 'react'
import { useDispatch } from 'react-redux'
import { HistoryIcon, IconButton } from '@pancakeswap-libs/uikit'
import { setHistoryPaneState } from 'state/predictions'
import { useIsHistoryPaneOpen } from 'state/hooks'

const HistoryButton = () => {
  const isHistoryPaneOpen = useIsHistoryPaneOpen()
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setHistoryPaneState(!isHistoryPaneOpen))
  }

  return (
    <IconButton variant="subtle" ml="8px" onClick={handleClick}>
      <HistoryIcon width="24px" color="white" />
    </IconButton>
  )
}

export default HistoryButton
