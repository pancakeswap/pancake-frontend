import { NextRequest, NextResponse } from 'next/server'
import { BLOCK_COUNTRIES_COOKIE_NAME } from 'config/constants/cookie-names'

// Sanctioned Countries: Belarus, Cuba, Democratic Republic of Congo, Iran, Iraq, North Korea, Sudan, Syria, Zimbabwe.
const BLOCK_COUNTRIES = ['BY', 'CU', 'CD', 'IR', 'IQ', 'KP', 'SD', 'SY', 'ZW']

// Sanctioned Regions: Crimea
const BLOCK_REGRIONS = ['UA-43']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { geo } = req
  const { country, region } = geo

  // Only track UA for debuggin purpose
  if (country === 'UA') {
    // eslint-disable-next-line no-console
    console.log('country-region:', `${country}-${region}`)
  }

  const shouldBlock: boolean =
    BLOCK_COUNTRIES.some((c) => c === country) || BLOCK_REGRIONS.some((r) => r === `${country}-${region}`)

  if (shouldBlock) {
    res.cookie(BLOCK_COUNTRIES_COOKIE_NAME, String(shouldBlock))
  } else {
    res.clearCookie(BLOCK_COUNTRIES_COOKIE_NAME)
  }

  return res
}
