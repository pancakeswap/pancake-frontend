import { Ifo, isCrossChainIfoSupportedOnly } from '@pancakeswap/ifos'
import { useMemo } from 'react'

import { useFetchIfo } from 'state/pools/hooks'
import useGetPublicIfoV8Data from 'views/Ifos/hooks/v8/useGetPublicIfoData'
import useGetWalletIfoV8Data from 'views/Ifos/hooks/v8/useGetWalletIfoData'

import IfoContainer from './components/IfoContainer'
import { IfoCurrentCard } from './components/IfoFoldableCard'
import IfoQuestions from './components/IfoQuestions'
import IfoSteps from './components/IfoSteps'
import { SectionBackground } from './components/SectionBackground'
import { useICakeBridgeStatus } from './hooks/useIfoCredit'
import { isBasicSale } from './hooks/v7/helpers'

interface TypeProps {
  activeIfo: Ifo
}

const CurrentIfo: React.FC<React.PropsWithChildren<TypeProps>> = ({ activeIfo }) => {
  useFetchIfo()
  const publicIfoData = useGetPublicIfoV8Data(activeIfo)
  const walletIfoData = useGetWalletIfoV8Data(activeIfo)
  const { hasBridged, sourceChainCredit, srcChainId, destChainCredit } = useICakeBridgeStatus({
    ifoChainId: activeIfo.chainId,
    ifoAddress: activeIfo.address,
  })

  const isCrossChainIfo = useMemo(() => isCrossChainIfoSupportedOnly(activeIfo.chainId), [activeIfo.chainId])

  const { poolBasic, poolUnlimited } = walletIfoData

  const isCommitted = useMemo(
    () =>
      poolBasic?.amountTokenCommittedInLP.isGreaterThan(0) || poolUnlimited.amountTokenCommittedInLP.isGreaterThan(0),
    [poolBasic?.amountTokenCommittedInLP, poolUnlimited.amountTokenCommittedInLP],
  )

  const isBasicSaleOnly = useMemo(
    () => isBasicSale(publicIfoData.poolBasic?.saleType) && publicIfoData.poolBasic?.distributionRatio === 1,
    [publicIfoData.poolBasic?.saleType, publicIfoData.poolBasic?.distributionRatio],
  )

  const steps = isBasicSaleOnly ? null : (
    <IfoSteps
      sourceChainIfoCredit={sourceChainCredit}
      dstChainIfoCredit={destChainCredit}
      srcChainId={srcChainId}
      ifoChainId={activeIfo.chainId}
      isLive={publicIfoData.status === 'live'}
      isFinished={publicIfoData.status === 'finished'}
      hasClaimed={poolBasic?.hasClaimed || poolUnlimited.hasClaimed}
      isCommitted={isCommitted}
      ifoCurrencyAddress={activeIfo.currency.address}
      isCrossChainIfo={isCrossChainIfo}
      hasBridged={hasBridged}
    />
  )

  const faq = isBasicSaleOnly ? (
    <SectionBackground padding="32px 0">
      <IfoQuestions />
    </SectionBackground>
  ) : (
    <IfoQuestions />
  )

  return (
    <IfoContainer
      ifoAddress={activeIfo.address}
      ifoBasicSaleType={publicIfoData?.poolBasic?.saleType}
      ifoSection={<IfoCurrentCard ifo={activeIfo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />}
      ifoSteps={steps}
      faq={faq}
    />
  )
}

export default CurrentIfo
