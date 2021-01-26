class RequestError extends Error {
  constructor(message: string, public code: number, public data?: unknown) {
    super(message)
  }
}

export default RequestError