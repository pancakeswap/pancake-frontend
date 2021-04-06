import React from 'react'
import { AutoRenewIcon, HistoryIcon, IconButton } from '@pancakeswap-libs/uikit'
import { useAppDispatch } from 'state'
import { showHistory } from 'state/predictions'
import { useGetIsFetchingHistory } from 'state/hooks'
import { useWeb3React } from '@web3-react/core'

const HistoryButton = () => {
  const { account } = useWeb3React()
  const isFetchingHistory = useGetIsFetchingHistory()
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch(showHistory({ account }))
  }

  return (
    <IconButton variant="subtle" ml="8px" onClick={handleClick} isLoading={isFetchingHistory}>
      {isFetchingHistory ? <AutoRenewIcon spin color="white" /> : <HistoryIcon width="24px" color="white" />}
    </IconButton>
  )
}

export default HistoryButton
