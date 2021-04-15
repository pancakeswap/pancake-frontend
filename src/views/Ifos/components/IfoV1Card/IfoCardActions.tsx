import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { PublicIfoData, WalletIfoData } from 'hooks/ifo/v1/types'
import { Ifo } from 'config/constants/types'
import UnlockButton from 'components/UnlockButton'
import Contribute from './Contribute'
import Claim from './Claim'
import { ActiveSkeleton, InactiveSkeleton } from './Skeleton'

export interface Props {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const IfoCardActions: React.FC<Props> = ({ ifo, publicIfoData, walletIfoData }) => {
  const {
    isPendingTx,
    offeringTokenBalance,
    refundingAmount,
    userInfo,
    contract,
    setPendingTx,
    addUserContributedAmount,
    setIsClaimed,
  } = walletIfoData
  const { account } = useWeb3React()

  if (!account) {
    return <UnlockButton width="100%" />
  }

  return (
    <>
      {ifo.isActive && publicIfoData.status === 'idle' && <ActiveSkeleton />}
      {!ifo.isActive && publicIfoData.status === 'idle' && <InactiveSkeleton />}
      {publicIfoData.status === 'live' && (
        <Contribute
          ifo={ifo}
          contract={contract}
          userInfo={userInfo}
          isPendingTx={isPendingTx}
          publicIfoData={publicIfoData}
          addUserContributedAmount={addUserContributedAmount}
        />
      )}
      {publicIfoData.status === 'finished' && (
        <Claim
          ifo={ifo}
          contract={contract}
          userInfo={userInfo}
          isPendingTx={isPendingTx}
          setPendingTx={setPendingTx}
          offeringTokenBalance={offeringTokenBalance}
          refundingAmount={refundingAmount}
          setIsClaimed={setIsClaimed}
        />
      )}
    </>
  )
}

export default IfoCardActions
