import { IfoSkeletonCardActions } from '@pancakeswap/uikit'

import { useAccount } from 'wagmi'
import { Ifo, PoolIds } from '@pancakeswap/ifos'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import { isBasicSale } from 'views/Ifos/hooks/v7/helpers'
import ConnectWalletButton from 'components/ConnectWalletButton'

import ContributeButton from './ContributeButton'
import ClaimButton from './ClaimButton'
import { EnableStatus } from '../types'
import { ActivateProfileButton } from './ActivateProfileButton'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  hasProfile: boolean
  isLoading: boolean
  isEligible: boolean
  enableStatus: EnableStatus
}

const IfoCardActions: React.FC<React.PropsWithChildren<Props>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  hasProfile,
  isLoading,
  isEligible,
  enableStatus,
}) => {
  const { address: account } = useAccount()
  const userPoolCharacteristics = walletIfoData[poolId]

  if (isLoading) {
    return <IfoSkeletonCardActions />
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  if (!hasProfile && !isBasicSale(publicIfoData[poolId].saleType)) {
    return <ActivateProfileButton ifo={ifo} />
  }

  const needClaim =
    publicIfoData.status === 'finished' &&
    !userPoolCharacteristics.hasClaimed &&
    (userPoolCharacteristics.offeringAmountInToken.isGreaterThan(0) ||
      userPoolCharacteristics.refundingAmountInLP.isGreaterThan(0))

  if (needClaim) {
    return <ClaimButton poolId={poolId} ifoVersion={ifo.version} walletIfoData={walletIfoData} />
  }

  if (
    (enableStatus !== EnableStatus.ENABLED && publicIfoData.status === 'coming_soon') ||
    (ifo.version >= 3.1 && poolId === PoolIds.poolBasic && !isEligible)
  ) {
    return null
  }

  return (
    <>
      {(publicIfoData.status === 'live' || publicIfoData.status === 'coming_soon') && (
        <ContributeButton poolId={poolId} ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
      )}
    </>
  )
}

export default IfoCardActions
