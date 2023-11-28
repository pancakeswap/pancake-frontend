import { serverLogger } from '../../../winston'

export default async function handler(req, res) {
  try {
    serverLogger.info(`[${req.query.status}][${req.query.datadogData}]`, {
      metadata: '',
      sendLog: true,
    })

    return res.status(200).json({
      message: 'logs sent sucessfully',
      status: 200,
    })
  } catch (error) {
    serverLogger.error('Error processing GET request:', error)

    return res.status(404).json({
      message: req.query,
      status: 500,
    })
  }
}
