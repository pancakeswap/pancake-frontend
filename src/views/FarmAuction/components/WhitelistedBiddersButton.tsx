import React from 'react'
import { useModal, Button, Skeleton } from '@tovaswapui/uikit'
import WhitelistedBiddersModal from './WhitelistedBiddersModal'
import useWhitelistedAddresses from '../hooks/useWhitelistedAddresses'

const WhitelistedBiddersButton: React.FC = () => {
  const whitelistedBidders = useWhitelistedAddresses()
  const [onShowWhitelistedBidders] = useModal(<WhitelistedBiddersModal />)

  return whitelistedBidders ? (
    <Button p="0" variant="text" scale="sm" onClick={onShowWhitelistedBidders}>
      {whitelistedBidders.length}
    </Button>
  ) : (
    <Skeleton height="24px" width="46px" />
  )
}

export default WhitelistedBiddersButton
