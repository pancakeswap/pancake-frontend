import { BuyCryptoState } from 'state/buyCrypto/reducer'
import Accordion from '../components/AccordianDropdown/Accordian'
import { FormContainer } from '../components/FormContainer'
// eslint-disable-next-line import/no-cycle
import { ProviderQoute } from '../hooks/usePriceQuoter'

export function FormQuote({
  buyCryptoState,
  combinedQuotes,
}: {
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
}) {
  return (
    <FormContainer>
      <Accordion buyCryptoState={buyCryptoState} combinedQuotes={combinedQuotes} />
    </FormContainer>
  )
}
