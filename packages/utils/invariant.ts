export class InvariantError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, InvariantError.prototype)
  }
}

export function invariant(condition: unknown, message: string | (() => string)): asserts condition {
  if (!condition) {
    throw new InvariantError(typeof message === 'function' ? message() : message)
  }
}
