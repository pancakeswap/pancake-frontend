import { Command } from '../types'

export class AbortCommand implements Command {
  constructor(private params: number, private id: number) {
    this.id = id
    this.params = params
  }

  async execute(messageAbortControllers: Map<number, AbortController>) {
    // Implementation of abort logic
    const ac = messageAbortControllers.get(this.params)

    if (!ac) {
      throw new Error(`Abort controller not found for event id: ${this.id}`)
    }

    ac?.abort()

    return true
  }
}
