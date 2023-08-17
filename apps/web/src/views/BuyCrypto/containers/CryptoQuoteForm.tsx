import { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { CryptoFormView, ProviderQoute } from 'views/BuyCrypto/types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'
import Accordion from '../components/AccordianDropdown/Accordian'

export function CryptoQuoteForm({
  setModalView,
  fetchQuotes,
  combinedQuotes,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  fetchQuotes: () => Promise<void>
  combinedQuotes: ProviderQoute[]
}) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [timer, setTimer] = useState(30)
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
        shouldCenter
        backTo={() => setModalView(CryptoFormView.Input)}
      />
      <FormContainer>
        <Accordion fetching={fetching} combinedQuotes={combinedQuotes} />
      </FormContainer>
    </>
  )
}
