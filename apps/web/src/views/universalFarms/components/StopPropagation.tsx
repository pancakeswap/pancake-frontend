import { PropsWithChildren, useCallback } from 'react'

export const StopPropagation: React.FC<PropsWithChildren> = ({ children }) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    // do not use e.preventDefault
    // it'll reset the default behavior when event bubble here, see the ticket:
    // https://linear.app/pancakeswap/issue/PAN-3627/2-cannot-uncheck-compound
    e.stopPropagation()
    return false
  }, [])

  return (
    <div onClick={handleClick} aria-hidden>
      {children}
    </div>
  )
}
