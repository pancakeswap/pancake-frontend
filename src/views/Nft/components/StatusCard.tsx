import React from 'react'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import PleaseWaitCard from './PleaseWaitCard'
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

  return <div>statuscard</div>
}

export default StatusCard
