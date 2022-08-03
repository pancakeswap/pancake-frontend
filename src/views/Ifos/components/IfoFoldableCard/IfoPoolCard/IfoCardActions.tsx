import { useTranslation } from 'contexts/Localization'
import { Button } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Ifo, PoolIds } from 'config/constants/types'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ContributeButton from './ContributeButton'
import ClaimButton from './ClaimButton'
import { SkeletonCardActions } from './Skeletons'
import { EnableStatus } from '../types'

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

const IfoCardActions: React.FC<Props> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  hasProfile,
  isLoading,
  isEligible,
  enableStatus,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const userPoolCharacteristics = walletIfoData[poolId]

  if (isLoading) {
    return <SkeletonCardActions />
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  if (!hasProfile) {
    return (
      <Button as={NextLinkFromReactRouter} to={`/profile/${account.toLowerCase()}`} width="100%">
        {t('Activate your Profile')}
      </Button>
    )
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
