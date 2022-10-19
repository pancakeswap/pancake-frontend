import { useMemo } from 'react'
import { useGetPublicIfoData } from 'views/Ifos/hooks/v3/useGetPublicIfoData'
import { useGetWalletIfoData } from 'views/Ifos/hooks/v3/useGetWalletIfoData'

import { Ifo } from 'config/constants/types'

import { IfoCurrentCard } from './components/IfoFoldableCard'
import IfoContainer from './components/IfoContainer'
import IfoSteps from './components/IfoSteps'

interface TypeProps {
  activeIfo: Ifo
}

const CurrentIfo: React.FC<React.PropsWithChildren<TypeProps>> = ({ activeIfo }) => {
  const publicIfoData = useGetPublicIfoData(activeIfo)
  const walletIfoData = useGetWalletIfoData(activeIfo)

  const { poolUnlimited } = walletIfoData

  const isCommitted = useMemo(
    () => poolUnlimited.amountTokenCommittedInLP.isGreaterThan(0),
    [poolUnlimited.amountTokenCommittedInLP],
  )

  return (
    <IfoContainer
      ifoSection={<IfoCurrentCard ifo={activeIfo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />}
      ifoSteps={
        <IfoSteps
          isLive={publicIfoData.status === 'live'}
          hasClaimed={poolUnlimited.hasClaimed}
          isCommitted={isCommitted}
          ifoCurrencyAddress={activeIfo.currency.address}
        />
      }
    />
  )
}

export default CurrentIfo
