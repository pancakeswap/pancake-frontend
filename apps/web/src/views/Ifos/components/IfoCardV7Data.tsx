import { Ifo } from '@pancakeswap/ifos'

import useGetPublicIfoV7Data from 'views/Ifos/hooks/v7/useGetPublicIfoData'
import useGetWalletIfoV7Data from 'views/Ifos/hooks/v7/useGetWalletIfoData'

import IfoFoldableCard from './IfoFoldableCard'

interface Props {
  ifo: Ifo
}

export const IfoCardV7Data: React.FC<React.PropsWithChildren<Props>> = ({ ifo }) => {
  const publicIfoData = useGetPublicIfoV7Data(ifo)
  const walletIfoData = useGetWalletIfoV7Data(ifo)

  return <IfoFoldableCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
}
