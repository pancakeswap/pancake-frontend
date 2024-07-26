import { AbortCommand, GetBestTradeCommand, GetBestTradeOffchainCommand, MulticallChunkCommand } from './commands'
import { Command, CommandType, WorkerEvent } from './types'

export class CommandFactory {
  static createCommand(message: WorkerEvent[1], id: number, abortController: AbortController): Command {
    switch (message.cmd) {
      case CommandType.GET_BEST_TRADE:
        return new GetBestTradeCommand(message.params, abortController)
      case CommandType.GET_BEST_TRADE_OFFCHAIN:
        return new GetBestTradeOffchainCommand(message.params, id, abortController)
      case CommandType.MULTICALL_CHUNK:
        return new MulticallChunkCommand(message.params, id)
      case CommandType.ABORT:
        return new AbortCommand(message.params, id)
      default:
        // In case client passes unknown command
        throw new Error(`Unknown command: ${(message as any).cmd}`)
    }
  }
}
