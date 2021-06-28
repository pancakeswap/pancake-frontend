import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Button } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom'
import { Ifo, PoolIds } from 'config/constants/types'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import UnlockButton from 'components/UnlockButton'
import ContributeButton from './ContributeButton'
import ClaimButton from './ClaimButton'
import { SkeletonCardActions } from './Skeletons'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  hasProfile: boolean
  isLoading: boolean
}

const IfoCardActions: React.FC<Props> = ({ poolId, ifo, publicIfoData, walletIfoData, hasProfile, isLoading }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const userPoolCharacteristics = walletIfoData[poolId]

  if (isLoading) {
    return <SkeletonCardActions />
  }

  if (!account) {
    return <UnlockButton width="100%" />
  }

  if (!hasProfile) {
    return (
      <Button as={Link} to="/profile" width="100%">
        {t('Activate your Profile')}
      </Button>
    )
  }

  return (
    <>
      {publicIfoData.status === 'live' && (
        <ContributeButton poolId={poolId} ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
      )}
      {publicIfoData.status === 'finished' &&
        !userPoolCharacteristics.hasClaimed &&
        (userPoolCharacteristics.offeringAmountInToken.isGreaterThan(0) ||
          userPoolCharacteristics.refundingAmountInLP.isGreaterThan(0)) && (
          <ClaimButton poolId={poolId} ifoVersion={ifo.version} walletIfoData={walletIfoData} />
        )}
    </>
  )
}

export default IfoCardActions
