import { CELER_API } from 'config/constants/endpoints'
import { MsgStatus } from './actions'

export const fetchCelerApi = async (hash: string) => {
  try {
    const response = await fetch(`${CELER_API}/searchByTxHash?tx=${hash}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()
    if (!result.txSearchInfo[0]) {
      return {
        destinationTxHash: '',
        messageStatus: MsgStatus.MS_UNKNOWN,
      }
    }

    const { message } = result.txSearchInfo[0]
    return {
      destinationTxHash: message[0].execution_tx,
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
