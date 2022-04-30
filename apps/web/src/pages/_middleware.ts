import { NextRequest, NextResponse } from 'next/server'

// Sanctioned Countries: Belarus, Cuba, Democratic Republic of Congo, Iran, Iraq, North Korea, Sudan, Syria, Zimbabwe.
const BLOCK_COUNTRIES = { BY: 'BY', CU: 'CU', CD: 'CD', IR: 'IR', IQ: 'IQ', KP: 'KP', SD: 'SD', SY: 'SY', ZW: 'ZW' }

// Sanctioned Regions: Crimea
const BLOCK_REGIONS = { 'UA-43': 'UA-43' }

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { geo } = req
  const { country, region } = geo

  const shouldBlock: boolean = BLOCK_COUNTRIES[country] || BLOCK_REGIONS[`${country}-${region}`]

  if (shouldBlock) {
    return new Response('Unavailable for legal reasons', { status: 451 })
  }

  return res
}
