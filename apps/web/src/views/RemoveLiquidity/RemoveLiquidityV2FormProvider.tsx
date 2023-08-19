import { useMemo } from 'react'
import { createFormAtom, RemoveLiquidityV2AtomProvider } from 'state/burn/reducer'

export default function RemoveLiquidityV2FormProvider({ children }: { children: React.ReactNode }) {
  const formAtom = useMemo(() => createFormAtom(), [])

  return (
    <RemoveLiquidityV2AtomProvider
      value={{
        formAtom,
      }}
    >
      {children}
    </RemoveLiquidityV2AtomProvider>
  )
}
