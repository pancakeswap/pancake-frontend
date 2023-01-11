import { useMemo } from 'react'
import { useTheme as theme } from 'next-themes'

const useTheme = () => {
  const { resolvedTheme } = theme()

  const isDark = useMemo(() => resolvedTheme === 'dark', [resolvedTheme])

  return {
    isDark,
  }
}

export default useTheme
