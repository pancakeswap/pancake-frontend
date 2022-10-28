import { useAccount } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { Ifo, PoolIds } from 'config/constants/types'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import ContributeButton from './ContributeButton'
import ClaimButton from './ClaimButton'
import { SkeletonCardActions } from './Skeletons'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  isLoading: boolean
  isEligible: boolean
}

const IfoCardActions: React.FC<React.PropsWithChildren<Props>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  isLoading,
  isEligible,
}) => {
  const { t } = useTranslation()
  const { account } = useAccount()
  const userPoolCharacteristics = walletIfoData[poolId]

  if (isLoading) {
    return <SkeletonCardActions />
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  const needClaim =
    publicIfoData.status === 'finished' &&
    !userPoolCharacteristics.hasClaimed &&
    (userPoolCharacteristics.offeringAmountInToken.isGreaterThan(0) ||
      userPoolCharacteristics.refundingAmountInLP.isGreaterThan(0))

  if (needClaim) {
    return <ClaimButton poolId={poolId} ifoVersion={ifo.version} walletIfoData={walletIfoData} />
  }

  if (ifo.version >= 3.1 && poolId === PoolIds.poolBasic && !isEligible) {
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
