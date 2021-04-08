import React from 'react'
import { useWeb3React } from '@web3-react/core'
import useGetWalletIfoData from 'hooks/useGetWalletIfoData'
import { PublicIfoState } from 'hooks/useGetPublicIfoData'
import { Ifo } from 'config/constants/types'
import UnlockButton from 'components/UnlockButton'
import Contribute from './Contribute'
import Claim from './Claim'

export interface Props {
  ifo: Ifo
  publicIfoData: PublicIfoState
}

const IfoCardActions: React.FC<Props> = ({ ifo, publicIfoData }) => {
  const { isPendingTx, userInfo, contract, setPendingTx, addUserContributedAmount, setIsClaimed } = useGetWalletIfoData(
    ifo,
  )
  const { account } = useWeb3React()

  return account ? (
    <>
      {publicIfoData.status === 'live' && (
        <Contribute
          ifo={ifo}
          contract={contract}
          isPendingTx={isPendingTx}
          addUserContributedAmount={addUserContributedAmount}
        />
      )}
      {publicIfoData.status === 'finished' && (
        <Claim
          contract={contract}
          userInfo={userInfo}
          isPendingTx={isPendingTx}
          setPendingTx={setPendingTx}
          setIsClaimed={setIsClaimed}
        />
      )}
    </>
  ) : (
    <UnlockButton width="100%" />
  )
}

export default IfoCardActions
