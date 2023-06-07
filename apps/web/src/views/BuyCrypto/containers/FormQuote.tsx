import { BuyCryptoState } from 'state/buyCrypto/reducer'
import Accordion from '../components/AccordianDropdown/Accordian'
import { FormContainer } from '../components/FormContainer'
// eslint-disable-next-line import/no-cycle
import { ProviderQoute } from '../hooks/usePriceQuoter'

export function FormQuote({
  buyCryptoState,
  combinedQuotes,
  fetching,
}: {
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
  fetching: boolean
}) {
  return (
    <FormContainer>
      <Accordion buyCryptoState={buyCryptoState} combinedQuotes={combinedQuotes} fetching={fetching} />
    </FormContainer>
  )
}
