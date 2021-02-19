import React, { useEffect, useRef } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useLocation } from 'react-router-dom'
import { useModal } from '@pancakeswap-libs/uikit'
import ClaimNftGiftModal from './ClaimNftGiftModal'

const ClaimNftGift = () => {
  const [onPresentGiftModal] = useModal(<ClaimNftGiftModal bunnyId={11} />)
  const { account } = useWallet()
  const onPresentGiftModalRef = useRef(onPresentGiftModal)
  const { pathname } = useLocation()

  useEffect(() => {
    if (account && !pathname.includes('/collectibles')) {
      onPresentGiftModalRef.current()
    }
  }, [account, pathname, onPresentGiftModalRef])

  return null
}

export default ClaimNftGift
