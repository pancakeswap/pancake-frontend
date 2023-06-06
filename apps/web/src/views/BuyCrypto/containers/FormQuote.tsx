import { Dispatch, SetStateAction } from 'react'
import { FormContainer } from '../components/FormContainer'
import Accordion from '../components/AccordianDropdown/Accordian'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '..'

export function FormQuote({ setModalView }: { setModalView: Dispatch<SetStateAction<CryptoFormView>> }) {
  return (
    <FormContainer>
      <Accordion />
    </FormContainer>
  )
}
