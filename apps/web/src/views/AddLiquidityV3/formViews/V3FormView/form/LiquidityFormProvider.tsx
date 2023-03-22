import { useMemo } from 'react'
import { createFormAtom, LiquidityAtomProvider } from './reducer'

export default function LiquidityFormProvider({ children }) {
  const formAtom = useMemo(() => createFormAtom(), [])

  return (
    <LiquidityAtomProvider
      value={{
        formAtom,
      }}
    >
      {children}
    </LiquidityAtomProvider>
  )
}
