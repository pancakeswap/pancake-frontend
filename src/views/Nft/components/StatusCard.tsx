import React, { useContext } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import { NftProviderContext } from '../contexts/NftProvider'
import NoNftsToClaimCard from './NoNftsToClaimCard'
import YouWonCard from './YouWonCard'
import NftInWalletCard from './NftInWalletCard'

/**
 * Possible states
 *
 * 1. Disconnected wallet
 * 2. No NFT's to claim
 * 3. You won an NFT
 * 4. NFT in wallet
 */
const StatusCard = () => {
  const { account } = useWallet()
  const { isInitialized, canClaim, hasClaimed, balanceOf } = useContext(NftProviderContext)
  const TranslateString = useI18n()

  if (!account) {
    return (
      <Card isActive>
        <CardBody>
          <Heading mb="8px">{TranslateString(999, 'Wallet Disconnected')}</Heading>
          <Text mb="16px">{TranslateString(999, 'Connect to see if you have won an NFT!')}</Text>
          <UnlockButton />
        </CardBody>
      </Card>
    )
  }

  if (!isInitialized) {
    return <Text>...</Text>
  }

  if (!hasClaimed && canClaim) {
    return <YouWonCard />
  }

  if (balanceOf > 0) {
    return <NftInWalletCard />
  }

  return <NoNftsToClaimCard />
}

export default StatusCard
