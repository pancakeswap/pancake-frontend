import React from 'react'
import useGetPublicIfoV2Data from 'views/Ifos/hooks/v2/useGetPublicIfoData'
import useGetWalletIfoV2Data from 'views/Ifos/hooks/v2/useGetWalletIfoData'
import { Ifo } from 'config/constants/types'
import IfoFoldableCard from './IfoFoldableCard'

interface Props {
  ifo: Ifo
}

const IfoCardV2Data: React.FC<Props> = ({ ifo }) => {
  const publicIfoData = useGetPublicIfoV2Data(ifo)
  const walletIfoData = useGetWalletIfoV2Data(ifo)

  return <IfoFoldableCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
}

export default IfoCardV2Data
