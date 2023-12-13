import type { NextRequest } from 'next/server'
import { number as zNumber, object as zObject, string as zString } from 'zod'

const zCSPReport = zObject({
  'blocked-uri': zString(),
  disposition: zString(),
  'document-uri': zString(),
  'effective-directive': zString(),
  'original-policy': zString(),
  referrer: zString(),
  'status-code': zNumber(),
  'violated-directive': zString(),
})

const zBody = zObject({
  'csp-report': zCSPReport,
})

export const config = {
  runtime: 'edge',
}

export default async (req: NextRequest) => {
  const badRequestRes = new Response(null, { status: 400, statusText: 'Bad Request' })
  if (req.method !== 'POST') {
    return badRequestRes
  }

  try {
    const json = await req.json()
    const parsed = zBody.safeParse(json)
    if (parsed.success === false) {
      console.error('CSP-Report invalid request', {
        body: json,
        error: parsed.error,
      })
      return badRequestRes
    }

    console.info('CSP-Report violation', {
      ...parsed.data['csp-report'],
    })
    return new Response(null, { status: 200, statusText: 'OK' })
  } catch (e) {
    console.error('CSP-Report unexpected error', {
      error: e,
    })
    return badRequestRes
  }
}
