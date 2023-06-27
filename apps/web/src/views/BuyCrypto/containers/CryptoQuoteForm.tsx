import { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { CryptoFormView } from 'views/BuyCrypto/types'
import { FormHeader } from './FormHeader'
import { ProviderQoute } from '../hooks/usePriceQuoter'
import { FormContainer } from '../components/FormContainer'
import Accordion from '../components/AccordianDropdown/Accordian'

export function CryptoQuoteForm({
  setModalView,
  buyCryptoState,
  combinedQuotes,
  fetchQuotes,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
  fetchQuotes: () => Promise<void>
}) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [timer, setTimer] = useState(0)
  const [fetching, setFetching] = useState<boolean>(false)
  const currentChain = useRef(chainId ?? undefined)

  useEffect(() => {
    if (chainId !== currentChain.current) setModalView(CryptoFormView.Input)
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1)
    }, 1000)

    if (timer === 0) {
      setFetching(true)
      fetchQuotes()
        .then(() => {
          clearInterval(interval)
          setFetching(false)
        })
        .catch(() => {
          clearInterval(interval)
          setFetching(false)
        })
      setTimer(30)
    }

    return () => clearInterval(interval)
  }, [timer, fetchQuotes, chainId, setModalView])

  return (
    <>
      <FormHeader
        title={t('Select a Quote')}
        subTitle={t(`Quotes update every ${timer} seconds.`)}
        backTo={() => setModalView(CryptoFormView.Input)}
      />
      <FormContainer>
        <Accordion buyCryptoState={buyCryptoState} combinedQuotes={combinedQuotes} fetching={fetching} />
      </FormContainer>
    </>
  )
}
