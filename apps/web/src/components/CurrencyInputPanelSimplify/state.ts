import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

export enum FONT_SIZE {
  SMALL = 16,
  MEDIUM = 18,
  /**  Maximum font size for currency symbol */
  LARGE = 20,
  X_LARGE = 22,
  /** Maximum font size for input panel */
  MAX = 24,
}

export enum LOGO_SIZE {
  SMALL = 24,
  MEDIUM = 26,
  LARGE = 28,
  X_LARGE = 30,
  MAX = 32,
}

export const fontSizeBySymbolAtom = atom<Record<string, { symbol?: number; logo?: number }>>({})

export const useFontSize = (token0Symbol: string, token1Symbol: string) => {
  const [fontSizeBySymbol, setFontSize] = useAtom(fontSizeBySymbolAtom)

  const symbolFontSize = Math.min(
    fontSizeBySymbol[token0Symbol]?.symbol || FONT_SIZE.LARGE,
    fontSizeBySymbol[token1Symbol]?.symbol || FONT_SIZE.LARGE,
  )

  const logoFontSize = Math.min(
    fontSizeBySymbol[token0Symbol]?.logo || LOGO_SIZE.MAX,
    fontSizeBySymbol[token1Symbol]?.logo || LOGO_SIZE.MAX,
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
