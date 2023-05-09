import { useCallback, useMemo } from 'react'
import { createFormAtom, LiquidityAtomProvider } from './reducer'

export default function LiquidityFormProvider({
  children,
  onAddLiquidityCallback,
}: {
  children: React.ReactNode
  onAddLiquidityCallback?: (hash: `0x${string}`) => void
}) {
  const formAtom = useMemo(() => createFormAtom(), [])

  return (
    <LiquidityAtomProvider
      value={{
        formAtom,
        onAddLiquidityCallback: useCallback(
          (hash) => {
            onAddLiquidityCallback?.(hash)
          },
          [onAddLiquidityCallback],
        ),
      }}
    >
      {children}
    </LiquidityAtomProvider>
  )
}
