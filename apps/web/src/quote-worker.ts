import 'utils/workerPolyfill'

import { getLogger } from 'utils/datadog'
import { CommandFactory } from 'utils/quote-worker/factory'
import { WorkerEvent } from 'utils/quote-worker/types'

const fetch_ = fetch
const logger = getLogger('quote-rpc', { forwardErrorsToLogs: false })

const fetchWithLogging = async (url: RequestInfo | URL, init?: RequestInit) => {
  const start = Date.now()
  let urlString: string | undefined
  let size: number | undefined
  if (init && init.method === 'POST' && init.body) {
    urlString = url.toString()
    size = init.body.toString().length / 1024
  }

  const response = await fetch_(url, init)
  const end = Date.now()
  if (urlString && size) {
    if (!urlString.includes('datadoghq.com')) {
      try {
        logger.info('Quote RPC', {
          rpc: {
            duration: end - start,
            url: urlString,
            size,
            status: response.status,
          },
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  return response
}

globalThis.fetch = fetchWithLogging

// Manage the abort actions for each message
const messageAbortControllers = new Map<number, AbortController>()

// eslint-disable-next-line no-restricted-globals
addEventListener('message', async (event: MessageEvent<WorkerEvent>) => {
  const [id, message] = event.data

  const abortController = new AbortController()
  messageAbortControllers.set(id, abortController)

  try {
    const command = CommandFactory.createCommand(message, id, abortController)
    const result = await command.execute(messageAbortControllers)

    postMessage([
      id,
      {
        success: true,
        result,
      },
    ])
  } catch (error: any) {
    postMessage([id, { success: false, error: error?.message || error }])
  } finally {
    messageAbortControllers.delete(id)
  }
})
