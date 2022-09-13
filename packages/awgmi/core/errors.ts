export class ConnectorNotFoundError extends Error {
  name = 'ConnectorNotFoundError'

  message = 'Connector not found'
}

export class ChainMismatchError extends Error {
  name = 'ChainMismatchError'

  constructor({ activeChain, targetChain }: { activeChain: string; targetChain: string }) {
    super(`Chain mismatch: Expected "${targetChain}", received "${activeChain}".`)
  }
}
