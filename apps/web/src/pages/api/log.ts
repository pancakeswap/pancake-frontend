import { serverLogger } from '../../../winston'

export default async function handler(req, res) {
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

    return res.status(404).json(errorResponse)
  }
}
