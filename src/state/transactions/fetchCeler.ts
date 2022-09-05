import { CELER_API } from 'config/constants/endpoints'
import { MsgStatus } from './actions'

export const fetchCeler = async (hash: string) => {
  try {
    const response = await fetch(`${CELER_API}/searchByTxHash?tx=${hash}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()
    const { transfer, message } = result.txSearchInfo[0]
    return {
      destinationTxHash: transfer[0].dst_tx_hash,
      messageStatus: message[0].msg_status,
    }
  } catch (error) {
    console.error('Fetch Risk Token error: ', error)
    return {
      destinationTxHash: '',
      messageStatus: MsgStatus.MS_UNKNOWN,
    }
  }
}
