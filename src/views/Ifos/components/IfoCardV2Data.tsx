import React from 'react'
import useGetPublicIfoV2Data from 'hooks/ifo/v2/useGetPublicIfoData'
import useGetWalletIfoV2Data from 'hooks/ifo/v2/useGetWalletIfoData'
import { Ifo } from 'config/constants/types'
import IfoFoldableCard from './IfoFoldableCard'

interface Props {
  ifo: Ifo
  isInitiallyVisible: boolean
}

const IfoCardV2Data: React.FC<Props> = ({ ifo, isInitiallyVisible }) => {
  const publicIfoData = useGetPublicIfoV2Data(ifo)
  const walletIfoData = useGetWalletIfoV2Data(ifo)

  return (
    <IfoFoldableCard
      ifo={ifo}
      publicIfoData={publicIfoData}
      walletIfoData={walletIfoData}
      isInitiallyVisible={isInitiallyVisible}
    />
  )
}

export default IfoCardV2Data
