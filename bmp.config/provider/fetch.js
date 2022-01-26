import mpService from '@binance/mp-service'

const fetch = async (url, options = {}) => {
  const res = await mpService.request({
    url,
    method: options.method || 'GET',
    data: options.body,
    header: options.headers,
  })
  if (res.statusCode >= 200 && res.statusCode < 300) {
    res.ok = true
  }
  res.headers = {
    get: (key) => res.header[key.toLowerCase()],
  }

  return res
}
export default fetch
