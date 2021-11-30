/* eslint-disable prefer-destructuring */
import { ethers, logger } from 'ethers'
import { Logger } from '@ethersproject/logger'
import { Network } from '@ethersproject/networks'
import { defineReadOnly } from '@ethersproject/properties'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()

class JsonRpcProvider extends ethers.providers.JsonRpcBatchProvider implements ethers.providers.StaticJsonRpcProvider {
  // from ethers.providers.StaticJsonRpcProvider
  async detectNetwork(): Promise<Network> {
    let network = this.network
    if (network == null) {
      network = await super.detectNetwork()

      if (!network) {
        logger.throwError('no network detected', Logger.errors.UNKNOWN_ERROR, {})
      }

      // If still not set, set it
      if (this._network == null) {
        // A static network does not support "any"
        defineReadOnly(this, '_network', network)

        this.emit('network', network, null)
      }
    }
    return network
  }
}

export const simpleRpcProvider = new JsonRpcProvider(RPC_URL)

export default null
