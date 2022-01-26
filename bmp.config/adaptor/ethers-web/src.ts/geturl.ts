import mpService from '@binance/mp-service'
import { GetUrlResponse, Options } from './types'

export { GetUrlResponse, Options }

export async function getUrl(href: string, options?: Options): Promise<GetUrlResponse> {
  if (options == null) {
    options = {}
  }
  const requestOptions = {
    headers: options.headers || {},
    body: undefined,
  }
  if (options.allowGzip) {
    requestOptions.headers['accept-encoding'] = 'gzip'
  }
  // add the body and transform the body's type from Buffer to Object
  if (options.body) {
    requestOptions.body = JSON.parse(Buffer.from(options.body).toString('utf8', 0))
  }
  delete requestOptions.headers['Content-Length']
  const response = await mpService.request({
    url: href,
    method: options.method,
    data: requestOptions.body || undefined,
    headers: requestOptions.headers,
  })

  const result = {
    statusCode: response.status,
    statusMessage: response.statusText,
    headers: response.headers,
    body: Buffer.from(JSON.stringify(response.data)),
  }
  return result
}
