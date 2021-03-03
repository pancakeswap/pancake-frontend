import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Ifo } from 'config/constants/types'
import UnlockButton from 'components/UnlockButton'
import { PublicIfoState } from 'views/Ifos/hooks/useGetPublicIfoData'
import useGetWalletIfoData from '../../hooks/useGetWalletIfoData'
import Contribute from './Contribute'
import Claim from './Claim'
import ActiveSkeleton from './ActiveSkeleton'
import InactiveSkeleton from './InactiveSkeleton'

export interface Props {
  ifo: Ifo
  publicIfoData: PublicIfoState
}

const IfoCardActions: React.FC<Props> = ({ ifo, publicIfoData }) => {
  const {
    isPendingTx,
    offeringTokenBalance,
    refundingAmount,
    userInfo,
    contract,
    setPendingTx,
    addUserContributedAmount,
    setIsClaimed,
  } = useGetWalletIfoData(ifo)
  const { account } = useWeb3React()

  if (!account) {
    return <UnlockButton />
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
