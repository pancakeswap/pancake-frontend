import Cookie from 'js-cookie'
import { Token } from '@pancakeswap/swap-sdk-core'
import { useEffect, useState } from 'react'
import { useModal } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import MultiChainHarvestModal from '../components/MultiChainHarvestModal'

const useMultiChainHarvestModal = () => {
  const [harvestModalParams, setHarvestModalParams] = useState<{
    pid: number
    token: Token
    quoteToken: Token
    lpSymbol: string
    earningsBigNumber: BigNumber
    earningsBusd: number
  }>(null)

  const [onPresentNonBscHarvestModal] = useModal(
    harvestModalParams ? (
      <MultiChainHarvestModal
        pid={harvestModalParams.pid}
        token={harvestModalParams.token}
        lpSymbol={harvestModalParams.lpSymbol}
        quoteToken={harvestModalParams.quoteToken}
        earningsBigNumber={new BigNumber(harvestModalParams.earningsBigNumber)}
        earningsBusd={harvestModalParams.earningsBusd}
      />
    ) : null,
  )

  useEffect(() => {
    if (harvestModalParams) {
      onPresentNonBscHarvestModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [harvestModalParams])

  useEffect(() => {
    const harvestModalCookie = Cookie.get('multiChainHarvestModal')
    if (harvestModalCookie) {
      setHarvestModalParams(JSON.parse(harvestModalCookie))
      Cookie.remove('multiChainHarvestModal')
    }
  }, [])
}

export default useMultiChainHarvestModal
