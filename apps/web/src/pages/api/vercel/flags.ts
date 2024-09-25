import { type ApiData } from '@vercel/flags'
import type { NextApiRequest, NextApiResponse } from 'next'

import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { isVercelToolbarEnabled } from 'utils/vercelToolbar'

async function handler(_: NextApiRequest, response: NextApiResponse) {
  if (!isVercelToolbarEnabled()) {
    return response.status(401).json(null)
  }

  const apiData: ApiData = {
    definitions: {
      [EXPERIMENTAL_FEATURES.PCSX]: {
        description: 'Controls whether PCS X is enabled',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      [EXPERIMENTAL_FEATURES.SpeedQuote]: {
        description: 'Controls whether fast routing is enabled for quoting',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      [EXPERIMENTAL_FEATURES.PriceAPI]: {
        description: 'Controls whether price api is enabled for quoting',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      [EXPERIMENTAL_FEATURES.WebNotifications]: {
        description: 'Controls whether web notification feature is enabled',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
    },
    overrideEncryptionMode: 'plaintext',
  }
  response.setHeader('Cache-Control', `max-age=86400, s-maxage=604800`)
  return response.status(200).json(apiData)
}

export default handler
