import React from 'react'
import { AutoRenewIcon, HistoryIcon, IconButton } from '@pancakeswap-libs/uikit'
import { useAppDispatch } from 'state'
import { setHistoryPaneState } from 'state/predictions'
import { useGetIsFetchingHistory } from 'state/hooks'

const HistoryButton = () => {
  const isFetchingHistory = useGetIsFetchingHistory()
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch(setHistoryPaneState(true))
  }

  return (
    <IconButton variant="subtle" ml="8px" onClick={handleClick} isLoading={isFetchingHistory}>
      {isFetchingHistory ? <AutoRenewIcon spin color="white" /> : <HistoryIcon width="24px" color="white" />}
    </IconButton>
  )
}

export default HistoryButton
