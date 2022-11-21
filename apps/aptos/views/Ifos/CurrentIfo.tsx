import { useGetPublicIfoData } from 'views/Ifos/hooks/v3/useGetPublicIfoData'
import { useGetWalletIfoData } from 'views/Ifos/hooks/v3/useGetWalletIfoData'

import { Ifo } from 'config/constants/types'

import { IfoCurrentCard } from './components/IfoFoldableCard'
import IfoContainer from './components/IfoContainer'

interface TypeProps {
  activeIfo: Ifo
}

const CurrentIfo: React.FC<React.PropsWithChildren<TypeProps>> = ({ activeIfo }) => {
  const publicIfoData = useGetPublicIfoData(activeIfo)
  const walletIfoData = useGetWalletIfoData(activeIfo)

  return (
    <IfoContainer
      ifoSection={<IfoCurrentCard ifo={activeIfo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />}
    />
  )
}

export default CurrentIfo
