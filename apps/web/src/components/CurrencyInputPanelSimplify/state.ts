import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

export const SIZE_ADAPTION_BOUNDARY_MIN_PX_ = 96
export const SIZE_ADAPTION_BOUNDARY_MAX_PX = 116
export const MAX_FONT_SIZE = 24
export const MIN_FONT_SIZE = 16
export const MAX_LOGO_SIZE = 40
export const MIN_LOGO_SIZE = 24

export const fontSizeBySymbolAtom = atom<Record<string, { symbol?: number; logo?: number }>>({})

export const useFontSize = (token0Symbol: string, token1Symbol: string) => {
  const [fontSizeBySymbol, setFontSize] = useAtom(fontSizeBySymbolAtom)

  const symbolFontSize = Math.min(
    fontSizeBySymbol[token0Symbol]?.symbol || MAX_FONT_SIZE,
    fontSizeBySymbol[token1Symbol]?.symbol || MAX_FONT_SIZE,
  )

  const logoFontSize = Math.min(
    fontSizeBySymbol[token0Symbol]?.logo || MAX_FONT_SIZE,
    fontSizeBySymbol[token1Symbol]?.logo || MAX_FONT_SIZE,
  )

  const setFontSizesBySymbol = useCallback(
    (symbol: string, symbolSize: number, logoSize: number) => {
      setFontSize((prev) => ({
        ...prev,
        [symbol]: { symbol: symbolSize || prev[symbol].symbol, logo: logoSize || prev[symbol].logo },
      }))
    },
    [setFontSize],
  )

  return {
    symbolFontSize,
    logoFontSize,
    setFontSizesBySymbol,
  }
}
