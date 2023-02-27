import { useGetPublicIfoData } from 'views/Ifos/hooks/v3/useGetPublicIfoData'
import { useGetWalletIfoData } from 'views/Ifos/hooks/v3/useGetWalletIfoData'
import { Ifo } from 'config/constants/types'
import { IfoFoldableCard } from './IfoFoldableCard'

interface Props {
  ifo: Ifo
}

const IfoCardV3Data: React.FC<React.PropsWithChildren<Props>> = ({ ifo }) => {
  const publicIfoData = useGetPublicIfoData(ifo)
  const walletIfoData = useGetWalletIfoData(ifo)

  return <IfoFoldableCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
}

export default IfoCardV3Data
