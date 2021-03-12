import React from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from '@pancakeswap-libs/uikit'
import { setHistoryPaneState } from 'state/predictions'
import { useIsHistoryPaneOpen } from 'state/hooks'
import History from '../icons/History'

const HistoryButton = () => {
  const isHistoryPaneOpen = useIsHistoryPaneOpen()
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setHistoryPaneState(!isHistoryPaneOpen))
  }

  return (
    <IconButton variant="subtle" ml="8px" onClick={handleClick}>
      <History width="24px" color="white" />
    </IconButton>
  )
}

export default HistoryButton
