import { Ifo } from '@pancakeswap/ifos'

import useGetPublicIfoV8Data from 'views/Ifos/hooks/v8/useGetPublicIfoData'
import useGetWalletIfoV8Data from 'views/Ifos/hooks/v8/useGetWalletIfoData'

import IfoFoldableCard from './IfoFoldableCard'

interface Props {
  ifo: Ifo
}

export const IfoCardV8Data: React.FC<React.PropsWithChildren<Props>> = ({ ifo }) => {
  const publicIfoData = useGetPublicIfoV8Data(ifo)
  const walletIfoData = useGetWalletIfoV8Data(ifo)

  return <IfoFoldableCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
}
