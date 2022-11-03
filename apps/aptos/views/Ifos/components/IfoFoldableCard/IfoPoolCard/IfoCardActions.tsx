import { useAccount } from '@pancakeswap/awgmi'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { Ifo, PoolIds } from 'config/constants/types'
import { useMemo } from 'react'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import { ClaimButton } from './ClaimButton'
import ContributeButton from './ContributeButton'
import { SkeletonCardActions } from './Skeletons'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  isLoading: boolean
}

const IfoCardActions: React.FC<React.PropsWithChildren<Props>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  isLoading,
}) => {
  const { account } = useAccount()
  const userPoolCharacteristics = walletIfoData[poolId]

  const needClaim = useMemo(() => {
    return (
      publicIfoData.status === 'finished' &&
      !userPoolCharacteristics.hasClaimed &&
      (userPoolCharacteristics.offeringAmountInToken.isGreaterThan(0) ||
        userPoolCharacteristics.refundingAmountInLP.isGreaterThan(0))
    )
  }, [publicIfoData.status, userPoolCharacteristics.hasClaimed])

  if (isLoading) {
    return <SkeletonCardActions />
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  if (needClaim) {
    return <ClaimButton poolId={poolId} walletIfoData={walletIfoData} />
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
