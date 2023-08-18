import { useMemo } from 'react'
import { createFormAtom, AddLiquidityV2AtomProvider } from 'state/mint/reducer'

export default function AddLiquidityV2FormProvider({ children }: { children: React.ReactNode }) {
  const formAtom = useMemo(() => createFormAtom(), [])

  return (
    <AddLiquidityV2AtomProvider
      value={{
        formAtom,
      }}
    >
      {children}
    </AddLiquidityV2AtomProvider>
  )
}
