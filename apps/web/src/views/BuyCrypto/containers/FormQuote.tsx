import { Dispatch, SetStateAction } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { FormContainer } from '../components/FormContainer'
import Accordion from '../components/AccordianDropdown/Accordian'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '..'
import { ProviderQoute } from '../hooks/usePriceQuoter'

export function FormQuote({
  setModalView,
  buyCryptoState,
  combinedQuotes,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
}) {
  return (
    <FormContainer>
      <Accordion buyCryptoState={buyCryptoState} combinedQuotes={combinedQuotes} />
    </FormContainer>
  )
}
