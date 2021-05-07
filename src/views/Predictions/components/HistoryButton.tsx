import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { AutoRenewIcon, HistoryIcon, IconButton } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { setHistoryPaneState } from 'state/predictions'
import { useGetIsFetchingHistory } from 'state/hooks'

const HistoryButton = () => {
  const isFetchingHistory = useGetIsFetchingHistory()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  const handleClick = () => {
    dispatch(setHistoryPaneState(true))
  }

  return (
    <IconButton variant="subtle" ml="8px" onClick={handleClick} isLoading={isFetchingHistory} disabled={!account}>
      {isFetchingHistory ? <AutoRenewIcon spin color="white" /> : <HistoryIcon width="24px" color="white" />}
    </IconButton>
  )
}

export default HistoryButton
