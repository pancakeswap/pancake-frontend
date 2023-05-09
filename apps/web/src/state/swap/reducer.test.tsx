import { StrictMode } from 'react'
import { fireEvent, render } from '@testing-library/react'
import { useAtom } from 'jotai'
import { Field, selectCurrency } from './actions'
import { swapReducerAtom } from './reducer'

describe('swap reducer', () => {
  describe('selectToken', () => {
    it('changes token', async () => {
      const Parent = () => {
        const [swapState, dispatch] = useAtom(swapReducerAtom)
        return (
          <>
            <div>currencyInput: {swapState[Field.INPUT].currencyId}</div>
            <div>currencyOutput: {swapState[Field.OUTPUT].currencyId}</div>
            <div>typedValue: {swapState.typedValue}</div>
            <div>independentField: {swapState.independentField}</div>
            <div>recipient: {swapState.recipient}</div>
            <button
              type="button"
              onClick={() =>
                dispatch(
                  selectCurrency({
                    field: Field.OUTPUT,
                    currencyId: '0x0000',
                  }),
                )
              }
            >
              dispatch Currency
            </button>
          </>
        )
      }

      const { findByText, getByText } = render(
        <StrictMode>
          <Parent />
        </StrictMode>,
      )

      fireEvent.click(getByText('dispatch Currency'))
      await findByText('currencyInput:')
      await findByText('currencyOutput: 0x0000')
      await findByText('typedValue:')
      await findByText('independentField: INPUT')
      await findByText('recipient:')
    })
  })
})
