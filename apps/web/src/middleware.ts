import { NextRequest, NextResponse } from 'next/server'
import { getBucket, INFO_BUCKETS } from 'utils/buckets'

// Sanctioned Countries: Belarus, Cuba, Democratic Republic of Congo, Iran, Iraq, North Korea, Sudan, Syria, Zimbabwe.
const BLOCK_COUNTRIES = { BY: 'BY', CU: 'CU', CD: 'CD', IR: 'IR', IQ: 'IQ', KP: 'KP', SD: 'SD', SY: 'SY', ZW: 'ZW' }

// Sanctioned Regions: Crimea
const BLOCK_REGIONS = { 'UA-43': 'UA-43' }

const INFO_BUCKETS_COOKIES = 'bucket-info-2'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { geo } = req
  const { country, region } = geo

  // bucket
  let bucket = req.cookies.get(INFO_BUCKETS_COOKIES)
  let hasBucket = !!bucket

  // If there's no active bucket in cookies or its value is invalid, get a new one
  if (!bucket) {
    bucket = getBucket(INFO_BUCKETS, 'sf')
    hasBucket = false
  }

  if (!hasBucket) {
    res.cookies.set(INFO_BUCKETS_COOKIES, bucket)
  }

  const shouldBlock: boolean = BLOCK_COUNTRIES[country] || BLOCK_REGIONS[`${country}-${region}`]

  if (shouldBlock) {
    return NextResponse.redirect(new URL('/451', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/swap',
    '/pool',
    '/pools',
    '/farms',
    '/add',
    '/ifo',
    '/remove',
    '/prediction',
    '/find',
    '/limit-orders',
    '/lottery',
    '/nfts',
    '/info/:path*',
  ],
}
