interface FetchTimeoutOptions extends RequestInit {
  timeout?: number
}

const fetchWithTimeout = (url, options: FetchTimeoutOptions = {}): Promise<Response> => {
  const { timeout = 10000, ...fetchOptions } = options

  return Promise.race([
    fetch(url, fetchOptions),
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request for ${url} timed out after ${timeout} milliseconds`))
      }, timeout)
    }),
  ]) as Promise<Response>
}

export default fetchWithTimeout
