import type { NextApiRequest, NextApiResponse } from 'next'
import { type ApiData } from '@vercel/flags'

import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'

async function handler(_: NextApiRequest, response: NextApiResponse) {
  const apiData: ApiData = {
    definitions: {
      [EXPERIMENTAL_FEATURES.UniversalRouter]: {
        description: 'Controls whether universal router is enabled for swapping',
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
  return response.status(200).json(apiData)
}

export default handler
