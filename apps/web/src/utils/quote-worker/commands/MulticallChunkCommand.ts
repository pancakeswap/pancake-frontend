import { Call } from 'state/multicall/actions'
import { fetchChunk } from 'state/multicall/fetchChunk'
import { Command } from '../types'

export class MulticallChunkCommand implements Command {
  constructor(
    private params: {
      chainId: number
      chunk: Call[]
      minBlockNumber: number
    },
    private id: number,
  ) {
    this.id = id
    this.params = params
  }

  async execute() {
    return fetchChunk(this.params.chainId, this.params.chunk, this.params.minBlockNumber)
  }
}
