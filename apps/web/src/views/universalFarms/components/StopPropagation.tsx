import { PropsWithChildren, useCallback } from 'react'

export const StopPropagation: React.FC<PropsWithChildren> = ({ children }) => {
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    return false
  }, [])

  return (
    <div onClick={handleClick} aria-hidden>
      {children}
    </div>
  )
}
