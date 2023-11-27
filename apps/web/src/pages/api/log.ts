import { serverLogger } from '../../../datadog'
import tracer from '../../utils/tracer'

export default async function handler(req, res) {
  const span = tracer.startSpan('api.hello')
  try {
    serverLogger.info(`[${req.query.status}][${req.query.datadogData}]`, {
      metadata: '',
      sendLog: true,
    })

    const responseData = {
      message: 'success',
      status: 200,
    }

    return res.status(200).json(responseData)
  } catch (error) {
    serverLogger.error('Error processing GET request:', error)

    const errorResponse = {
      message: req.query,
      status: 500,
    }
    span.finish()

    return res.status(404).json(errorResponse)
  }
}
