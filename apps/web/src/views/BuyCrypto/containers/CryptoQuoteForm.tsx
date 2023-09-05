import { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { CryptoFormView, ProviderQuote } from 'views/BuyCrypto/types'
import { useAccount } from 'wagmi'
import Accordion from 'views/BuyCrypto/components/AccordionDropdown/Accordion'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'

export function CryptoQuoteForm({
  setModalView,
  fetchQuotes,
  combinedQuotes,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  fetchQuotes: () => Promise<void>
  combinedQuotes: ProviderQuote[]
}) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { address } = useAccount()
  const [timer, setTimer] = useState(30)
  const [fetching, setFetching] = useState<boolean>(false)
  const currentChain = useRef(chainId ?? undefined)
  const currentAccount = useRef(address ?? undefined)

  useEffect(() => {
    if (chainId !== currentChain.current || address !== currentAccount.current) {
      setModalView(CryptoFormView.Input)
    }

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
  }, [timer, fetchQuotes, chainId, setModalView, address])

  return (
    <>
      <FormHeader
        title={t('Select a Quote')}
        subTitle={t(`Quotes update every ${timer} seconds.`)}
        shouldCenter
        backTo={() => setModalView(CryptoFormView.Input)}
      />
      <FormContainer>
        <Accordion fetching={fetching} combinedQuotes={combinedQuotes} setModalView={setModalView} />
      </FormContainer>
    </>
  )
}
