import { NextRequest, NextResponse } from 'next/server'

// Sanctioned Countries: Belarus, Cuba, Democratic Republic of Congo, Iran, Iraq, North Korea, Sudan, Syria, Zimbabwe.
const BLOCK_COUNTRIES = ['BY', 'CU', 'CD', 'IR', 'IQ', 'KP', 'SD', 'SY', 'ZW']

// Sanctioned Regions: Crimea
const BLOCK_REGIONS = ['UA-43']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { geo } = req
  const { country, region } = geo

  // Only track UA for debugging purpose
  if (country === 'UA') {
    // eslint-disable-next-line no-console
    console.log('country-region:', `${country}-${region}`)
  }

  const shouldBlock: boolean =
    BLOCK_COUNTRIES.some((c) => c === country) || BLOCK_REGIONS.some((r) => r === `${country}-${region}`)

  if (shouldBlock) {
    return new Response('Unavailable for legal reasons', { status: 451 })
  }

  return res
}
