import { NextRequest, NextResponse } from 'next/server'
import { BLOCK_COUNTRIES_COOKIE_NAME } from 'config/constants/cookie-names'

const BLOCK_COUNTRIES = ['BY', 'CU', 'IR', 'IQ', 'CI', 'LR', 'KP', 'SD', 'SY', 'ZW']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const cookie = req.cookies[BLOCK_COUNTRIES_COOKIE_NAME]

  if (cookie) {
    return res
  }

  const { geo } = req
  const { country } = geo

  const isBlockCountry: boolean = BLOCK_COUNTRIES.some((c) => c === country)

  if (isBlockCountry) {
    res.cookie(BLOCK_COUNTRIES_COOKIE_NAME, String(isBlockCountry))
  }

  return res
}
