export type AbortControl = {
  signal?: AbortSignal
}

export class AbortError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'AbortError'
  }
}

export function abortInvariant(signal?: AbortSignal, message?: string) {
  if (signal?.aborted) {
    throw new AbortError(message || 'Signal aborted')
  }
}

export function isAbortError(error: Error) {
  return error instanceof AbortError
}
