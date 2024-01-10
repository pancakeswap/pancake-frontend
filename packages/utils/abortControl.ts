export type AbortControl = {
  signal?: AbortSignal
}

export class AbortError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'AbortError'
  }
}

export function abortInvariant(signal: AbortSignal) {
  if (signal.aborted) {
    throw new AbortError('Signal aborted')
  }
}

export function isAbortError(error: Error) {
  return error instanceof AbortError
}
